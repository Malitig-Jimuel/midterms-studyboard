import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();

  const parsedResponse = registerSchema.safeParse(body);

  if (!parsedResponse.success) {
    return NextResponse.json(
      { error: parsedResponse.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, email, password } = parsedResponse.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json(
      { error: "An account with that email already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return NextResponse.json(
    { id: user.id, name: user.name, email: user.email },
    { status: 201 }
  );
}