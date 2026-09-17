"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/lib/data";
import Button from "@/components/Button";

export default function TaskItem({
  task,
  groupId,
  isOwner,
}: {
  task: Task;
  groupId: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [done, setDone] = useState(task.done);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    if (!isOwner) return;

    const previousDone = done;
    const nextDone = !previousDone;
    setDone(nextDone);
    setError("");

    try {
      const response = await fetch(
        `/api/groups/${groupId}/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: nextDone }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update task");
      }
    } catch (err) {
      setDone(previousDone);
      setError(err instanceof Error ? err.message : "Could not update task");
    }
  }

  async function handleDelete() {
    if (!isOwner) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/groups/${groupId}/tasks/${task.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete task");
      }

      router.refresh();
    } catch (err) {
      setIsDeleting(false);
      setError(err instanceof Error ? err.message : "Could not delete task");
    }
  }

  return (
    <li className="flex items-center gap-3 rounded-md border px-3 py-2">
      <input
        type="checkbox"
        checked={done}
        onChange={handleToggle}
        disabled={!isOwner || isDeleting}
        className="h-4 w-4"
      />
      <span className={done ? "line-through text-gray-400" : ""}>
        {task.title}
      </span>
      {isOwner && (
        <Button
          type="button"
          variant="secondary"
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-auto px-2 py-1 text-xs"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </li>
  );
}
