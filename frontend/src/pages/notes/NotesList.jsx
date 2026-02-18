// frontend/src/pages/notes/NotesList.jsx
import NoteCard from './NoteCard';

export default function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  disabled = false,
}) {
  return (
    <div className="border border-border rounded-xl bg-panel p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="font-semibold leading-none text-white">All Notes</h2>

        <button
          onClick={onCreateNote}
          className="w-7 h-7 flex items-center justify-center
                     rounded-full bg-accent text-black font-bold
                     hover:opacity-80 disabled:opacity-60"
          title="Create note"
          disabled={disabled}
          type="button"
        >
          +
        </button>
      </div>

      {/* Notes list */}
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-3">
        {notes.map((n) => (
          <NoteCard
            key={n.id}
            note={n}
            isActive={n.id === selectedNoteId}
            onClick={() => {
              if (!disabled) onSelectNote(n.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}