import React from "react";
import type { Manuscript } from "@types";
import { useGenres } from "./hooks/useGenres";
import { useManuscriptForm } from "./hooks/useManuscriptForm";
import { GenreSelect } from "./components/GenreSelect";

interface ManuscriptFormProps {
  initialDataForm?: Manuscript;
  onSubmit: (data: Manuscript) => void;
  onCancel: () => void;
}

export const ManuscriptForm: React.FC<ManuscriptFormProps> = ({
  initialDataForm,
  onSubmit,
  onCancel
}) => {
  const { genres, isLoading: isLoadingGenres } = useGenres();
  const { formData, isSubmitting, error, handleInputChange, handleSubmit } = useManuscriptForm({
    initialData: initialDataForm,
    onSuccess: onSubmit,
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-sm">
      <h2 className="text-2xl font-bold text-white mb-6">
        {initialDataForm ? 'Editar Manuscrito' : 'Nuevo Manuscrito'}
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
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-slate-300">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary ?? ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Picture */}
        <div>
          <label htmlFor="picture" className="block text-sm font-medium text-slate-300">
            Image (file)
          </label>
          <input
            id="picture"
            name="picture"
            type="file"
            onChange={handleInputChange}
            className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-slate-600 file:text-slate-200 file:hover:bg-slate-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            De momento se guarda el nombre del archivo. Si usas Supabase Storage, lo sustituiremos por la URL.
          </p>
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-slate-300">
            Genre
          </label>
          <GenreSelect
            genres={genres}
            isLoading={isLoadingGenres}
            value={formData.genre}
            onChange={handleInputChange}
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status ?? ''}
            onChange={handleInputChange}
            required
            className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" className="text-slate-400">Select status</option>
            <option value="Draft">Draft</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Word Count */}
        <div>
          <label htmlFor="word_count" className="block text-sm font-medium text-slate-300">
            Recuento de palabras
          </label>
          <input
            id="word_count"
            name="word_count"
            type="number"
            value={formData.word_count ?? 0}
            onChange={handleInputChange}
            min={0}
            className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Target Audience */}
        <div>
          <label htmlFor="target_audience" className="block text-sm font-medium text-slate-300">
            Público objetivo
          </label>
          <input
            id="target_audience"
            name="target_audience"
            type="text"
            value={formData.target_audience ?? ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};
