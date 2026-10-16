import NewGroupForm from "@/components/NewGroupForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Protect this page — only logged-in users can access it.
export default async function NewGroupPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-bold text-slate-900">
        Create a New Group
      </h1>
      <div className="mt-6">
        <NewGroupForm />
      </div>
    </div>
  );
}
