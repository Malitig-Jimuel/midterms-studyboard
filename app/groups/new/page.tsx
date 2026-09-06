import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NewGroupForm from "@/components/NewGroupForm";

export default async function NewGroupPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-bold">Create a New Group</h1>
      <div className="mt-6">
        <NewGroupForm />
      </div>
    </div>
  );
}
