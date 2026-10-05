import DeleteGroupButton from "@/components/DeleteGroupButton";
import NewTaskForm from "@/components/NewTaskForm";
import TaskItem from "@/components/TaskItem";
import BookSearch from "@/components/BookSearch";
import { authOptions } from "@/lib/auth";
import { getGroupById } from "@/lib/data";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

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

  const isOwner = session?.user.id === group.ownerId;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-purple-950">
          {group.name}
        </h1>

        {isOwner && <DeleteGroupButton groupId={group.id} />}
      </div>

      <p className="text-purple-800">
        {group.subject} · {group.memberCount} members · Created by{" "}
        {group.owner.name}
      </p>

      <h2 className="mt-8 text-lg font-semibold text-purple-950">
        Tasks
      </h2>

      <ul className="mt-3 flex flex-col gap-2">
        {group.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isOwner={isOwner}
            groupId={group.id}
          />
        ))}
      </ul>

      {isOwner && <NewTaskForm groupId={group.id} />}

      <h2 className="mt-10 text-lg font-semibold">
        Reference Books
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Powered by the Open Library API — search for books related to{" "}
        {group.subject}.
      </p>

      <div className="mt-3">
        <BookSearch initialQuery={group.subject} />
      </div>
    </div>
  );
}