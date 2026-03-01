import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectDB from "./mongoose";

import User from "../models/User";
import Task from "../models/Task";

// ---------- DB CONNECT ----------
async function ensureDb() {
  await connectDB();
}

// ---------- HELPERS ----------
function toObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return new mongoose.Types.ObjectId(id);
}

// ---------- USER ----------
export async function createUser({ email, passwordHash }) {
  await ensureDb();
  return User.create({
    email: email.toLowerCase().trim(),
    passwordHash,
  });
}

export async function findUserByEmail(email) {
  await ensureDb();
  return User.findOne({
    email: email.toLowerCase().trim(),
  });
}

export async function findUserById(_id) {
  await ensureDb();
  return User.findById(toObjectId(_id)).select("-passwordHash");
}

// ---------- TASK ----------
export async function createTask(data) {
  await ensureDb();

  return Task.create({
    ...data,
    user_id: toObjectId(data.user_id), 
  });
}

export async function getTasksByUser(userId) {
  await ensureDb();
  const tasks = await Task.find({ user_id: toObjectId(userId) }).lean();
  

  return tasks.map(t => ({
    ...t,
    _id: t._id.toString(), 
    user_id: t.user_id.toString()
  }));
}

export async function updateTaskById(_id, userId, update) {
  await ensureDb();

  return Task.findOneAndUpdate(
    {
      _id: toObjectId(_id),
      user_id: toObjectId(userId), 
    },
    update,
    { new: true }
  );
}

export async function deleteTaskById(_id, userId) {
  await ensureDb();

  return Task.findOneAndDelete({
    _id: toObjectId(_id),
    user_id: toObjectId(userId), 
  });
}

// ---------- AUTH ----------
export async function getUserFromToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "devsecret"
    );

    return await findUserById(decoded.id);
  } catch (err) {
    return null;
  }
}