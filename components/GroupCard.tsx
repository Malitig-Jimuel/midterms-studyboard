
import { Group } from "@/lib/data";
import Link from "next/link";

// Purely presentational, no interactivity -> stays a Server Component.
export default function GroupCard({ group }: { group: Group }) {
  const completedCount = group.tasks.filter((t) => t.done).length;

  return (
    <Link
      href={`/groups/${group.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold text-slate-900">{group.name}</h3>
      <p className="text-sm text-slate-500">{group.subject}</p>
      <div className="mt-2 flex justify-between text-sm text-slate-600">
        <span>{group.memberCount} members</span>
        <span>
          {completedCount}/{group.tasks.length} tasks done
        </span>
      </div>
    </Link>
  );
}
