function snippet(text, max = 70) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (!s) return 'No content yet…';
  return s.length > max ? s.slice(0, max) + '…' : s;
}

export default function NoteCard({ note, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-3 cursor-pointer transition
        ${isActive ? 'border-accent bg-accent/10' : 'border-border bg-white/5 hover:bg-white/10'}
      `}
    >
      <div className="font-medium text-white truncate">{note.title || 'Untitled'}</div>
      <div className="text-xs text-muted mt-1">{snippet(note.content)}</div>
    </div>
  );
}