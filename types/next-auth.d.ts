import { DefaultSession } from "next-auth";

// By default, NextAuth's Session type only knows about name/email/image.
// Since our jwt/session callbacks add a custom `id` field, we augment the
// library's types here so TypeScript (and autocomplete) knows about it
// everywhere in the app — e.g. `session.user.id` instead of a type error.

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
