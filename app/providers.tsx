"use client";

import { SessionProvider } from "next-auth/react";

// useSession() (used in client components like Navbar) needs a
// SessionProvider somewhere above it in the component tree. Since
// SessionProvider itself uses React context (a client-only feature),
// it needs "use client" — and since our root layout is a Server
// Component, we isolate the client-only wrapping into this small file.
export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
