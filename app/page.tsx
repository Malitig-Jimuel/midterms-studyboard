import GroupCard from "@/components/GroupCard";
import { getGroups } from "@/lib/data";

// A Server Component — Server Components can be `async` and query the
// database directly, no client-side fetching needed.
export default async function Home() {
  const allGroups = await getGroups();
  const groups = allGroups.slice(0, 2); // "featured" = first two for now

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-4xl font-bold text-purple-950 text-center">Welcome to StudyBoard</h1>
      <p className="mt-4 text-purple-600 text-center">
        Coordinate tasks with your study groups, all in one place.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-purple-900">Featured Groups</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </main>
  );
}
