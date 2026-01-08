import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReturnNavigation } from "@/hooks/useReturnNavigation";
import type { Chapter } from "@/types";
import { ChapterForm } from "@/components/chapters/ChapterForm";
import { useChapters } from "@/hooks/useChapters";
import { SkeletonLoader } from "@/components/common/skeletonLoader/SkeletonLoader";
import { ErrorState } from "@/components/common/errorState/ErrorState";

export function ChapterNewPage() {
  const navigate = useNavigate();
  const returnTo = useReturnNavigation('/chapters');

  const handleSubmit = () => {
    navigate(returnTo);
  };

  return (
    <div className="p-6">
      <ChapterForm
        onSubmit={handleSubmit as unknown as (data: Chapter) => void}
        onCancel={() => navigate(returnTo)}
      />
    </div>
  );
}

export function ChapterEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const returnTo = useReturnNavigation('/chapters');
  const { fetchChapterById, isLoading, error } = useChapters();

  const [data, setData] = useState<Chapter | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLocalError('No chapter ID provided');
      return;
    }

    const chapterId = parseInt(id, 10);
    if (isNaN(chapterId)) {
      setLocalError('Invalid chapter ID');
      return;
    }

    (async () => {
      try {
        setLocalError(null);
        const chapter = await fetchChapterById(chapterId);
        if (chapter) {
          setData(chapter as Chapter);
        } else {
          setLocalError('Chapter not found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading chapter';
        setLocalError(errorMessage);
      }
    })();
  }, [id, fetchChapterById]);

  const handleRetry = () => {
    if (!id) return;
    const chapterId = parseInt(id, 10);
    if (!isNaN(chapterId)) {
      void fetchChapterById(chapterId).then((chapter) => {
        if (chapter) {
          setData(chapter as Chapter);
          setLocalError(null);
        } else {
          setLocalError('Chapter not found');
        }
      }).catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'Error loading chapter';
        setLocalError(errorMessage);
      });
    }
  };

  if (isLoading || (!data && !localError)) {
    return (
      <div className="p-6">
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (localError || error) {
    return (
      <div className="p-6">
        <ErrorState
          error={localError || error || 'Error loading chapter'}
          onRetry={handleRetry}
          itemType="chapter"
          title="Error loading chapter"
          defaultMessage="An error occurred while trying to load the chapter. Please try again."
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h3 className="text-xl font-semibold text-white mb-2">
            Chapter not found
          </h3>
          <p className="text-slate-400 text-sm text-center mb-4">
            The chapter you're looking for doesn't exist or has been deleted.
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
    <div className="p-6">
      <ChapterForm
        initialDataForm={data}
        onSubmit={() => {
          navigate(returnTo);
        }}
        onCancel={() => {
          navigate(returnTo);
        }}
      />
    </div>
  );
}
