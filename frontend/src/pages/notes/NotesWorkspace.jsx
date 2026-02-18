// frontend/src/pages/notes/NotesWorkspace.jsx
export default function NotesWorkspace({
  note,
  onEdit,
  onDelete,
  isDeleting = false,
  disabled = false,
}) {
  if (!note) {
    return (
      <div className="border border-border rounded-xl bg-panel p-6 text-muted">
        Select a note to see details
      </div>
    );
  }

  const updated = note.updatedAt
    ? new Date(note.updatedAt).toLocaleString()
    : null;

  const actionsDisabled = disabled || isDeleting;

  return (
    <div className="rounded-2xl bg-panel p-6 border border-border space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-white truncate">
            {note.title || 'Untitled'}
          </h2>
          {updated && <p className="text-sm text-muted">Updated: {updated}</p>}
          {isDeleting && (
            <p className="text-sm text-muted mt-1">Deleting…</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="px-3 py-2 rounded-lg bg-accent text-black font-medium disabled:opacity-60"
            disabled={actionsDisabled}
            type="button"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="text-sm text-red-400 hover:text-red-300 disabled:opacity-60"
            disabled={actionsDisabled}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="text-white whitespace-pre-wrap leading-relaxed">
          {note.content ? (
            note.content
          ) : (
            <span className="text-muted">No content yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}