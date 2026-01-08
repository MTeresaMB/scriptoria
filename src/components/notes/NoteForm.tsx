import React from "react";
import type { Note } from "@/types";
import { useManuscripts } from "@/hooks/useManuscripts";
import { useNoteForm } from "./hooks/useNoteForm";

interface NoteFormProps {
  initialDataForm?: Note;
  onSubmit: (data: Note) => void;
  onCancel: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  initialDataForm,
  onSubmit,
  onCancel
}) => {
  const { formData, isSubmitting, error, fieldErrors, touchedFields, handleInputChange, handleBlur, handleSubmit } = useNoteForm({
    initialData: initialDataForm,
    onSuccess: onSubmit,
  });
  const { manuscripts, isLoading: isLoadingManuscripts } = useManuscripts();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-sm">
      <h2 className="text-2xl font-bold text-white mb-6">
        {initialDataForm ? 'Edit Note' : 'New Note'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            className={`w-full mt-1 px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${fieldErrors.title && touchedFields.has('title')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-blue-500'
              }`}
          />
          {fieldErrors.title && touchedFields.has('title') && (
            <p className="mt-1 text-sm text-red-400">{fieldErrors.title}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-300">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content ?? ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={8}
            className={`w-full mt-1 px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${fieldErrors.content && touchedFields.has('content')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-blue-500'
              }`}
            placeholder="Write your note content here..."
          />
          {fieldErrors.content && touchedFields.has('content') && (
            <p className="mt-1 text-sm text-red-400">{fieldErrors.content}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {formData.content?.length || 0} / 10000 characters
          </p>
        </div>

        {/* Category and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300">
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category ?? ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="e.g., Plot, Character, World-building"
              className={`w-full mt-1 px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${fieldErrors.category && touchedFields.has('category')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-600 focus:ring-blue-500'
                }`}
            />
            {fieldErrors.category && touchedFields.has('category') && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.category}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-300">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority ?? ''}
              onChange={handleInputChange}
              className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Related Manuscript */}
        <div>
          <label htmlFor="id_manuscript" className="block text-sm font-medium text-slate-300">
            Related Manuscript
          </label>
          <select
            id="id_manuscript"
            name="id_manuscript"
            value={formData.id_manuscript ?? ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            {isLoadingManuscripts ? (
              <option disabled>Loading manuscripts...</option>
            ) : (
              manuscripts?.map((manuscript) => (
                <option key={manuscript.id_manuscript} value={manuscript.id_manuscript}>
                  {manuscript.title}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};
