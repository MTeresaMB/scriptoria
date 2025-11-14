import React, { useState, memo } from "react";
import type { Manuscript } from "@types";
import { BookOpen, Calendar, Edit, Eye, FileText, Trash2 } from "lucide-react";
import { formatDate, formatWordCount, getStatusColor, calculateProgress } from "./utils/formatters";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";

interface ManuscriptCardProps {
  manuscript: Manuscript;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => Promise<void>;
  onView?: (id: number) => void;
}

export const ManuscriptCard: React.FC<ManuscriptCardProps> = memo(({
  manuscript,
  onEdit,
  onDelete,
  onView
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(manuscript.id_manuscript);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Error deleting manuscript:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const progress = calculateProgress(manuscript.word_count ?? 0);

  return (
    <>
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-3 hover:shadow-lg hover:border-slate-600 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{manuscript.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(manuscript.date_created ?? new Date().toISOString())}</span>
                {manuscript.genre && (
                  <>
                    <span>•</span>
                    <span>{manuscript.genre}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(manuscript.status ?? 'Draft')}`}>
            {manuscript.status ?? 'Draft'}
          </span>
        </div>

        {/* Content */}
        <div className="mb-4">
          {manuscript.summary && (
            <p className="text-slate-400 text-sm mb-3 line-clamp-3">{manuscript.summary}</p>
          )}
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>{formatWordCount(manuscript.word_count ?? 0)} words</span>
            </div>
            {/* Progress bar */}
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView?.(manuscript.id_manuscript)}
              className="flex items-center space-x-1 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">View</span>
            </button>

            <button
              onClick={() => onEdit?.(manuscript.id_manuscript)}
              className="flex items-center space-x-1 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-500 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </button>
          </div>

          <button
            onClick={() => setShowConfirmDelete(true)}
            disabled={isDeleting}
            className="flex items-center space-x-1 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </span>
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        title={manuscript.title}
        isOpen={showConfirmDelete}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
});

ManuscriptCard.displayName = 'ManuscriptCard';
