import React from 'react';

interface DeleteConfirmModalProps {
  itemTitle: string;
  itemType: string;
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  itemTitle,
  itemType,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
  message,
}) => {
  if (!isOpen) return null;
  const title = itemType ? `Delete ${itemType}?` : 'Delete Item?';
  const displayMessage = message || `This action cannot be undone. "${itemTitle}" will be deleted permanently.`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md mx-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-slate-400 mb-4">
          {displayMessage}
        </p>
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
