import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "E-mail/Password",
      credentials: {
        email: {
          label: "E-mail",
          type: "email",
          placeholder: "E-mail",
        },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password || "";
        const user = await prisma.user.findUnique({ where: { email } });
        if (user == null) {
          return null;
        }
        if (bcrypt.compareSync(password, user.crypted_password || "")) {
          const { crypted_password, emailVerified, ...user2 } = user;
          return user2;
        } else {
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
