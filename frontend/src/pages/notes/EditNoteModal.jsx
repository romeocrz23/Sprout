// frontend/src/pages/notes/EditNoteModal.jsx
import { useEffect, useState } from 'react';

export default function EditNoteModal({ note, onSave, onClose, isSubmitting = false }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setTitleError('');
    setContentError('');
  }, [note]);

  function validate(nextTitle, nextContent) {
    let ok = true;

    if (!nextTitle.trim()) {
      setTitleError('Title is required.');
      ok = false;
    } else {
      setTitleError('');
    }

    // Backend updateNote requires content
    if (!nextContent.trim()) {
      setContentError('Content is required.');
      ok = false;
    } else {
      setContentError('');
    }

    return ok;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate(title, content)) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-panel rounded-xl p-6 w-full max-w-md border border-border">
        <h2 className="text-lg font-semibold mb-4">Edit Note</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              className="w-full p-2 rounded bg-bg border border-border text-white disabled:opacity-60"
              placeholder="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              disabled={isSubmitting}
              required
            />
            {titleError && (
              <div className="text-red-400 text-xs mt-1">{titleError}</div>
            )}
          </div>

          <div>
            <textarea
              className="w-full p-2 rounded bg-bg border border-border text-white min-h-[160px] disabled:opacity-60"
              placeholder="Update your note..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (contentError) setContentError('');
              }}
              disabled={isSubmitting}
              required
            />
            {contentError && (
              <div className="text-red-400 text-xs mt-1">{contentError}</div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-2 text-muted disabled:opacity-60"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-2 rounded bg-accent text-black font-medium disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}