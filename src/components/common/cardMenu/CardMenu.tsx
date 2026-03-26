import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Eye, Edit, Trash2, FileEdit } from 'lucide-react';

interface CardMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onEditInEditor?: () => void;
  onDelete?: () => void;
  itemType?: string;
}

export const CardMenu: React.FC<CardMenuProps> = ({
  onView,
  onEdit,
  onEditInEditor,
  onDelete,
  itemType = 'item',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void | undefined) => {
    if (action) {
      action();
      setIsOpen(false);
    }
  };

  const hasActions = onView || onEdit || onEditInEditor || onDelete;

  if (!hasActions) return null;

  const dropdownStyle: React.CSSProperties = {
    position: 'fixed',
    top: dropdownPosition.top,
    right: dropdownPosition.right,
    zIndex: 9999,
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800"
        aria-label={`${itemType} menu`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop para móviles */}
          <div
            className="fixed inset-0 z-9998 md:hidden bg-black/20"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown Menu - renderizado en portal para evitar recorte por overflow */}
          {createPortal(
            <div
              ref={menuRef}
              className="w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1"
              style={dropdownStyle}
            >
            {onView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onView);
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            )}

            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onEdit);
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}

            {onEditInEditor && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onEditInEditor);
                }}
                className="w-full px-4 py-2 text-left text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 hover:text-purple-900 dark:hover:text-purple-200 transition-colors flex items-center gap-2 focus:outline-none focus:bg-purple-500/10"
              >
                <FileEdit className="w-4 h-4" />
                <span>Edit in Editor</span>
              </button>
            )}

            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onDelete);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2 focus:outline-none focus:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
};

