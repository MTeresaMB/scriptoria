import React, { useState, memo } from "react";
import type { Manuscript } from "@types";
import { BookOpen } from "lucide-react";
import { formatWordCountNumber, calculateProgress } from "../../utils/formatters";
import { getStatusGradientClasses } from "@/utils/statusColors";
import { DeleteConfirmModal } from "../common/deleteConfirmModal/DeleteConfirmModal";
import { CardMenu } from "../common/cardMenu/CardMenu";
import { StatusBadge } from "../common/statusBadge/StatusBadge";
import { ProgressBar } from "../common/progressBar/ProgressBar";
import { BaseCard } from "../common/baseCard/BaseCard";

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
  const gradientClasses = getStatusGradientClasses(manuscript.status);

  return (
    <>
      <BaseCard
        onClick={() => onView?.(manuscript.id_manuscript)}
        ariaLabel={`View manuscript: ${manuscript.title}`}
        className="relative flex overflow-hidden min-h-[140px]"
      >
        {/* Gradient Sidebar */}
        <div className={`w-24 min-h-full bg-linear-to-br ${gradientClasses} flex items-center justify-center shrink-0`}>
          <BookOpen className="w-8 h-8 text-white opacity-50" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between relative min-w-0 gap-2">
          {/* Menu Button */}
          <div className="absolute top-3 right-3 z-10">
            <CardMenu
              onView={onView ? () => onView(manuscript.id_manuscript) : undefined}
              onEdit={onEdit ? () => onEdit(manuscript.id_manuscript) : undefined}
              onDelete={onDelete ? () => setShowConfirmDelete(true) : undefined}
              itemType="manuscript"
            />
          </div>

          <div className="pr-8 min-w-0 flex-1 flex flex-col gap-1.5">
            <div>
              <StatusBadge status={manuscript.status} size="sm" />
            </div>
            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
              {manuscript.title}
            </h3>
            {manuscript.genre && (
              <p className="text-slate-400 text-xs mt-0.5">{manuscript.genre}</p>
            )}
          </div>

          <div className="w-full mt-auto">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>{formatWordCountNumber(manuscript.word_count ?? 0)} words</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar
              progress={progress}
              status={manuscript.status}
              showLabel={false}
              size="sm"
            />
          </div>
        </div>
      </BaseCard>

      <DeleteConfirmModal
        itemTitle={manuscript.title}
        itemType="manuscript"
        isOpen={showConfirmDelete}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
        message="This action cannot be undone. This manuscript will be deleted permanently."
      />
    </>
  );
});

ManuscriptCard.displayName = 'ManuscriptCard';
