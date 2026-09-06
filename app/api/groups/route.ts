import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGroups, createGroup } from "@/lib/data";

export async function GET() {
  const groups = await getGroups();
  return NextResponse.json(groups);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.name || !body.subject) {
    return NextResponse.json(
      { error: "'name' and 'subject' are required" },
      { status: 400 }
    );
  }

  const newGroup = await createGroup({
    name: body.name,
    subject: body.subject,
    memberCount: body.memberCount,
    ownerId: session.user.id,
  });

  return NextResponse.json(newGroup, { status: 201 });
}
