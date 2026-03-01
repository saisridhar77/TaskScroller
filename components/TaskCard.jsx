import { CheckCircle2, AlertTriangle, Trash2, Zap, Target, Pencil } from "lucide-react";

export default function TaskCard({ task, onComplete, onDelete, onEdit, isMustDo = false, dark = false }) {
  const remaining = task.remainingWork ?? task.estimated_days;
  const progress  = Math.min(100, 100 * (1 - remaining / task.estimated_days));
  const taskId    = task._id ?? task.id;

  const ink        = dark ? "#e8e6e0" : "#1c1c1c";
  const sub        = dark ? "#9a9890" : "#52525b";
  const muted      = dark ? "#7a7872" : "#a1a1aa";
  const trackBg    = dark ? "#2a2a2a" : "#e4e4e7";
  const trackFill  = dark ? "#c8c6c0" : "#3f3f46";
  const iconColor  = dark ? "#555"    : "#a1a1aa";
  const iconHover  = dark ? "#c8c6c0" : "#3f3f46";
  const hoverBg    = dark ? "rgba(255,255,255,0.03)" : "rgba(244,244,245,0.5)";
  const mustBorder = dark ? "#555"    : "#3f3f46";

  return (
    <div
      className="px-8 py-5 transition-colors"
      style={{
        borderLeft: isMustDo ? `2px solid ${mustBorder}` : "none",
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <div className="flex items-start justify-between gap-4 mb-1.5">
        <div className="flex items-start gap-3 min-w-0">
          {isMustDo && (
            <span className="text-[9px] uppercase tracking-widest font-mono px-1.5 py-0.5 shrink-0 mt-0.5"
              style={{ color: muted, border: `1px solid ${muted}` }}>
              priority
            </span>
          )}
          <h4 className="text-[15px] font-bold leading-snug truncate" style={{ color: ink }}>
            {task.title}
          </h4>
        </div>

        <div className="flex items-center gap-3 shrink-0 pt-0.5">
          {onEdit && (
            <button onClick={() => onEdit(task)} title="Edit task"
              style={{ color: iconColor }}
              onMouseEnter={e => e.currentTarget.style.color = iconHover}
              onMouseLeave={e => e.currentTarget.style.color = iconColor}>
              <Pencil className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => onComplete(task)} title="Mark complete"
            style={{ color: iconColor }}
            onMouseEnter={e => e.currentTarget.style.color = iconHover}
            onMouseLeave={e => e.currentTarget.style.color = iconColor}>
            <CheckCircle2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(taskId)} title="Delete task"
            style={{ color: iconColor }}
            onMouseEnter={e => e.currentTarget.style.color = dark ? "#e05555" : "#dc2626"}
            onMouseLeave={e => e.currentTarget.style.color = iconColor}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-[12px] font-mono mb-3 leading-relaxed" style={{ color: muted }}>
          {task.description}
        </p>
      )}

      {task.allocated !== undefined && (
        <div className="mb-3 flex items-center gap-4 text-[11px] font-mono" style={{ color: muted }}>
          <span>today finish <span className="font-bold" style={{ color: sub }}>{(task.allocated*100).toFixed(0)}% work</span></span>
          <span style={{ color: trackBg }}>·</span>
          <span>pace&nbsp;<span className="font-bold" style={{ color: sub }}>{(task.dailyRequired*100)?.toFixed(0)}% / day</span></span>
        </div>
      )}

      <div className="mb-3">
        <div className="w-full h-px relative" style={{ background: trackBg }}>
          <div className="absolute left-0 top-0 h-px transition-all duration-500"
            style={{ width: `${progress}%`, background: trackFill }} />
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] font-mono" style={{ color: muted }}>
          {(remaining*100).toFixed(0)}% work remaining
        </span>

        {task.slack !== undefined && (
          <span className="text-[11px] font-mono flex items-center gap-1">
            {task.slack < 0 ? (
              <span className="flex items-center gap-1" style={{ color: dark ? "#e05555" : "#dc2626" }}>
                <AlertTriangle className="w-3 h-3" />
                behind by {Math.abs(task.slack).toFixed(1)} days
              </span>
            ) : task.slack === 0 ? (
              <span className="flex items-center gap-1" style={{ color: dark ? "#c97a30" : "#92400e" }}>
                <Target className="w-3 h-3" />
                zero slack — must execute daily
              </span>
            ) : (
              <span className="flex items-center gap-1" style={{ color: muted }}>
                <Zap className="w-3 h-3" />
                {task.slack.toFixed(1)} days of breathing room
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}