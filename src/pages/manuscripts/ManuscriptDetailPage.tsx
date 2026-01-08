import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useManuscripts } from '@/hooks/useManuscripts';
import { useCharacters } from '@/hooks/useCharacters';
import { useChapters } from '@/hooks/useChapters';
import { useReturnNavigation } from '@/hooks/useReturnNavigation';
import { useToast } from '@/hooks/useToast';
import type { ManuscriptRow } from '@/lib/respository/manuscriptRepository';
import { SkeletonLoader } from '@/components/common/skeletonLoader/SkeletonLoader';
import { ErrorState } from '@/components/common/errorState/ErrorState';
import { DeleteConfirmModal } from '@/components/common/deleteConfirmModal/DeleteConfirmModal';
import { CardMenu } from '@/components/common/cardMenu/CardMenu';
import { StatusBadge } from '@/components/common/statusBadge/StatusBadge';
import { ProgressBar } from '@/components/common/progressBar/ProgressBar';
import { formatWordCount, formatDate, calculateProgress } from '@/utils/formatters';
import { getStatusGradientClasses } from '@/utils/statusColors';
import { CharacterCard } from '@/components/characters/CharacterCard';
import { ChapterCard } from '@/components/chapters/ChapterCard';

export const ManuscriptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const returnTo = useReturnNavigation('/manuscripts');
  const { fetchManuscriptById, remove, isLoading, error } = useManuscripts();
  const {
    characters: relatedCharacters,
    fetchCharactersByManuscriptId,
  } = useCharacters();
  const {
    chapters: relatedChapters,
    fetchChaptersByManuscriptId,
  } = useChapters();
  const { toast } = useToast();

  const [manuscript, setManuscript] = useState<ManuscriptRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const progress = calculateProgress(manuscript?.word_count ?? 0);
  const gradientClasses = getStatusGradientClasses(manuscript?.status ?? 'draft');

  useEffect(() => {
    if (!id) {
      navigate(returnTo);
      return;
    }

    const manuscriptId = parseInt(id, 10);
    if (isNaN(manuscriptId)) {
      console.error('Invalid manuscript ID:', id);
      navigate(returnTo);
      return;
    }

    const loadManuscript = async () => {
      const data = await fetchManuscriptById(manuscriptId);
      if (data) {
        setManuscript(data);
        await Promise.all([
          fetchCharactersByManuscriptId(manuscriptId),
          fetchChaptersByManuscriptId(manuscriptId),
        ]);
      }
    };

    void loadManuscript();
  }, [id, navigate, returnTo, fetchManuscriptById, fetchCharactersByManuscriptId, fetchChaptersByManuscriptId]);

  const handleEdit = () => {
    navigate(`/manuscripts/edit/${id}?from=detail`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!manuscript) return;

    setIsDeleting(true);
    try {
      await remove(manuscript.id_manuscript);
      toast.success('Manuscript deleted successfully');
      navigate(returnTo);
    } catch (err) {
      console.error('Error deleting manuscript:', err);
      toast.error('Failed to delete manuscript');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleRetry = () => {
    if (!id) return;
    const manuscriptId = parseInt(id, 10);
    if (!isNaN(manuscriptId)) {
      void fetchManuscriptById(manuscriptId).then(async (data) => {
        if (data) {
          setManuscript(data);
          await Promise.all([
            fetchCharactersByManuscriptId(manuscriptId),
            fetchChaptersByManuscriptId(manuscriptId),
          ]);
        }
      });
    }
  };

  const charactersByRole = useMemo(() => {
    const groups: Record<string, typeof relatedCharacters> = {};
    relatedCharacters.forEach((character) => {
      const role = character.role || 'Other';
      if (!groups[role]) {
        groups[role] = [];
      }
      groups[role].push(character);
    });
    return groups;
  }, [relatedCharacters]);

  if (isLoading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          error={error}
          onRetry={handleRetry}
          itemType="manuscript"
          title="Error loading manuscript"
          defaultMessage="An error occurred while trying to load the manuscript. Please try again."
        />
      </div>
    );
  }

  if (!manuscript) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h3 className="text-xl font-semibold text-white mb-2">
            Manuscript not found
          </h3>
          <p className="text-slate-400 text-sm text-center mb-4">
            The manuscript you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate(returnTo)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(returnTo)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-white">{manuscript.title}</h1>
          </div>
          <CardMenu
            onEdit={handleEdit}
            onDelete={handleDelete}
            itemType="manuscript"
          />
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className={`w-20 h-20 rounded-xl bg-linear-to-br ${gradientClasses} flex items-center justify-center shrink-0`}>
              <BookOpen className="w-10 h-10 text-white opacity-80" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <StatusBadge status={manuscript?.status ?? 'draft'} />
              </div>

              <div className="space-y-2">
                {manuscript?.date_created && (
                  <p className="text-slate-400 text-sm">
                    <span className="font-medium text-slate-300">Created:</span>{' '}
                    {formatDate(manuscript.date_created)}
                  </p>
                )}
                {manuscript?.date_updated && (
                  <p className="text-slate-400 text-sm">
                    <span className="font-medium text-slate-300">Last edited:</span>{' '}
                    {formatDate(manuscript?.date_updated)}
                  </p>
                )}
                {manuscript?.genre && (
                  <p className="text-slate-400 text-sm">
                    <span className="font-medium text-slate-300">Genre:</span>{' '}
                    {manuscript?.genre}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Word Count</h3>
            <p className="text-2xl font-bold text-white">
              {formatWordCount(manuscript?.word_count ?? 0)}
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Progress</h3>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">{Math.round(progress)}%</p>
              <ProgressBar
                progress={progress}
                status={manuscript?.status ?? 'draft'}
                showLabel={false}
                size="sm"
              />
            </div>
          </div>

          {manuscript?.target_audience && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Target Audience</h3>
              <p className="text-xl font-semibold text-white">{manuscript?.target_audience}</p>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
          {manuscript?.summary ? (
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {manuscript?.summary}
            </p>
          ) : (
            <p className="text-slate-500 italic">No summary available</p>
          )}
        </div>

        {/* Related characters */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Characters in this manuscript</h2>
          </div>
          {relatedCharacters.length === 0 ? (
            <p className="text-slate-500 text-sm">No characters linked to this manuscript yet.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(charactersByRole).map(([role, characters]) => (
                <div key={role}>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">
                    {role}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {characters.map((character) => (
                      <CharacterCard
                        key={character.id_character}
                        character={character}
                        onView={(id) => navigate(`/characters/${id}?from=manuscript-detail`)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related chapters */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Chapters in this manuscript</h2>
            <button
              onClick={() => navigate(`/chapters/new?from=manuscript-detail&manuscript=${id}`)}
              className="text-sm text-purple-500 hover:text-purple-400 transition-colors"
            >
              + Add Chapter
            </button>
          </div>
          {relatedChapters.length === 0 ? (
            <p className="text-slate-500 text-sm">No chapters created for this manuscript yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedChapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id_chapter}
                  chapter={chapter}
                  onView={(id) => navigate(`/chapters/${id}?from=manuscript-detail`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        itemTitle={manuscript?.title ?? ''}
        itemType="manuscript"
        isOpen={showDeleteModal}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="This action cannot be undone. This manuscript will be deleted permanently."
      />
    </>
  );
};