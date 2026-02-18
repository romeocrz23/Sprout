// frontend/src/pages/calendar/CalendarCard.jsx
function snippet(text, max = 70) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (!s) return "No description yet…";
  return s.length > max ? s.slice(0, max) + "…" : s;
}

function fmt(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export default function CalendarCard({ event, onClick, isActive }) {
  const start = fmt(event?.startTime);
  const end = fmt(event?.endTime);

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-3 cursor-pointer transition
        ${
          isActive
            ? "border-accent bg-accent/10"
            : "border-border bg-white/5 hover:bg-white/10"
        }
      `}
    >
      <div className="font-medium text-white truncate">
        {event?.title || "Untitled"}
      </div>

      {start ? (
        <div className="text-xs text-muted mt-1">
          <span className="text-white/70">Start:</span> {start}
          {end ? (
            <>
              <span className="mx-2 text-white/30">•</span>
              <span className="text-white/70">End:</span> {end}
            </>
          ) : null}
        </div>
      ) : null}

      <div className="text-xs text-muted mt-1">{snippet(event?.description)}</div>
    </div>
  );
}