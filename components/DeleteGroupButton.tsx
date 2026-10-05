"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./Button";

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this group? This can't be undone."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setIsDeleting(false);
        setError("Couldn't delete group.");
        return;
      }

      router.push("/groups");
      router.refresh();
    } catch {
      setIsDeleting(false);
      setError("Couldn't delete group.");
    }
  }

  return (
    <div>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          className="whitespace-nowrap rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          {isDeleting ? "Deleting..." : "Delete Group"}
        </Button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}