import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function TaskForm({ onTaskAdded, onClose, task = null, dark = false }) {
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title:          task?.title          ?? "",
    description:    task?.description    ?? "",
    deadline:       task?.deadline ? task.deadline.split("T")[0] : "",
    importance:     task?.importance     ?? 5,
    effort:         task?.effort         ?? 5,
    difficulty:     task?.difficulty     ?? 5,
    consequences:   task?.consequences   ?? 5,
    estimated_days: task?.estimated_days ?? 1,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        const remainingRatio = task.remaining_days / task.estimated_days;
        await axios.put(
          `/api/tasks/${task._id}`,
          {
            ...formData,
            remaining_days: Math.min(
              formData.estimated_days,
              Math.round(formData.estimated_days * remainingRatio)
            ),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "/api/tasks",
          { ...formData, status: "pending", remaining_days: formData.estimated_days, last_scheduled_at: null },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onTaskAdded();
      onClose();
    } catch (err) {
      alert(`Error ${isEditing ? "updating" : "creating"} task: ` + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  // ── theme tokens ──────────────────────────────────────────────────────────
  const paper      = dark ? "#0f0f0f"                  : "#f0efe9";
  const ink        = dark ? "#e8e6e0"                  : "#1c1c1c";
  const muted      = dark ? "#7a7872"                  : "#71716e";
  const border     = dark ? "#333"                     : "#d4d2cb";
  const cardBg     = dark ? "rgba(18,18,18,0.95)"      : "rgba(243,242,236,0.88)";
  const cardBorder = dark ? "rgba(60,60,60,0.7)"       : "rgba(180,178,170,0.6)";
  const inputBg    = dark ? "rgba(255,255,255,0.04)"   : "rgba(240,239,233,0.6)";
  const inputBgF   = dark ? "rgba(255,255,255,0.07)"   : "rgba(240,239,233,0.9)";
  const inputBorderColor = dark ? "#444"               : "#d4d2cb";
  const inputBorderFocus = dark ? "#777"               : "#71716e";
  const lineColor  = dark ? "rgba(60,60,55,0.5)"       : "rgba(210,208,200,0.45)";
  const marginLine = dark ? "rgba(90,40,40,0.7)"       : "rgba(240,192,192,0.7)";
  const trackColor = dark ? "#333"                     : "#b8b5ac";
  const thumbBg    = dark ? "#0f0f0f"                  : "#f0efe9";
  const thumbBorder= dark ? "#888"                     : "#3f3f3f";

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .task-form-card { animation: modalIn 0.22s ease forwards; }

        .nb-input {
          width: 100%;
          background: ${inputBg};
          border: 1px solid ${inputBorderColor};
          padding: 9px 12px;
          font-size: 13px;
          font-family: 'Space Mono', monospace;
          color: ${ink};
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          -webkit-appearance: none;
        }
        .nb-input::placeholder { color: ${dark ? "#555" : "#a8a5a0"}; }
        .nb-input:focus {
          border-color: ${inputBorderFocus};
          background: ${inputBgF};
        }

        /* Range slider */
        .nb-range {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 20px;
          background: transparent; outline: none; cursor: pointer;
        }
        .nb-range::-webkit-slider-runnable-track {
          height: 2px; background: ${trackColor}; border-radius: 0;
        }
        .nb-range::-moz-range-track {
          height: 2px; background: ${trackColor}; border-radius: 0;
        }
        .nb-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 14px; height: 14px;
          background: ${thumbBg};
          border: 2px solid ${thumbBorder};
          border-radius: 50%; cursor: pointer; margin-top: -6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: background 0.15s, border-color 0.15s;
        }
        .nb-range::-webkit-slider-thumb:hover {
          background: ${thumbBorder};
        }
        .nb-range::-moz-range-thumb {
          width: 14px; height: 14px;
          background: ${thumbBg};
          border: 2px solid ${thumbBorder};
          border-radius: 50%; cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: background 0.15s;
        }
        .nb-range::-moz-range-thumb:hover { background: ${thumbBorder}; }

        .nb-input[type=number]::-webkit-inner-spin-button,
        .nb-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .nb-input[type=number] { -moz-appearance: textfield; }

        .nb-input[type=date]::-webkit-calendar-picker-indicator {
          filter: ${dark ? "invert(0.6)" : "none"};
          cursor: pointer;
        }
      `}</style>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

        {/* Card */}
        <div
          className="task-form-card relative w-full max-w-xl max-h-[90vh] overflow-y-auto"
          style={{
            background: cardBg,
            backdropFilter: "blur(20px)",
            border: `1px solid ${cardBorder}`,
            boxShadow: dark
              ? "0 8px 40px rgba(0,0,0,0.4)"
              : "0 8px 40px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.6) inset",
            backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${lineColor} 27px, ${lineColor} 28px)`,
          }}>

          {/* Red margin line */}
          <div className="absolute top-0 bottom-0 left-10 w-px pointer-events-none"
            style={{ background: marginLine }} />

          <div className="relative px-10 py-8">

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="text-[10px] uppercase tracking-widest font-mono mb-2" style={{ color: muted }}>
                  {isEditing ? "Edit Task" : "New Task"}
                </div>
                <h2 className="text-2xl leading-tight" style={{ fontFamily: "'Instrument Serif', serif", color: ink }}>
                  {isEditing ? <><em>Revise</em> this task.</> : <>What needs to <em>get done?</em></>}
                </h2>
              </div>
              <button onClick={onClose} className="mt-1 transition-colors" style={{ color: muted }}
                onMouseEnter={e => e.currentTarget.style.color = ink}
                onMouseLeave={e => e.currentTarget.style.color = muted}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono mb-1.5" style={{ color: muted }}>Title *</label>
                <input type="text" className="nb-input" value={formData.title}
                  onChange={e => handleChange("title", e.target.value)}
                  placeholder="Name this task..." required />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono mb-1.5" style={{ color: muted }}>Description</label>
                <textarea className="nb-input resize-none" value={formData.description}
                  onChange={e => handleChange("description", e.target.value)}
                  placeholder="Any extra notes..." rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-mono mb-1.5" style={{ color: muted }}>Deadline *</label>
                  <input type="date" className="nb-input" value={formData.deadline}
                    onChange={e => handleChange("deadline", e.target.value)}
                    required min={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-mono mb-1.5" style={{ color: muted }}>Est. Days *</label>
                  <input type="number" className="nb-input" value={formData.estimated_days}
                    onChange={e => handleChange("estimated_days", parseInt(e.target.value))}
                    min={1} required />
                </div>
              </div>

              {/* Sliders */}
              <div className="p-5 space-y-5" style={{ border: `1px solid ${border}` }}>
                <div className="text-[10px] uppercase tracking-widest font-mono" style={{ color: muted }}>
                  Task Properties — 0 to 10
                </div>
                {[
                  { key: "importance",   label: "Importance"   },
                  { key: "effort",       label: "Effort"       },
                  { key: "difficulty",   label: "Difficulty"   },
                  { key: "consequences", label: "Consequences" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <div className="flex justify-between items-baseline mb-2">
                      <label className="text-[11px] uppercase tracking-wide font-mono" style={{ color: muted }}>{label}</label>
                      <span className="text-sm font-bold font-mono tabular-nums" style={{ color: ink }}>{formData[key]}</span>
                    </div>
                    <input type="range" min="0" max="10" className="nb-range"
                      value={formData[key]}
                      onChange={e => handleChange(key, parseInt(e.target.value))} />
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 text-[11px] uppercase tracking-widest font-bold font-mono transition-colors"
                  style={{ border: `1px solid ${border}`, color: muted }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ink; e.currentTarget.style.color = ink; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted; }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 text-[11px] uppercase tracking-widest font-bold font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: ink, color: paper }}>
                  {loading ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Changes →" : "Add Task →")}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}