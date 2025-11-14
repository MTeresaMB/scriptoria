import React, { useCallback } from "react";
import { useManuscripts } from "@hooks/useManuscripts";
import { deleteManuscript } from "@lib/respository/manuscriptRepository";
import { LoadingSpinner } from "@components/layout/LoadinSpinner";
import { BookOpen } from "lucide-react";
import { ManuscriptCard } from "./ManuscriptCard";
import { useNavigate } from "react-router-dom";

interface ManuscriptsListProps {
  onCreateNewManuscript: () => void;
}

export const ManuscriptsList: React.FC<ManuscriptsListProps> = ({ onCreateNewManuscript }) => {
  const { manuscripts, isLoading, error, refetch } = useManuscripts();
  const navigate = useNavigate();

  const handleDeleteManuscript = useCallback(async (id: number) => {
    try {
      const { error } = await deleteManuscript(id);
      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error('Error deleting manuscript:', error);
    }
  }, [refetch]);

  const handleEditManuscript = useCallback((id: number) => {
    navigate(`/manuscripts/edit/${id}`);
  }, [navigate]);

  const handleViewManuscript = useCallback((id: number) => {
    navigate(`/manuscripts/view/${id}`);
  }, [navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-400 mb-4">
          <BookOpen className="w-16 h-16 mx-auto mb-2" />
        </div>
        <p className="text-slate-400 text-sm text-center">
          Error loading manuscripts. Please try again.
        </p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!manuscripts || manuscripts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-slate-500 mb-4">
          <BookOpen className="w-16 h-16 mx-auto mb-2" />
        </div>
        <h3 className="text-xl font-semibold text-white">
          No manuscripts found. Create your first manuscript.
        </h3>
        <p className="text-slate-400 text-sm text-center">
          Start writing your story now and share it with the world.
        </p>
        <button
          onClick={onCreateNewManuscript}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          Create New Manuscript
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Manuscripts</h2>
          <p className="text-slate-400 mt-1">
            {manuscripts.length} {manuscripts.length === 1 ? 'Manuscript' : 'Manuscripts'}
          </p>
        </div>
        <button
          onClick={onCreateNewManuscript}
          className="flex items-center space-x-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          New Manuscript
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manuscripts.map((manuscript) => (
          <ManuscriptCard
            key={manuscript.id_manuscript}
            manuscript={manuscript}
            onDelete={handleDeleteManuscript}
            onEdit={handleEditManuscript}
            onView={handleViewManuscript}
          />
        ))}
      </div>
    </div>
  );
};
