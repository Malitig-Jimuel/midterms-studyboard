import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth handles ALL auth-related HTTP traffic through this single
// catch-all route: signing in, signing out, session checks, CSRF tokens,
// etc. That's what [...nextauth] (a "catch-all" dynamic segment) means —
// it matches /api/auth/anything.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
