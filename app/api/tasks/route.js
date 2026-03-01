import {
  getUserFromToken,
  getTasksByUser,
  createTask,
} from '@/lib/db';
import { NextResponse } from 'next/server';
import { calculateDaysRemaining } from "@/lib/scheduler";

async function getUserIdFromReq(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ')
    ? auth.split(' ')[1]
    : null;

  if (!token) return null;

  const user = await getUserFromToken(token);
  return user ? user._id.toString() : null;
}

export async function GET(req) {
  const userId = await getUserIdFromReq(req);

  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const tasks = await getTasksByUser(userId);
  for (let task of tasks) {
  const daysRemaining = calculateDaysRemaining(task.deadline);
  const remaining = task.remaining_days ?? task.estimated_days;

  if (
    daysRemaining < 0 &&
    remaining > 0 &&
    task.status === "pending"
  ) {
    task.status = "missed";
    await updateTaskById(task._id, userId.toString(), { status: "missed" });
  }
}

  return NextResponse.json({ tasks }, { status: 200 });
}

export async function POST(req) {
  const userId = await getUserIdFromReq(req);

  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const data = await req.json();

    const created = await createTask({
      ...data,
      user_id: userId,
      remaining_days: data.estimated_days,
    });

    return NextResponse.json(
      { task: created },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Error creating task' },
      { status: 500 }
    );
  }
}