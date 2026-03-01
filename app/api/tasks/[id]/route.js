import { getUserFromToken, updateTaskById, deleteTaskById } from "@/lib/db";
import { NextResponse } from "next/server";

async function getUserIdFromReq(req) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
  if (!token) return null;
  const user = await getUserFromToken(token);
  return user ? user._id : null;
}
export async function PUT(req, { params }) {
  const userId = await getUserIdFromReq(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const data = await req.json();
    const updated = await updateTaskById(id, userId, data);

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ task: updated }, { status: 200 });
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json({ message: "Error updating task" }, { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  try {
    const userId = await getUserIdFromReq(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const removed = await deleteTaskById(id, userId);

    if (!removed) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}