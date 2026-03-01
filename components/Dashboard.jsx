"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../lib/store/authStore";
import { useThemeStore } from "@/lib/store/themeStore";
import {
  generateDailySchedule,
  calculateNextTaskState,
} from "../lib/scheduler";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import { Plus, LogOut, Calendar, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { theme, toggleTheme } = useThemeStore();
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const dark = theme === "dark";

  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const paper = dark ? "#0f0f0f" : "#f0efe9";
  const rule = dark ? "#1e1e1e" : "#dddbd3";
  const margin = dark ? "#3a2020" : "#f0c0c0";
  const ink = dark ? "#e8e6e0" : "#1c1c1c";
  const muted = dark ? "#7a7872" : "#b0ada6";
  const border = dark ? "#262626" : "#d4d4d8";
  const sub = dark ? "#9a9890" : "#52525b";
  const headerBg = dark ? "rgba(15,15,15,0.92)" : "rgba(240,239,233,0.9)";
  const hoverBg = dark ? "rgba(255,255,255,0.03)" : "rgba(244,244,245,0.5)";

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      setSchedule(generateDailySchedule(tasks, 5));
    } else {
      setSchedule(null);
    }
  }, [tasks]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskProgress = async (task) => {
    try {
      const token = localStorage.getItem("token");
      const updatedTaskData = calculateNextTaskState(task);

      await axios.put(
        `/api/tasks/${task._id}`,
        {
          remaining_days:    updatedTaskData.remaining_days,
          status:            updatedTaskData.status,
          last_scheduled_at: updatedTaskData.last_scheduled_at,
          completed_at:      updatedTaskData.completed_at,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await loadTasks();
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const getTodayDate = () =>
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const incompleteTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "missed",
  );
  const completedTasks = tasks.filter((t) => t.status === "completed");

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-mono"
        style={{ backgroundColor: paper }}
      >
        <div className="text-center">
          <div
            className="w-6 h-6 border mx-auto mb-4 animate-spin"
            style={{ borderColor: border, borderTopColor: "transparent" }}
          />
          <p
            className="text-[11px] uppercase tracking-widest"
            style={{ color: muted }}
          >
            Loading your tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-mono"
      style={{
        backgroundColor: paper,
        color: ink,
        backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, ${rule} 31px, ${rule} 32px)`,
      }}
    >
      <div
        className="fixed top-0 bottom-0 left-[68px] w-px pointer-events-none z-10"
        style={{ background: margin }}
      />

      <header
        className="sticky top-0 z-40 backdrop-blur-sm"
        style={{
          backgroundColor: headerBg,
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div className="max-w-4xl mx-auto px-8 md:px-20 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 flex items-center justify-center"
              style={{ border: `1px solid ${dark ? "#555" : "#3f3f46"}` }}
            >
              <span
                className="text-[9px] font-black font-mono"
                style={{ color: dark ? "#c8c6c0" : "#3f3f46" }}
              >
                TS
              </span>
            </div>
            <div>
              <span
                className="text-sm font-semibold tracking-tight"
                style={{ color: dark ? "#c8c6c0" : "#3f3f46" }}
              >
                task scroller
              </span>
              {user?.email && (
                <p
                  className="text-[10px] leading-none mt-0.5"
                  style={{ color: muted }}
                >
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleTheme}
              className="transition-colors"
              style={{ color: muted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ink)}
              onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
              aria-label="Toggle theme"
            >
              {dark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest transition-colors"
              style={{ color: muted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ink)}
              onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
            >
              <LogOut className="w-3.5 h-3.5" />
              log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 md:px-20 py-16">
        <div className="flex items-start justify-between mb-14">
          <div>
            <h1
              className="leading-none mb-2"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(40px, 6vw, 72px)",
                color: ink,
              }}
            >
              Today&apos;s <em style={{ color: muted }}>Plan.</em>
            </h1>
            <p
              className="text-[11px] uppercase tracking-widest flex items-center gap-2 mt-3"
              style={{ color: muted }}
            >
              <Calendar className="w-3 h-3" />
              {getTodayDate()}
            </p>
          </div>

          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-widest font-bold transition-colors shrink-0 mt-2"
            style={{ background: ink, color: paper }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 gap-0 mb-14"
          style={{ border: `1px solid ${border}` }}
        >
          {[
            { label: "Active", value: incompleteTasks.length, color: ink },
            {
              label: "Completed",
              value: completedTasks.length,
              color: dark ? "#4a8a4a" : "#3f6b3f",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="p-6"
              style={{ borderRight: i === 0 ? `1px solid ${border}` : "none" }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{ color: muted }}
              >
                {s.label}
              </p>
              <p
                className="text-4xl font-bold"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  color: s.color,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {schedule?.mustDoTask && (
          <div className="mb-14">
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{ color: muted }}
              >
                Priority
              </span>
              <h2
                className="text-2xl"
                style={{ fontFamily: "'Instrument Serif', serif", color: ink }}
              >
                Must do <em style={{ color: muted }}>today.</em>
              </h2>
            </div>
            <div style={{ border: `1px solid ${border}` }}>
              <TaskCard
                task={schedule.mustDoTask}
                onComplete={handleTaskProgress}
                onDelete={handleTaskDelete}
                onEdit={(task) => setEditingTask(task)}
                isMustDo
                dark={dark}
              />
            </div>
          </div>
        )}

        {schedule?.scheduledTasks?.length > 0 && (
          <div>
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{ color: muted }}
              >
                Schedule
              </span>
              <h2
                className="text-2xl"
                style={{ fontFamily: "'Instrument Serif', serif", color: ink }}
              >
                Work <em style={{ color: muted }}>allocation.</em>
              </h2>
            </div>
            <div style={{ border: `1px solid ${border}` }}>
              {schedule.scheduledTasks.map((task, i) => (
                <div
                  key={task._id}
                  style={{ borderTop: i > 0 ? `1px solid ${border}` : "none" }}
                >
                  <TaskCard
                    task={task}
                    onComplete={handleTaskProgress}
                    onDelete={handleTaskDelete}
                    onEdit={(task) => setEditingTask(task)}
                    dark={dark}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {incompleteTasks.length === 0 && (
          <div
            className="text-center py-24"
            style={{ border: `1px solid ${border}` }}
          >
            <p
              className="text-3xl mb-3"
              style={{ fontFamily: "'Instrument Serif', serif", color: muted }}
            >
              <em>Nothing here yet.</em>
            </p>
            <p className="text-[12px] mb-6" style={{ color: sub }}>
              Add your first task and let the scheduler do the rest.
            </p>
            <button
              onClick={() => setShowTaskForm(true)}
              className="px-6 py-2.5 text-[11px] uppercase tracking-widest font-bold transition-colors"
              style={{ background: ink, color: paper }}
            >
              Add First Task →
            </button>
          </div>
        )}
      </main>

      {showTaskForm && (
        <TaskForm
          onTaskAdded={loadTasks}
          onClose={() => setShowTaskForm(false)}
          dark={dark}
        />
      )}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onTaskAdded={loadTasks}
          onClose={() => setEditingTask(null)}
          dark={dark}
        />
      )}
    </div>
  );
}
