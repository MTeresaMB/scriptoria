import React from "react";
import type { Character } from "@/types";
import { useManuscripts } from "@/hooks/useManuscripts";
import { useCharacterForm } from "./hooks/useCharacterForm";

interface CharacterFormProps {
  initialDataForm?: Character;
  onSubmit: (data: Character) => void;
  onCancel: () => void;
}

export const CharacterForm: React.FC<CharacterFormProps> = ({
  initialDataForm,
  onSubmit,
  onCancel
}) => {
  const { formData, isSubmitting, error, fieldErrors, touchedFields, handleInputChange, handleBlur, handleSubmit } = useCharacterForm({
    initialData: initialDataForm,
    onSuccess: onSubmit,
  });
  const { manuscripts, isLoading: isLoadingManuscripts } = useManuscripts();
  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-sm">
      <h2 className="text-2xl font-bold text-white mb-6">
        {initialDataForm ? 'Edit Character' : 'New Character'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="border-b border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={`w-full mt-1 px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${fieldErrors.name && touchedFields.has('name')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-600 focus:ring-green-500'
                  }`}
              />
              {fieldErrors.name && touchedFields.has('name') && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-300">
                Role
              </label>
              <input
                id="role"
                name="role"
                type="text"
                value={formData.role ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., Protagonist, Antagonist, Supporting"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-300">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age ?? ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min={0}
                max={150}
                className={`w-full mt-1 px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${fieldErrors.age && touchedFields.has('age')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-600 focus:ring-green-500'
                  }`}
              />
              {fieldErrors.age && touchedFields.has('age') && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.age}</p>
              )}
            </div>

            {/* Occupation */}
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-slate-300">
                Occupation
              </label>
              <input
                id="occupation"
                name="occupation"
                type="text"
                value={formData.occupation ?? ''}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Birth */}
            <div>
              <label htmlFor="birth" className="block text-sm font-medium text-slate-300">
                Birth Date/Place
              </label>
              <input
                id="birth"
                name="birth"
                type="text"
                value={formData.birth ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., January 15, 1990 or City, Country"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Relationship Status */}
            <div>
              <label htmlFor="relationship_status" className="block text-sm font-medium text-slate-300">
                Relationship Status
              </label>
              <input
                id="relationship_status"
                name="relationship_status"
                type="text"
                value={formData.relationship_status ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., Single, Married, Divorced"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Physical Description */}
        <div className="border-b border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Physical Description</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Height */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-slate-300">
                Height
              </label>
              <input
                id="height"
                name="height"
                type="text"
                value={formData.height ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., 5'10 or 178 cm"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-slate-300">
                Weight
              </label>
              <input
                id="weight"
                name="weight"
                type="text"
                value={formData.weight ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., 70 kg or 154 lbs"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Build */}
            <div>
              <label htmlFor="build" className="block text-sm font-medium text-slate-300">
                Build
              </label>
              <input
                id="build"
                name="build"
                type="text"
                value={formData.build ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., Athletic, Slender, Stocky"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Hair Color */}
            <div>
              <label htmlFor="hair_color" className="block text-sm font-medium text-slate-300">
                Hair Color
              </label>
              <input
                id="hair_color"
                name="hair_color"
                type="text"
                value={formData.hair_color ?? ''}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Hair Style */}
            <div>
              <label htmlFor="hair_style" className="block text-sm font-medium text-slate-300">
                Hair Style
              </label>
              <input
                id="hair_style"
                name="hair_style"
                type="text"
                value={formData.hair_style ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., Short, Long, Curly, Straight"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Eye Color */}
            <div>
              <label htmlFor="eye_color" className="block text-sm font-medium text-slate-300">
                Eye Color
              </label>
              <input
                id="eye_color"
                name="eye_color"
                type="text"
                value={formData.eye_color ?? ''}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Eye Shape */}
            <div>
              <label htmlFor="eye_shape" className="block text-sm font-medium text-slate-300">
                Eye Shape
              </label>
              <input
                id="eye_shape"
                name="eye_shape"
                type="text"
                value={formData.eye_shape ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., Almond, Round, Narrow"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Scars */}
            <div>
              <label htmlFor="scars" className="block text-sm font-medium text-slate-300">
                Scars/Marks
              </label>
              <input
                id="scars"
                name="scars"
                type="text"
                value={formData.scars ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., Scar on left cheek"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Personality & Traits */}
        <div className="border-b border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Personality & Traits</h3>
          <div className="space-y-4">
            {/* Positive Traits */}
            <div>
              <label htmlFor="positive_traits" className="block text-sm font-medium text-slate-300">
                Positive Traits
              </label>
              <input
                id="positive_traits"
                name="positive_traits"
                type="text"
                value={formData.positive_traits ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., Brave, Kind, Intelligent (comma separated)"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Negative Traits */}
            <div>
              <label htmlFor="negative_traits" className="block text-sm font-medium text-slate-300">
                Negative Traits
              </label>
              <input
                id="negative_traits"
                name="negative_traits"
                type="text"
                value={formData.negative_traits ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., Stubborn, Impatient, Arrogant (comma separated)"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Personality Type */}
            <div>
              <label htmlFor="personality_type" className="block text-sm font-medium text-slate-300">
                Personality Type
              </label>
              <input
                id="personality_type"
                name="personality_type"
                type="text"
                value={formData.personality_type ?? ''}
                onChange={handleInputChange}
                placeholder="e.g., INTJ, ENFP, or custom description"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Quirks & Mannerisms */}
            <div>
              <label htmlFor="quirks_mannerisms" className="block text-sm font-medium text-slate-300">
                Quirks & Mannerisms
              </label>
              <textarea
                id="quirks_mannerisms"
                name="quirks_mannerisms"
                value={formData.quirks_mannerisms ?? ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g., Always taps fingers when thinking, speaks with hands"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Motivations & Flaws */}
        <div className="border-b border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Motivations & Flaws</h3>
          <div className="space-y-4">
            {/* External Motivation */}
            <div>
              <label htmlFor="external_motivation" className="block text-sm font-medium text-slate-300">
                External Motivation
              </label>
              <textarea
                id="external_motivation"
                name="external_motivation"
                value={formData.external_motivation ?? ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="What the character wants to achieve in the story?"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Internal Motivation */}
            <div>
              <label htmlFor="internal_motivation" className="block text-sm font-medium text-slate-300">
                Internal Motivation
              </label>
              <textarea
                id="internal_motivation"
                name="internal_motivation"
                value={formData.internal_motivation ?? ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="What the character needs emotionally or psychologically?"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Flaw */}
            <div>
              <label htmlFor="flaw" className="block text-sm font-medium text-slate-300">
                Fatal Flaw
              </label>
              <textarea
                id="flaw"
                name="flaw"
                value={formData.flaw ?? ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="The character's main weakness or flaw"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Fears & Phobias */}
            <div>
              <label htmlFor="fears_phobias" className="block text-sm font-medium text-slate-300">
                Fears & Phobias
              </label>
              <textarea
                id="fears_phobias"
                name="fears_phobias"
                value={formData.fears_phobias ?? ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="What the character fears most?"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Motto */}
            <div>
              <label htmlFor="motto" className="block text-sm font-medium text-slate-300">
                Motto / Catchphrase
              </label>
              <input
                id="motto"
                name="motto"
                type="text"
                value={formData.motto ?? ''}
                onChange={handleInputChange}
                placeholder="A phrase that defines the character"
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="border-b border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Biography</h3>
          <div>
            <label htmlFor="biography" className="block text-sm font-medium text-slate-300">
              Character Biography
            </label>
            <textarea
              id="biography"
              name="biography"
              value={formData.biography ?? ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              rows={6}
              placeholder="Write a detailed biography of the character, their background, history, and role in the story..."
              className={`w-full mt-1 px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${fieldErrors.biography && touchedFields.has('biography')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-600 focus:ring-green-500'
                }`}
            />
            {fieldErrors.biography && touchedFields.has('biography') && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.biography}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">
              {formData.biography?.length || 0} / 10000 characters
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-b border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manuscript */}
            <div>
              <label htmlFor="id_manuscript" className="block text-sm font-medium text-slate-300">
                Related Manuscript
              </label>
              <select
                id="id_manuscript"
                name="id_manuscript"
                value={formData.id_manuscript ?? ''}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                For now, the file name is saved. If you use Supabase Storage, we will replace it with the URL.
              </p>
            </div>
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
            className="px-4 py-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

