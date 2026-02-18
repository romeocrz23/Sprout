// frontend/src/pages/calendar/CalendarWorkspace.jsx
function fmt(dt) {
  if (!dt) return null;
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString();
}

export default function CalendarWorkspace({ event, onDelete, deleteBusy = false }) {
  if (!event) {
    return (
      <div className="border border-border rounded-xl bg-panel p-6 text-muted">
        Select an event to see details
      </div>
    );
  }

  const updated = fmt(event.updatedAt);
  const created = fmt(event.createdAt);
  const start = fmt(event.startTime);
  const end = fmt(event.endTime);

  return (
    <div className="rounded-2xl bg-panel p-6 border border-border space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-white truncate">
            {event.title || "Untitled"}
          </h2>

          <div className="mt-2 space-y-1">
            {start && (
              <p className="text-sm text-muted">
                Start: <span className="text-white/90">{start}</span>
              </p>
            )}

            <p className="text-sm text-muted">
              End:{" "}
              <span className={end ? "text-white/90" : "text-white/60"}>
                {end || "Not set"}
              </span>
            </p>

            {updated && <p className="text-sm text-muted">Updated: {updated}</p>}
            {created && <p className="text-sm text-muted">Created: {created}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onDelete}
            disabled={deleteBusy}
            className="text-sm text-red-400 hover:text-red-300 disabled:opacity-60"
          >
            {deleteBusy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="text-white whitespace-pre-wrap leading-relaxed">
          {event.description ? (
            event.description
          ) : (
            <span className="text-muted">No description yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}