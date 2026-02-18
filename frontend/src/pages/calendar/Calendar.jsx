// frontend/src/pages/calendar/Calendar.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Sprout from "../../components/chatbot/Sprout";
import sproutLogo from "../../assets/Logo.png";
import dark from "../../assets/bg-dark.png";

import { sendChatMessage } from "../../api/chatbot";
import { getEvents, createEvent, deleteEvent } from "../../api/scheduler";

import CalendarList from "./CalendarList";
import CalendarWorkspace from "./CalendarWorkspace";
import CreateEventModal from "./CreateEventModal";

function toTime(dt) {
  if (!dt) return 0;
  const d = new Date(dt);
  const t = d.getTime();
  return Number.isNaN(t) ? 0 : t;
}

function sortEvents(list) {
  return [...list].sort((a, b) => toTime(b?.startTime) - toTime(a?.startTime));
}

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const base =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] max-w-lg w-[calc(100%-2rem)] sm:w-auto";
  const panel =
    "rounded-xl border px-4 py-3 shadow-lg backdrop-blur bg-panel/90";

  const tone =
    toast.type === "error"
      ? "border-red-500/30"
      : toast.type === "success"
      ? "border-emerald-500/30"
      : "border-border";

  const text =
    toast.type === "error"
      ? "text-red-200"
      : toast.type === "success"
      ? "text-emerald-200"
      : "text-white";

  return (
    <div className={base} role="status" aria-live="polite">
      <div className={`${panel} ${tone}`}>
        <div className="flex items-start gap-3">
          <div className={`text-sm ${text}`}>{toast.message}</div>
          <button
            onClick={onClose}
            className="ml-auto text-muted hover:text-white text-sm"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // “polish” states
  const [busyDeleteId, setBusyDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(type, message) {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3000);
  }

  // -----------------------------
  // Initial load
  // -----------------------------
  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        const list = Array.isArray(data) ? sortEvents(data) : [];
        setEvents(list);
        if (list.length > 0) setSelectedEventId(list[0].id);
      } catch (err) {
        setPageError(err?.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  // -----------------------------
  // Actions
  // -----------------------------
  async function handleCreateEvent(data) {
    try {
      const created = await createEvent(data);

      setEvents((prev) =>
        sortEvents([created, ...prev.filter((e) => e.id !== created.id)])
      );
      setSelectedEventId(created.id);
      setIsCreateOpen(false);

      showToast("success", "Event created.");
    } catch (err) {
      showToast("error", err?.message || "Failed to create event");
      throw err; // allows modal to stop its “submitting” state correctly
    }
  }

  async function handleDeleteEvent(eventId) {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return;

    const confirmed = window.confirm(
      `Delete "${evt.title}"?\n\nThis cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setBusyDeleteId(eventId);
      await deleteEvent(eventId);

      setEvents((prev) => {
        const next = prev.filter((e) => e.id !== eventId);

        setSelectedEventId((currentSelected) => {
          if (currentSelected !== eventId) return currentSelected;
          return next.length > 0 ? next[0].id : null;
        });

        return next;
      });

      showToast("success", "Event deleted.");
    } catch (err) {
      showToast("error", err?.message || "Failed to delete event");
    } finally {
      setBusyDeleteId(null);
    }
  }

  // -----------------------------
  // Render states
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text p-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl bg-panel border border-border p-6">
            Loading scheduler…
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-bg text-text p-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl bg-panel border border-red-500/30 p-6 text-red-300">
            {pageError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${dark})` }}
    >
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 hover:opacity-90"
            >
              <img
                src={sproutLogo}
                alt="Sprout logo"
                className="h-20 w-auto cursor-pointer"
              />
            </Link>
            Scheduler
          </h1>

          <p className="text-white">
            A planner for events and reminders you can expand later.
          </p>
        </header>

        {events.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="max-w-md text-center rounded-xl bg-panel p-8 border border-border">
              <h2 className="text-xl font-semibold mb-2">Welcome to Scheduler</h2>
              <p className="text-muted mb-6">
                Create your first event to start planning your week.
              </p>

              <button
                className="px-4 py-2 rounded-lg bg-accent text-black font-medium hover:opacity-90"
                onClick={() => setIsCreateOpen(true)}
              >
                Create your first event
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start min-h-0">
            <CalendarList
              events={events}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
              onCreateEvent={() => setIsCreateOpen(true)}
            />

            <div className="space-y-6">
              <CalendarWorkspace
                event={activeEvent}
                deleteBusy={busyDeleteId === activeEvent?.id}
                onDelete={() => activeEvent && handleDeleteEvent(activeEvent.id)}
              />
            </div>
          </div>
        )}

        {isCreateOpen && (
          <CreateEventModal
            onCreate={handleCreateEvent}
            onClose={() => setIsCreateOpen(false)}
          />
        )}

        <Sprout onSend={sendChatMessage} />
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}