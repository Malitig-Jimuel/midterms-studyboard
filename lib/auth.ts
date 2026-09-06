import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
session: {
strategy: "jwt",
},

secret: process.env.NEXTAUTH_SECRET,

pages: {
signIn: "/login",
},

providers: [
CredentialsProvider({
name: "Credentials",

  credentials: {
    email: {
      label: "Email",
      type: "email",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },

  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      return null;
    }

    const email = credentials.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!passwordMatches) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },
}),

],

callbacks: {
async jwt({ token, user }) {
if (user) {
token.id = user.id;
}

  return token;
},

async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
  }

  return session;
},

},
};