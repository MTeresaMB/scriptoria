import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReturnNavigation } from "@/hooks/useReturnNavigation";
import type { Note } from "@/types";
import { NoteForm } from "@/components/notes/NoteForm";
import { useNotes } from "@/hooks/useNotes";
import { SkeletonLoader } from "@/components/common/skeletonLoader/SkeletonLoader";
import { ErrorState } from "@/components/common/errorState/ErrorState";

export function NoteNewPage() {
  const navigate = useNavigate();
  const returnTo = useReturnNavigation('/notes');

  const handleSubmit = () => {
    navigate(returnTo);
  };

  return (
    <div className="p-6">
      <NoteForm
        onSubmit={handleSubmit as unknown as (data: Note) => void}
        onCancel={() => navigate(returnTo)}
      />
    </div>
  );
}

export function NoteEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const returnTo = useReturnNavigation('/notes');
  const { fetchNoteById, isLoading, error } = useNotes();

  const [data, setData] = useState<Note | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLocalError('No note ID provided');
      return;
    }

    const noteId = parseInt(id, 10);
    if (isNaN(noteId)) {
      setLocalError('Invalid note ID');
      return;
    }

    (async () => {
      try {
        setLocalError(null);
        const note = await fetchNoteById(noteId);
        if (note) {
          setData(note as Note);
        } else {
          setLocalError('Note not found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading note';
        setLocalError(errorMessage);
      }
    })();
  }, [id, fetchNoteById]);

  const handleRetry = () => {
    if (!id) return;
    const noteId = parseInt(id, 10);
    if (!isNaN(noteId)) {
      void fetchNoteById(noteId).then((note) => {
        if (note) {
          setData(note as Note);
          setLocalError(null);
        } else {
          setLocalError('Note not found');
        }
      }).catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'Error loading note';
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
          error={localError || error || 'Error loading note'}
          onRetry={handleRetry}
          itemType="note"
          title="Error loading note"
          defaultMessage="An error occurred while trying to load the note. Please try again."
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h3 className="text-xl font-semibold text-white mb-2">
            Note not found
          </h3>
          <p className="text-slate-400 text-sm text-center mb-4">
            The note you're looking for doesn't exist or has been deleted.
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
      <NoteForm
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
