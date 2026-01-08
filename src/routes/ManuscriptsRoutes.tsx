import { ManuscriptForm } from "@/components/manuscripts/ManuscriptForm";
import { useReturnNavigation } from "@/hooks/useReturnNavigation";
import type { Manuscript } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useManuscripts } from "@/hooks/useManuscripts";
import { SkeletonLoader } from "@/components/common/skeletonLoader/SkeletonLoader";
import { ErrorState } from "@/components/common/errorState/ErrorState";

export function ManuscriptNewPage() {
  const navigate = useNavigate();
  const returnTo = useReturnNavigation('/manuscripts');

  const handleSubmit = () => {
    navigate(returnTo);
  };

  return (
    <div className="p-6">
      <ManuscriptForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(returnTo)}
      />
    </div>
  );
}

export function ManuscriptEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const returnTo = useReturnNavigation('/manuscripts');
  const { fetchManuscriptById, isLoading, error } = useManuscripts();

  const [data, setData] = useState<Manuscript | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLocalError('No manuscript ID provided');
      return;
    }

    const manuscriptId = parseInt(id, 10);
    if (isNaN(manuscriptId)) {
      setLocalError('Invalid manuscript ID');
      return;
    }

    (async () => {
      try {
        setLocalError(null);
        const manuscript = await fetchManuscriptById(manuscriptId);
        if (manuscript) {
          setData(manuscript as Manuscript);
        } else {
          setLocalError('Manuscript not found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading manuscript';
        setLocalError(errorMessage);
      }
    })();
  }, [id, fetchManuscriptById]);

  const handleRetry = () => {
    if (!id) return;
    const manuscriptId = parseInt(id, 10);
    if (!isNaN(manuscriptId)) {
      void fetchManuscriptById(manuscriptId).then((manuscript) => {
        if (manuscript) {
          setData(manuscript as Manuscript);
          setLocalError(null);
        } else {
          setLocalError('Manuscript not found');
        }
      }).catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'Error loading manuscript';
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
          error={localError || error || 'Error loading manuscript'}
          onRetry={handleRetry}
          itemType="manuscript"
          title="Error loading manuscript"
          defaultMessage="An error occurred while trying to load the manuscript. Please try again."
        />
      </div>
    );
  }

  if (!data) {
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
    <div className="p-6">
      <ManuscriptForm
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
