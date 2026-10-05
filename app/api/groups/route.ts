import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGroups, createGroup } from "@/lib/data";
import { createGroupSchema } from "@/lib/validations";

// GET /api/groups — list every group. Stays PUBLIC — no changes needed.

export async function GET() {
  const groups = await getGroups();

  return NextResponse.json(groups);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to create a group" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const parsedResponse = createGroupSchema.safeParse(body);

  if (!parsedResponse.success) {
    return NextResponse.json(
      { error: parsedResponse.error.issues[0].message },
      { status: 400 }
    );
  }

  const newGroup = await createGroup({
    ...parsedResponse.data,
    ownerId: session.user.id,
  });

  return NextResponse.json(newGroup, { status: 201 });
}