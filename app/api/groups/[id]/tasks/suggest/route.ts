
import {
  AIBadResponseError,
  AIFeatureUnavailableError,
  generateSubtaskSuggestions,
} from "@/lib/ai";
import { authOptions } from "@/lib/auth";
import { getGroupById } from "@/lib/data";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";

const suggestSchema = z.object({
  topic: z.string().trim().min(1, "A topic is required").max(200),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const parsed = suggestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const group = await getGroupById(params.id);

    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    if (group.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the owner can suggest tasks for this group" },
        { status: 403 }
      );
    }

    const subtasks = await generateSubtaskSuggestions(
      parsed.data.topic,
      group.id
    );

    return NextResponse.json({ subtasks });
  } catch (error) {
    // Log the original error in the server terminal.
    if (axios.isAxiosError(error)) {
      console.error("AI Axios error:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });

      return NextResponse.json(
        { error: "The AI service request failed. Check the server logs." },
        { status: 502 }
      );
    }

    if (error instanceof AIFeatureUnavailableError) {
      console.error("AI feature unavailable:", error.message);

      return NextResponse.json(
        { error: "AI feature is currently unavailable." },
        { status: 503 }
      );
    }

    if (error instanceof AIBadResponseError) {
      console.error("Invalid AI response:", error.message);

      return NextResponse.json(
        { error: "The AI service returned an invalid response." },
        { status: 502 }
      );
    }

    console.error("Unexpected task suggestion error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while suggesting tasks." },
      { status: 500 }
    );
  }
}
