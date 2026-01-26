/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// 引入全局代理配置
import "../../../proxy-config";

import NextAuth from "next-auth";

import { authOptions } from "@saasfly/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
