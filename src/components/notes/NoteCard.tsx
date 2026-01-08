import React, { useState, memo } from "react";
import type { Note } from "@/types";
import { DeleteConfirmModal } from "../common/deleteConfirmModal/DeleteConfirmModal";
import { CardMenu } from "../common/cardMenu/CardMenu";
import { BaseCard } from "../common/baseCard/BaseCard";
import { FileText, Calendar } from "lucide-react";
import { formatDate } from "@/utils/formatters";

interface NoteCardProps {
  note: Note;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => Promise<void>;
  onView?: (id: number) => void;
  manuscriptTitle?: string;
}

export const NoteCard: React.FC<NoteCardProps> = memo(({
  note,
  onEdit,
  onDelete,
  onView,
  manuscriptTitle
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(note.id_note);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsDeleting(false);
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

  return (
    <>
      <BaseCard
        onClick={() => onView?.(note.id_note)}
        hoverColor="hover:border-blue-500"
        focusRingColor="focus-within:ring-blue-500"
        ariaLabel={`View note: ${note.title}`}
        className="p-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-base truncate mb-1">
                {note.title}
              </h4>

              {note.content && (
                <p className="text-slate-400 text-sm line-clamp-2 mb-2">
                  {note.content}
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {note.category && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600 shrink-0">
                    {note.category}
                  </span>
                )}
                {note.priority && (
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border shrink-0 ${getPriorityColor(note.priority)}`}>
                    {note.priority}
                  </span>
                )}
                {note.date_created && (
                  <span className="text-slate-500 text-xs flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    {formatDate(note.date_created)}
                  </span>
                )}
                {manuscriptTitle && (
                  <>
                    {(note.category || note.priority || note.date_created) && (
                      <span className="text-slate-500 text-xs shrink-0">•</span>
                    )}
                    <span className="text-slate-500 text-xs truncate max-w-[150px]">{manuscriptTitle}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <CardMenu
              onView={onView ? () => onView(note.id_note) : undefined}
              onEdit={onEdit ? () => onEdit(note.id_note) : undefined}
              onDelete={onDelete ? () => setShowConfirmDelete(true) : undefined}
              itemType="note"
            />
          </div>
        </div>
      </BaseCard>

      <DeleteConfirmModal
        itemTitle={note.title}
        itemType="note"
        isOpen={showConfirmDelete}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
        message="This action cannot be undone. This note will be deleted permanently."
      />
    </>
  );
});

NoteCard.displayName = 'NoteCard';

