// frontend/src/pages/calendar/CreateEventModal.jsx
import { useEffect, useMemo, useRef, useState } from "react";

function toMs(dtLocal) {
  if (!dtLocal) return null;
  const d = new Date(dtLocal);
  const t = d.getTime();
  return Number.isNaN(t) ? null : t;
}

export default function CreateEventModal({ onCreate, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const titleRef = useRef(null);

  // Autofocus
  useEffect(() => {
    titleRef.current?.focus?.();
  }, []);

  // ESC to close
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, submitting]);

  const errors = useMemo(() => {
    const next = {};

    if (!title.trim()) next.title = "Title is required.";
    if (!startTime.trim()) next.startTime = "Start time is required.";

    const s = toMs(startTime);
    const e = toMs(endTime);

    if (endTime.trim() && e === null) next.endTime = "End time is invalid.";
    if (startTime.trim() && s === null) next.startTime = "Start time is invalid.";

    if (s !== null && e !== null && e < s) {
      next.endTime = "End time must be after start time.";
    }

    return next;
  }, [title, startTime, endTime]);

  const canSubmit = useMemo(() => {
    return Object.keys(errors).length === 0 && !submitting;
  }, [errors, submitting]);

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ title: true, startTime: true, endTime: true, description: true });

    if (!canSubmit) return;

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      startTime: startTime.trim(),
      endTime: endTime.trim() ? endTime.trim() : undefined,
    };

    try {
      setSubmitting(true);
      await onCreate(payload);
    } catch {
      // error UI handled by parent toast; keep modal open
    } finally {
      setSubmitting(false);
    }
  }

  function fieldError(name) {
    if (!touched[name]) return "";
    return errors[name] || "";
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onMouseDown={(e) => {
        // click outside to close
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="bg-panel rounded-xl p-6 w-full max-w-md border border-border">
        <div className="flex items-start gap-3 mb-4">
          <h2 className="text-lg font-semibold">Create Event</h2>
          <span className="ml-auto text-xs text-muted">Scheduler</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs text-muted">Title *</label>
            <input
              ref={titleRef}
              className={`w-full p-2 rounded bg-bg border text-white placeholder:text-muted ${
                fieldError("title") ? "border-red-500/50" : "border-border"
              }`}
              placeholder="e.g., Study session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, title: true }))}
              required
              disabled={submitting}
            />
            {fieldError("title") ? (
              <div className="text-xs text-red-300">{fieldError("title")}</div>
            ) : null}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs text-muted">Description (optional)</label>
            <textarea
              className="w-full p-2 rounded bg-bg border border-border text-white min-h-[110px] placeholder:text-muted"
              placeholder="Add details…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, description: true }))}
              disabled={submitting}
            />
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted">Start time *</label>
              <input
                type="datetime-local"
                className={`w-full p-2 rounded bg-bg border text-white ${
                  fieldError("startTime") ? "border-red-500/50" : "border-border"
                }`}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, startTime: true }))}
                required
                disabled={submitting}
              />
              {fieldError("startTime") ? (
                <div className="text-xs text-red-300">{fieldError("startTime")}</div>
              ) : (
                <div className="text-[11px] text-muted">
                  Uses your local time.
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted">End time (optional)</label>
              <input
                type="datetime-local"
                className={`w-full p-2 rounded bg-bg border text-white ${
                  fieldError("endTime") ? "border-red-500/50" : "border-border"
                }`}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, endTime: true }))}
                disabled={submitting}
              />
              {fieldError("endTime") ? (
                <div className="text-xs text-red-300">{fieldError("endTime")}</div>
              ) : (
                <div className="text-[11px] text-muted">
                  Leave blank if unknown.
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              className="px-3 py-2 text-muted disabled:opacity-60"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-2 rounded bg-accent text-black font-medium disabled:opacity-60"
              disabled={!canSubmit}
            >
              {submitting ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}