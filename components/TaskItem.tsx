"use client";

import { Task } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useState } from "react";

// "use client" is required because this component owns interactive state
// (useState) and responds to a click event. Note: since there's no backend
// yet, toggling here only affects this component's local state and will
// reset on page refresh — real persistence arrives in Week 5 (database)
// and Week 4 (API routes).

export default function TaskItem({
  task,
  isOwner,
  groupId,
}: {
  task: Task;
  isOwner: boolean;
  groupId: string;
}) {
  const router = useRouter();
  const [done, setDone] = useState(task.done);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleToggle() {
    if (!isOwner) return;

    const previousValue = done;
    const newValue = !done;

    setDone(newValue);
    setError(null);

    try {
      const res = await fetch(`/api/groups/${groupId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newValue }),
      });

      if (!res.ok) {
        setDone(previousValue);
        setError("Couldn't update task.");
      }
    } catch {
      setDone(previousValue);
      setError("Couldn't update task.");
    }
  }

  async function handleDelete() {
    if (!isOwner) return;

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/groups/${groupId}/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setIsDeleting(false);
        setError("Couldn't delete task.");
        return;
      }

      router.refresh();
    } catch {
      setIsDeleting(false);
      setError("Couldn't delete task.");
    }
  }

  return (
    <li className="flex items-center gap-3 rounded-md border px-3 py-2 text-pink-700 hover:bg-pink-100">
      <input
        type="checkbox"
        checked={done}
        disabled={!isOwner}
        onChange={handleToggle}
        className="h-4 w-4 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span className={done ? "line-through text-purple-400" : ""}>
        {task.title}
      </span>
      {isOwner && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-auto text-xs text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </li>
  );
}