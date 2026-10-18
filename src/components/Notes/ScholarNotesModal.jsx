import { useState } from "react";
import { X, FileText, Download, Copy, Check, Trash2, CheckCircle2 } from "lucide-react";
import { getBookNotes, saveBookNote } from "../../utils/storage";
import { useToast } from "../Shared/Toast/useToast";

const ScholarNotesDialog = ({ book, onClose }) => {
  const { showToast } = useToast();
  const [noteContent, setNoteContent] = useState(() => getBookNotes(book.bookId));
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState("idle"); // 'idle' | 'saving' | 'saved'

  const wordCount = noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0;
  const charCount = noteContent.length;

  const handleChange = (e) => {
    const text = e.target.value;
    setNoteContent(text);
    setSavedStatus("saving");

    saveBookNote(book.bookId, text);
    setTimeout(() => {
      setSavedStatus("saved");
    }, 400);
  };

  const insertTemplate = (snippet) => {
    const updated = noteContent ? `${noteContent}\n\n${snippet}` : snippet;
    setNoteContent(updated);
    saveBookNote(book.bookId, updated);
    setSavedStatus("saved");
  };

  const handleCopy = () => {
    if (!noteContent.trim()) return;
    navigator.clipboard.writeText(noteContent);
    setCopied(true);
    showToast("📋 Study notes copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!noteContent.trim()) return;
    const header = `# 📖 Study Notes: ${book.bookName}\n**Author:** ${book.author} | **Category:** ${book.category} | **Date:** ${new Date().toLocaleDateString()}\n\n---\n\n`;
    const fullDoc = header + noteContent;
    const blob = new Blob([fullDoc], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${book.bookName.replace(/[^a-zA-Z0-9]/g, "_")}_Notes.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("📥 Exported Markdown notes successfully!", "success");
  };

  const handleClear = () => {
    if (window.confirm(`Are you sure you want to clear your notes for "${book.bookName}"?`)) {
      setNoteContent("");
      saveBookNote(book.bookId, "");
      setSavedStatus("saved");
      showToast("Notes cleared", "info");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={book.image}
              alt={book.bookName}
              className="h-14 w-10 object-cover rounded-lg shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Scholar Notes & Reflection
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                {book.bookName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">By {book.author}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            aria-label="Close notes modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Insert Snippet Pills */}
        <div className="py-3 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Insert:</span>
          <button
            onClick={() => insertTemplate("## 🎯 Key Takeaways\n- ")}
            className="shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-slate-700 dark:text-slate-200 hover:border-violet-400 transition"
          >
            + Key Takeaways
          </button>
          <button
            onClick={() => insertTemplate(`> "${book.famousPassage || "A memorable truth..."}"\n— ${book.author}`)}
            className="shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-slate-700 dark:text-slate-200 hover:border-amber-400 transition"
          >
            + Book Quote
          </button>
          <button
            onClick={() => insertTemplate("### 💭 Philosophical Reflection\n")}
            className="shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition"
          >
            + Reflection
          </button>
        </div>

        {/* Textarea */}
        <div className="flex-1 min-h-[220px] my-1 flex flex-col">
          <textarea
            value={noteContent}
            onChange={handleChange}
            placeholder={`Jot down your study notes, personal reflections, favorite passages, and critical thoughts on "${book.bookName}"...\n\nYour notes are automatically saved to your browser.`}
            className="w-full flex-1 resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono leading-relaxed"
          />
        </div>

        {/* Footer Metrics & Actions */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3 w-3" />
              {savedStatus === "saving" ? "Saving..." : "Auto-saved"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {noteContent.trim() && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 rounded-xl p-2 text-slate-400 hover:text-rose-500 transition"
                title="Clear Notes"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={handleCopy}
              disabled={!noteContent.trim()}
              className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handleExport}
              disabled={!noteContent.trim()}
              className="flex items-center gap-1 rounded-xl bg-violet-600 px-3.5 py-1.5 font-bold text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 disabled:opacity-40 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export .MD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScholarNotesModal = ({ book, isOpen, onClose }) => {
  if (!isOpen || !book) return null;
  return <ScholarNotesDialog key={book.bookId} book={book} onClose={onClose} />;
};

export default ScholarNotesModal;
