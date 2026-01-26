import { getServerSession, NextAuthOptions, User } from "next-auth";
import { KyselyAdapter } from "@auth/kysely-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";


import { MagicLinkEmail, safeSendEmail, siteConfig } from "@saasfly/common";

import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

import { db } from "./db";
import { env } from "./env.mjs";

type UserId = string;
type IsAdmin = boolean;

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      isAdmin: IsAdmin;
    };
  }
}

declare module "next-auth" {
  interface JWT {
    isAdmin: IsAdmin;
  }
}

// 配置全局代理
if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) {
  process.env.GLOBAL_AGENT_HTTP_PROXY = process.env.HTTP_PROXY;
  process.env.GLOBAL_AGENT_HTTPS_PROXY = process.env.HTTPS_PROXY;
  require('global-agent/bootstrap');
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  adapter: KyselyAdapter(db),

  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      httpOptions: { 
        timeout: 30000,
      },
    }),
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        const user = await db
          .selectFrom("User")
          .select(["name", "emailVerified"])
          .where("email", "=", identifier)
          .executeTakeFirst();
        const userVerified = !!user?.emailVerified;
        const authSubject = userVerified
          ? `Sign-in link for ${(siteConfig as { name: string }).name}`
          : "Activate your account";

        try {
          await safeSendEmail({
            from: env.RESEND_FROM,
            to: identifier,
            subject: authSubject,
            react: MagicLinkEmail({
              firstName: user?.name ?? "",
              actionUrl: url,
              mailType: userVerified ? "login" : "register",
              siteName: (siteConfig as { name: string }).name,
            }),
            // Set this to prevent Gmail from threading emails.
            // More info: https://resend.com/changelog/custom-email-headers
            headers: {
              "X-Entity-Ref-ID": new Date().getTime() + "",
            },
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      },
    }),
  ],
  callbacks: {
    session({ token, session }) {
      if (token) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.picture;
          session.user.isAdmin = token.isAdmin as boolean;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (env.IS_DEBUG === "true") {
          console.log("[JWT] New user signing in:", { id: user.id, email: user.email });
        }
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        return token;
      }

      const email = token?.email ?? "";
      if (!email) {
        if (env.IS_DEBUG === "true") {
          console.log("[JWT] No email in token");
        }
        return token;
      }

      const dbUser = await db
        .selectFrom("User")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst();

      if (!dbUser) {
        if (env.IS_DEBUG === "true") {
          console.log("[JWT] User not found in database:", email);
        }
        return token;
      }

      let isAdmin = false;
      if (env.ADMIN_EMAIL) {
        const adminEmails = env.ADMIN_EMAIL.split(",");
        if (email) {
          isAdmin = adminEmails.includes(email);
        }
      }

      const result = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        isAdmin: isAdmin,
      };

      if (env.IS_DEBUG === "true") {
        console.log("[JWT] Returning token:", { id: result.id, email: result.email, isAdmin: result.isAdmin });
      }

      return result;
    },
  },
  debug: process.env.NODE_ENV !== "production",
};

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
