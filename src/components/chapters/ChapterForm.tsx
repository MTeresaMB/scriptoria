import { useEffect } from "react";
import type { Chapter } from "@/types";
import { useManuscripts } from "@/hooks/useManuscripts";
import { useChapterForm } from "./hooks/useChapterForm";

interface ChapterFormProps {
  initialDataForm?: Chapter;
  onSubmit: (data: Chapter) => void;
  onCancel: () => void;
  onChange?: (data: Partial<Chapter>) => void;
}

export const ChapterForm: React.FC<ChapterFormProps> = ({
  initialDataForm,
  onSubmit,
  onCancel,
  onChange,
}) => {
  const { manuscripts, isLoading: isLoadingManuscripts } = useManuscripts();
  const { formData, isSubmitting, error, fieldErrors, touchedFields, handleInputChange, handleBlur, handleSubmit } = useChapterForm({
    initialData: initialDataForm,
    onSuccess: onSubmit,
  });

  // Notify parent of changes if onChange is provided
  useEffect(() => {
    if (onChange) {
      onChange(formData as Partial<Chapter>);
    }
  }, [formData, onChange]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-sm">
      <h2 className="text-2xl font-bold text-white mb-6">
        {initialDataForm ? "Edit Chapter" : "New Chapter"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Basic info */}
        <div className="border-b border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name_chapter" className="block text-sm font-medium text-slate-300">
                Title *
              </label>
              <input
                id="name_chapter"
                name="name_chapter"
                type="text"
                value={formData.name_chapter}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={`w-full mt-1 px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${fieldErrors.name_chapter && touchedFields.has('name_chapter')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-600 focus:ring-purple-500'
                  }`}
              />
              {fieldErrors.name_chapter && touchedFields.has('name_chapter') && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.name_chapter}</p>
              )}
            </div>

            <div>
              <label htmlFor="chapter_number" className="block text-sm font-medium text-slate-300">
                Chapter number
              </label>
              <input
                id="chapter_number"
                name="chapter_number"
                type="number"
                value={formData.chapter_number ?? ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min={1}
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-300">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status ?? ""}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">None</option>
                <option value="Draft">Draft</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="word_count" className="block text-sm font-medium text-slate-300">
                Word count
              </label>
              <input
                id="word_count"
                name="word_count"
                type="number"
                value={formData.word_count ?? ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min={0}
                className={`w-full mt-1 px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${fieldErrors.word_count && touchedFields.has('word_count')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-600 focus:ring-purple-500'
                  }`}
              />
              {fieldErrors.word_count && touchedFields.has('word_count') && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.word_count}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="id_manuscript" className="block text-sm font-medium text-slate-300">
                Manuscript
              </label>
              <select
                id="id_manuscript"
                name="id_manuscript"
                value={formData.id_manuscript ?? ""}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          </div>
        </div>

        {/* Summary */}
        <div className="border-b border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-slate-300">
              Short summary
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary ?? ""}
              onChange={handleInputChange}
              onBlur={handleBlur}
              rows={3}
              className={`w-full mt-1 px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${fieldErrors.summary && touchedFields.has('summary')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-purple-500'
                }`}
            />
            {fieldErrors.summary && touchedFields.has('summary') && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.summary}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">
              {formData.summary?.length || 0} / 2000 characters
            </p>
          </div>
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
            className="px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
