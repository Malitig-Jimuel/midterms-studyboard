"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
	const router = useRouter();
	const [error, setError] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		const confirmed = window.confirm(
			"Are you sure you want to delete this group?"
		);
		if (!confirmed) return;

		setIsDeleting(true);
		setError("");

		try {
			const response = await fetch(`/api/groups/${groupId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.error || "Failed to delete group");
			}

			router.push("/groups");
			router.refresh();
		} catch (err) {
			setIsDeleting(false);
			setError(err instanceof Error ? err.message : "Could not delete group");
		}
	}

	return (
		<div>
			<Button
				type="button"
				variant="secondary"
				onClick={handleDelete}
				disabled={isDeleting}
			>
				{isDeleting ? "Deleting..." : "Delete group"}
			</Button>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
}
