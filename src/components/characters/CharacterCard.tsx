import React, { memo, useState, useCallback } from "react";
import type { Character } from "@/types";
import { DeleteConfirmModal } from "../common/deleteConfirmModal/DeleteConfirmModal";
import { CardMenu } from "../common/cardMenu/CardMenu";
import { BaseCard } from "../common/baseCard/BaseCard";

interface CharacterCardProps {
  character: Character;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => Promise<void>;
  onView?: (id: number) => void;
  manuscriptTitle?: string;
}

export const CharacterCard: React.FC<CharacterCardProps> = memo(({
  character,
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
      await onDelete?.(character.id_character);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Error deleting character:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper para obtener iniciales
  const getInitials = useCallback((name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const initials = getInitials(character.name);

  return (
    <>
      <BaseCard
        onClick={() => onView?.(character.id_character)}
        ariaLabel={`View character: ${character.name}`}
        className="flex items-center justify-between p-4 relative hover:border-emerald-500"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-base font-bold text-white border-2 border-slate-800 shadow-sm shrink-0">
            {character.picture ? (
              <img
                src={character.picture}
                alt={character.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base truncate">{character.name}</h4>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {character.role && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shrink-0">
                  {character.role}
                </span>
              )}
              {character.age && (
                <span className="text-slate-500 text-xs shrink-0">• {character.age} years</span>
              )}
              {manuscriptTitle && (
                <>
                  {(character.role || character.age) && (
                    <span className="text-slate-500 text-xs shrink-0">•</span>
                  )}
                  <span className="text-slate-500 text-xs truncate max-w-[150px]">{manuscriptTitle}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menu Button */}
        <div className="shrink-0 ml-2">
          <CardMenu
            onView={onView ? () => onView(character.id_character) : undefined}
            onEdit={onEdit ? () => onEdit(character.id_character) : undefined}
            onDelete={onDelete ? () => setShowConfirmDelete(true) : undefined}
            itemType="character"
          />
        </div>
      </BaseCard>
      <DeleteConfirmModal
        itemTitle={character.name}
        itemType="character"
        isOpen={showConfirmDelete}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
        message="This action cannot be undone. This character will be deleted permanently."
      />
    </>
  )
});

CharacterCard.displayName = 'CharacterCard';