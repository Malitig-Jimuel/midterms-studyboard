"use client";

import { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import Button from "./Button";
import { socket } from "@/lib/socketClient";

export default function NewTaskForm({ groupId }: { groupId: string }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const res = await fetch(`/api/groups/${groupId}/tasks`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-Socket-Id": socket.id ?? "",
            },
            body: JSON.stringify({ title }),
            });
            
            setIsSubmitting(false);

            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? "Something went wrong.");
                return;
            }

            setTitle("");
            router.refresh();
        }
        
    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    required
                    placeholder="Add a new task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Task"}
                </Button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}