import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGroupById } from "@/lib/data";
import TaskItem from "@/components/TaskItem";
import DeleteGroupButton from "@/components/DeleteGroupButton";
import NewTaskForm from "@/components/NewTaskForm";
import BookSearch from "@/components/BookSearch";
import AISubtaskGenerator from "@/components/AISubtaskGenerator";
import RealtimeNotifications from "@/components/RealtimeNotifications";

export default async function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [group, session] = await Promise.all([
    getGroupById(params.id),
    getServerSession(authOptions),
  ]);

  if (!group) {
    notFound();
  }

  const isOwner = session?.user?.id === group.ownerId;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pink-800">{group.name}</h1>
          <p className="text-sm text-pink-500">{group.subject}</p>
        </div>

        {isOwner && (
          <DeleteGroupButton groupId={group.id} />
        )}
      </div>

      <ul className="space-y-3">
        {group.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            groupId={group.id}
            isOwner={isOwner}
          />
        ))}
        {group.tasks.length === 0 && (
          <li className="text-sm text-pink-500">No tasks yet.</li>
        )}
      </ul>

      {isOwner && (
        <div className="mt-4">
          <NewTaskForm groupId={group.id} />
        </div>
      )}

      <h2 className="mt-8 text-lg font-semibold text-pink-800">Reference Books</h2>
      <p className="mt-1 text-sm text-pink-500">
        Powered by the Open Library API - search for books related to{" "}
        {group.subject}.
      </p>
      <div className="mt-3">
        <BookSearch initialQuery={group.subject} />
      </div>
        {isOwner && (
          <div className="mt-4">
            <AISubtaskGenerator groupId={group.id} />
          </div>
        )}
        <RealtimeNotifications groupId={group.id} />
    </div>
  );
}