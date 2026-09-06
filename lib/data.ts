import { prisma } from "@/lib/prisma";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  groupId: string;
};

export type Group = {
  id: string;
  name: string;
  subject: string;
  memberCount: number;
  tasks: Task[];
  ownerId: string;
  owner: {
    id: string;
    name: string;
  };
};

export async function getGroups(): Promise<Group[]> {
  return prisma.group.findMany({
    include: {
      tasks: true,
      owner: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getGroupById(id: string): Promise<Group | null> {
  return prisma.group.findUnique({
    where: { id },
    include: {
      tasks: true,
      owner: { select: { id: true, name: true } },
    },
  });
}

type NewGroupInput = {
  name: string;
  subject: string;
  memberCount?: number;
  ownerId: string;
};

export async function createGroup(input: NewGroupInput): Promise<Group> {
  return prisma.group.create({
    data: {
      name: input.name,
      subject: input.subject,
      memberCount: input.memberCount ?? 1,
      ownerId: input.ownerId,
    },
    include: {
      tasks: true,
      owner: { select: { id: true, name: true } },
    },
  });
}

type UpdateGroupInput = Partial<{
  name: string;
  subject: string;
  memberCount: number;
}>;

export async function updateGroup(
  id: string,
  updates: UpdateGroupInput
): Promise<Group | undefined> {
  try {
    return await prisma.group.update({
      where: { id },
      data: updates,
      include: {
        tasks: true,
        owner: { select: { id: true, name: true } },
      },
    });
  } catch {
    return undefined;
  }
}

export async function deleteGroup(id: string): Promise<boolean> {
  try {
    await prisma.group.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function createTask(
  groupId: string,
  title: string
): Promise<Task | undefined> {
  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) return undefined;

  return prisma.task.create({
    data: { title, groupId },
  });
}

type UpdateTaskInput = Partial<{
  title: string;
  done: boolean;
}>;

export async function updateTask(
  groupId: string,
  taskId: string,
  updates: UpdateTaskInput
): Promise<Task | undefined> {
  const task = await prisma.task.findFirst({
    where: { id: taskId, groupId },
  });
  if (!task) return undefined;

  return prisma.task.update({
    where: { id: taskId },
    data: updates,
  });
}

export async function deleteTask(
  groupId: string,
  taskId: string
): Promise<boolean> {
  const task = await prisma.task.findFirst({
    where: { id: taskId, groupId },
  });
  if (!task) return false;

  await prisma.task.delete({ where: { id: taskId } });
  return true;
}
