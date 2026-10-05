import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data so this script can be re-run safely.
  await prisma.task.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  // Create a demo account so you have something to log in with
  // immediately after seeding.
  const hashedPassword = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo Student",
      email: "demo@studyboard.test",
      password: hashedPassword,
    },
  });

  await prisma.group.create({
    data: {
      name: "Data Structures Study Circle",
      subject: "Computer Science",
      memberCount: 5,
      ownerId: demoUser.id,
      tasks: {
        create: [
          { title: "Review binary trees", done: false },
          { title: "Practice linked list problems", done: true },
          { title: "Summarize Big-O notation", done: false },
        ],
      },
    },
  });

  await prisma.group.create({
    data: {
      name: "Thermodynamics Crew",
      subject: "Physics",
      memberCount: 3,
      ownerId: demoUser.id,
      tasks: {
        create: [
          { title: "Solve entropy problem set", done: false },
          { title: "Read Chapter 4", done: false },
        ],
      },
    },
  });

  await prisma.group.create({
    data: {
      name: "Philippine History Readers",
      subject: "History",
      memberCount: 8,
      ownerId: demoUser.id,
      tasks: {
        create: [
          { title: "Outline Chapter 2 discussion", done: true },
          { title: "Prepare debate points", done: false },
          { title: "Watch assigned documentary", done: true },
        ],
      },
    },
  });

  console.log("Seed data created.");
  console.log("Demo login -> email: demo@studyboard.test / password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
