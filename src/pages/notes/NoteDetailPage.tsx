import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, Tag, AlertCircle, BookOpen, ExternalLink } from 'lucide-react';
import { useReturnNavigation } from '@/hooks/useReturnNavigation';
import { useToast } from '@/hooks/useToast';
import { useNotes } from '@/hooks/useNotes';
import type { NoteRow } from '@/lib/respository/notesRepository';
import { SkeletonLoader } from '@/components/common/skeletonLoader/SkeletonLoader';
import { ErrorState } from '@/components/common/errorState/ErrorState';
import { DeleteConfirmModal } from '@/components/common/deleteConfirmModal/DeleteConfirmModal';
import { CardMenu } from '@/components/common/cardMenu/CardMenu';
import { formatDate } from '@/utils/formatters';
import { useManuscripts } from '@/hooks/useManuscripts';

export const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const returnTo = useReturnNavigation('/notes');
  const { toast } = useToast();

  const {
    notes,
    isLoading,
    error,
    remove,
    fetchNoteById,
  } = useNotes();

  const { manuscripts } = useManuscripts();

  const [note, setNote] = useState<NoteRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate(returnTo);
      return;
    }

    const noteId = parseInt(id, 10);
    if (isNaN(noteId)) {
      console.error('Invalid note ID:', id);
      navigate(returnTo);
      return;
    }

    const loadNote = async () => {
      const data = await fetchNoteById(noteId);
      if (data) {
        setNote(data);
      }
    };

    void loadNote();
  }, [id, navigate, returnTo, fetchNoteById]);

  const handleEdit = () => {
    if (!id) return;
    navigate(`/notes/edit/${id}?from=detail`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!note) return;

    setIsDeleting(true);
    try {
      await remove(note.id_note);
      toast.success('Note deleted successfully');
      navigate(returnTo);
    } catch (err) {
      console.error('Error deleting note:', err);
      toast.error('Failed to delete note');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleRetry = () => {
    if (!id) return;
    const noteId = parseInt(id, 10);
    if (!isNaN(noteId)) {
      void fetchNoteById(noteId).then((data) => {
        if (data) {
          setNote(data);
        }
      });
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const manuscriptTitle = note?.id_manuscript
    ? manuscripts?.find((m) => m.id_manuscript === note.id_manuscript)?.title
    : undefined;

  if (isLoading && !note && !notes.length) {
    return (
      <div className="p-6">
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          error={error}
          onRetry={handleRetry}
          itemType="note"
          title="Error loading note"
          defaultMessage="An error occurred while trying to load the note. Please try again."
        />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h3 className="text-xl font-semibold text-white mb-2">
            Note not found
          </h3>
          <p className="text-slate-400 text-sm text-center mb-4">
            The note you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate(returnTo)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(returnTo)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-white">{note.title}</h1>
          </div>
          <CardMenu
            onEdit={handleEdit}
            onDelete={handleDelete}
            itemType="note"
          />
        </div>

        {/* Main info */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {note.category && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Category</p>
                    <p className="text-white font-medium">{note.category}</p>
                  </div>
                </div>
              )}
              {note.priority && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Priority</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(note.priority)}`}>
                      {note.priority}
                    </span>
                  </div>
                </div>
              )}
              {note.date_created && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Created</p>
                    <p className="text-white font-medium">{formatDate(note.date_created)}</p>
                  </div>
                </div>
              )}
              {note.id_manuscript && manuscriptTitle && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">Related Manuscript</p>
                  <button
                    onClick={() => navigate(`/manuscripts/${note.id_manuscript}?from=note-detail`)}
                    className="flex items-center gap-2 text-white font-medium hover:text-purple-400 transition-colors group"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{manuscriptTitle}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Content</h2>
          {note.content ? (
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          ) : (
            <p className="text-slate-500 italic">No content available</p>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        itemTitle={note.title}
        itemType="note"
        isOpen={showDeleteModal}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="This action cannot be undone. This note will be deleted permanently."
      />
    </>
  );
};

