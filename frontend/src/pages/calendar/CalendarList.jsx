// frontend/src/pages/calendar/CalendarList.jsx
import { useMemo, useState } from "react";
import CalendarCard from "./CalendarCard";

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d, days) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function getBucket(startTime) {
  if (!startTime) return "Later";

  const t = new Date(startTime);
  const ms = t.getTime();
  if (Number.isNaN(ms)) return "Later";

  const now = new Date();
  const todayStart = startOfDay(now).getTime();
  const tomorrowStart = startOfDay(addDays(now, 1)).getTime();
  const dayAfterStart = startOfDay(addDays(now, 2)).getTime();

  // Buckets based on START time (local time)
  if (ms < todayStart) return "Past";
  if (ms >= todayStart && ms < tomorrowStart) return "Today";
  if (ms >= tomorrowStart && ms < dayAfterStart) return "Tomorrow";
  return "Later";
}

function bucketOrder(name) {
  if (name === "Today") return 0;
  if (name === "Tomorrow") return 1;
  if (name === "Later") return 2;
  if (name === "Past") return 3;
  return 99;
}

export default function CalendarList({
  events,
  selectedEventId,
  onSelectEvent,
  onCreateEvent,
}) {
  const [query, setQuery] = useState("");

  // "Past" collapsed by default
  const [pastOpen, setPastOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;

    return events.filter((e) => {
      const title = String(e?.title || "").toLowerCase();
      const desc = String(e?.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [events, query]);

  const grouped = useMemo(() => {
    const map = new Map();

    for (const e of filtered) {
      const bucket = getBucket(e?.startTime);
      if (!map.has(bucket)) map.set(bucket, []);
      map.get(bucket).push(e);
    }

    return Array.from(map.entries())
      .map(([name, items]) => ({ name, items }))
      .sort((a, b) => bucketOrder(a.name) - bucketOrder(b.name));
  }, [filtered]);

  const hasPast = useMemo(() => {
    return grouped.some((g) => g.name === "Past" && g.items.length > 0);
  }, [grouped]);

  function togglePast() {
    setPastOpen((v) => !v);
  }

  return (
    <div className="border border-border rounded-xl bg-panel p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="font-semibold leading-none text-white">All Events</h2>
          <div className="text-xs text-muted mt-1">
            {filtered.length} of {events.length}
          </div>
        </div>

        <button
          onClick={onCreateEvent}
          className="w-7 h-7 flex items-center justify-center
                     rounded-full bg-accent text-black font-bold
                     hover:opacity-80"
          title="Create event"
        >
          +
        </button>
      </div>

      {/* Search */}
      <input
        className="w-full mb-3 p-2 rounded bg-bg border border-border text-white placeholder:text-muted"
        placeholder="Search events…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Grouped list */}
      <div className="space-y-4 max-h-[64vh] overflow-y-auto pr-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-white/5 p-4 text-sm text-muted">
            No events match your search.
          </div>
        ) : (
          grouped.map((group) => {
            const isPast = group.name === "Past";

            // If Past is collapsed, still show the header row (clickable) but hide cards.
            const showCards = !isPast || pastOpen;

            return (
              <div key={group.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  {isPast ? (
                    <button
                      type="button"
                      onClick={togglePast}
                      className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted hover:text-white transition"
                      title={pastOpen ? "Collapse Past" : "Expand Past"}
                    >
                      <span>Past</span>
                      {hasPast && (
                        <span className="rounded-full bg-black/20 border border-white/10 px-2 py-0.5 text-[10px] text-muted normal-case tracking-normal">
                          {pastOpen ? "Hide" : "Show"}
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="text-xs uppercase tracking-wide text-muted">
                      {group.name}
                    </div>
                  )}

                  <div className="text-xs text-muted">{group.items.length}</div>
                </div>

                {showCards && (
                  <div className="space-y-3">
                    {group.items.map((e) => (
                      <CalendarCard
                        key={e.id}
                        event={e}
                        isActive={e.id === selectedEventId}
                        onClick={() => onSelectEvent(e.id)}
                      />
                    ))}
                  </div>
                )}

                {/* When Past is collapsed, show a subtle hint */}
                {isPast && !pastOpen && group.items.length > 0 && (
                  <div className="rounded-lg border border-border bg-white/5 px-3 py-2 text-xs text-muted">
                    Past events are hidden to keep the list clean.
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}