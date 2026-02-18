// frontend/src/pages/notes/CreateNoteModal.jsx
import { useEffect, useState } from 'react';

export default function CreateNoteModal({
  mode = 'create', // "create" | "edit"
  initialNote = null, // note object for edit mode
  onCreate, // legacy create callback (optional)
  onSave, // preferred callback (optional)
  onClose,
  isSubmitting = false,
}) {
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  // Prefill when editing
  useEffect(() => {
    if (isEdit && initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
    } else {
      setTitle('');
      setContent('');
    }
    setTitleError('');
    setContentError('');
  }, [isEdit, initialNote]);

  function validate(nextTitle, nextContent) {
    let ok = true;

    if (!nextTitle.trim()) {
      setTitleError('Title is required.');
      ok = false;
    } else {
      setTitleError('');
    }

    // Backend update requires content; keeping create consistent is safer
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

    const nextTitle = title;
    const nextContent = content;

    if (!validate(nextTitle, nextContent)) return;

    const payload = {
      title: nextTitle.trim(),
      content: nextContent.trim(),
    };

    if (onSave) return onSave(payload);
    if (onCreate) return onCreate(payload);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-panel rounded-xl p-6 w-full max-w-md border border-border">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? 'Edit Note' : 'Create Note'}
        </h2>

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
              placeholder="Write your note..."
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
              {isSubmitting ? (isEdit ? 'Saving…' : 'Creating…') : isEdit ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}