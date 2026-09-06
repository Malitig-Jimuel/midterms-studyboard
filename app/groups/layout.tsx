// A nested layout — wraps only pages under /groups (i.e. /groups and /groups/[id]).
// Demonstrates that layouts can nest and each adds its own shared UI.
export default function GroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-24 pt-10">
      <p className="mb-6 text-xs uppercase tracking-wide text-gray-400">
        StudyBoard / Groups
      </p>
      {children}
    </div>
  );
}
