// frontend/src/pages/notes/Notes.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Sprout from '../../components/chatbot/Sprout';
import sproutLogo from '../../assets/Logo.png';
import dark from '../../assets/bg-dark.png';

import { sendChatMessage } from '../../api/chatbot';
import { getNotes, createNote, updateNote, deleteNote } from '../../api/notes';

import NotesList from './NotesList';
import NotesWorkspace from './NotesWorkspace';
import CreateNoteModal from './CreateNoteModal';
import EditNoteModal from './EditNoteModal';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  // “Polish” UI states
  const [uiError, setUiError] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  async function syncNotes(preferSelectId = null) {
    const data = await getNotes();
    const list = Array.isArray(data) ? data : [];

    setNotes(list);

    setSelectedNoteId((currentSelected) => {
      if (preferSelectId && list.some((n) => n.id === preferSelectId)) {
        return preferSelectId;
      }

      if (currentSelected && list.some((n) => n.id === currentSelected)) {
        return currentSelected;
      }

      return list.length > 0 ? list[0].id : null;
    });
  }

  // -----------------------------
  // Initial load
  // -----------------------------
  useEffect(() => {
    async function loadNotes() {
      try {
        setUiError('');
        await syncNotes();
      } catch (err) {
        setPageError(err?.message || 'Failed to load notes');
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, []);

  // -----------------------------
  // Actions
  // -----------------------------
  async function handleCreateNote(data) {
    try {
      setUiError('');
      setIsCreating(true);

      const created = await createNote(data);

      // Re-sync with backend ordering (updatedAt desc) for reliability
      await syncNotes(created?.id || null);

      setIsCreateOpen(false);
    } catch (err) {
      setUiError(err?.message || 'Failed to create note');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateNote(noteId, data) {
    try {
      setUiError('');
      setIsUpdating(true);

      const updated = await updateNote(noteId, data);

      // Re-sync with backend ordering (updatedAt desc) for reliability
      await syncNotes(updated?.id || noteId);

      setIsEditOpen(false);
    } catch (err) {
      setUiError(err?.message || 'Failed to update note');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteNote(noteId) {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    const confirmed = window.confirm(
      `Delete "${note.title}"?\n\nThis cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setUiError('');
      setIsDeleting(true);

      await deleteNote(noteId);

      // Re-sync; selection will fall back to first note if needed
      await syncNotes();
    } catch (err) {
      setUiError(err?.message || 'Failed to delete note');
    } finally {
      setIsDeleting(false);
    }
  }

  // -----------------------------
  // Render states
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text p-6">Loading notes…</div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-bg text-text p-6 text-red-500">
        {pageError}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${dark})` }}
    >
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-4">
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
            Notes
          </h1>

          <p className="text-white">
            A space for thoughts, planning, and reflection.
          </p>
        </header>

        {/* Polished error banner (replaces alert()) */}
        {uiError && (
          <div className="mb-6 rounded-xl bg-panel border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="text-red-400 text-sm">{uiError}</div>
              <button
                className="text-muted text-sm hover:opacity-90"
                onClick={() => setUiError('')}
                type="button"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {notes.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="max-w-md text-center rounded-xl bg-panel p-8 border border-border">
              <h2 className="text-xl font-semibold mb-2">
                Welcome to Sprout Notes
              </h2>
              <p className="text-muted mb-6">
                Create your first note to start capturing ideas.
              </p>

              <button
                className="px-4 py-2 rounded-lg bg-accent text-black font-medium disabled:opacity-60"
                onClick={() => setIsCreateOpen(true)}
                disabled={isCreating || isUpdating || isDeleting}
              >
                Create your first note
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start min-h-0">
            <NotesList
              notes={notes}
              selectedNoteId={selectedNoteId}
              onSelectNote={setSelectedNoteId}
              onCreateNote={() => setIsCreateOpen(true)}
              disabled={isCreating || isUpdating || isDeleting}
            />

            <div className="space-y-6">
              <NotesWorkspace
                note={activeNote}
                onEdit={() => setIsEditOpen(true)}
                onDelete={() => activeNote && handleDeleteNote(activeNote.id)}
                isDeleting={isDeleting}
                disabled={isCreating || isUpdating || isDeleting}
              />
            </div>
          </div>
        )}

        {isCreateOpen && (
          <CreateNoteModal
            onCreate={handleCreateNote}
            onClose={() => setIsCreateOpen(false)}
            isSubmitting={isCreating}
          />
        )}

        {isEditOpen && activeNote && (
          <EditNoteModal
            note={activeNote}
            onSave={(data) => handleUpdateNote(activeNote.id, data)}
            onClose={() => setIsEditOpen(false)}
            isSubmitting={isUpdating}
          />
        )}

        <Sprout onSend={sendChatMessage} />
      </div>
    </div>
  );
}