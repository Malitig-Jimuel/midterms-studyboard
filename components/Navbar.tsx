
"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/groups", label: "Groups" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg text-slate-900">StudyBoard</span>
        <div className="flex gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "font-semibold text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }
              >
                {link.label}
              </Link>
            );
          })}
          {status === "authenticated" && (
            <Link
              href="/groups/new"
              className={
                pathname === "/groups/new"
                  ? "font-semibold text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }
            >
              New Group
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        {status === "authenticated" ? (
          <>
            <span className="text-slate-700">Hello, {session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-slate-600 hover:text-slate-900"
            >
              Sign Out
            </button>
          </>
        ) 
        : 
        (
          <>
            <Link href="/login" className="text-slate-600 hover:text-slate-900">
              Log In
            </Link>
            <Link href="/register" className="text-slate-600 hover:text-slate-900">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
