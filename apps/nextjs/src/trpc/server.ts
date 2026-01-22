import "server-only";

import { cookies } from "next/headers";
import { createTRPCProxyClient, loggerLink, TRPCClientError } from "@trpc/client";

import { AppRouter } from "@saasfly/api";

import { transformer } from "./shared";
import { observable } from "@trpc/server/observable";
import { callProcedure } from "@trpc/server";
import { TRPCErrorResponse } from "@trpc/server/rpc";
import { cache } from "react";
import { appRouter } from "../../../../packages/api/src/root";
import { getServerSession } from "next-auth";
import { authOptions } from "@saasfly/auth";

type Session = Awaited<ReturnType<typeof getServerSession>>;

export const createTRPCContext = async (opts: {
  headers: Headers;
  auth?: Session;
}) => {
  const session = opts.auth ?? (await getServerSession(authOptions));
  return {
    userId: session?.user?.id,
    session,
    ...opts,
  };
};


const createContext = cache(async () => {
  return createTRPCContext({
    headers: new Headers({
      cookie: cookies().toString(),
      "x-trpc-source": "rsc",
    }),
  });
});

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    () =>
      ({op}) =>
        observable((observer) => {
          createContext()
            .then((ctx) => {
              return callProcedure({
                procedures: appRouter._def.procedures,
                path: op.path,
                rawInput: op.input,
                ctx,
                type: op.type,
              });
            })
            .then((data) => {
              observer.next({result: {data}});
              observer.complete();
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause));
            });
        }),
  ],
});
export {type RouterInputs, type RouterOutputs} from "@saasfly/api";
