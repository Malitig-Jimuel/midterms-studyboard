"use client";

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from "react";
import Button from "./Button";

export default function NewTaskForm({ groupId }: { groupId: string }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/groups/${groupId}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                setError(data?.message ?? "Couldn't add task.");
                setIsSubmitting(false);
                return;
            }

            setTitle("");
            router.refresh();
        } catch {
            setError("Couldn't add task.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    required
                    placeholder="Add a new task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Task"}
                </Button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}