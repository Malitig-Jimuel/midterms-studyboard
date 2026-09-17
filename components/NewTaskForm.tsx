"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function NewTaskForm({ groupId }: { groupId: string }) {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			const response = await fetch(`/api/groups/${groupId}/tasks`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title }),
			});

			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.error || "Failed to create task");
			}

			setTitle("");
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not create task");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex items-start gap-2">
			<div>
				<label htmlFor="task-title" className="sr-only">
					Task title
				</label>
				<input
					id="task-title"
					type="text"
					required
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder="Add a task"
					className="rounded-md border px-3 py-2 text-sm"
				/>
				{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
			</div>
			<Button type="submit" disabled={isSubmitting} className="whitespace-nowrap">
				{isSubmitting ? "Adding..." : "Add task"}
			</Button>
		</form>
	);
}
