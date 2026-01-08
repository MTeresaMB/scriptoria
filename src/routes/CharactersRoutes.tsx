import { CharacterForm } from "@/components/characters/CharacterForm";
import { useReturnNavigation } from "@/hooks/useReturnNavigation";
import type { Character } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCharacters } from "@/hooks/useCharacters";
import { SkeletonLoader } from "@/components/common/skeletonLoader/SkeletonLoader";
import { ErrorState } from "@/components/common/errorState/ErrorState";

export function CharacterNewPage() {
  const navigate = useNavigate();
  const returnTo = useReturnNavigation('/characters');

  const handleSubmit = () => {
    navigate(returnTo);
  };

  return (
    <div className="p-6">
      <CharacterForm onSubmit={handleSubmit} onCancel={() => navigate(returnTo)} />
    </div>
  );
}

export function CharacterEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const returnTo = useReturnNavigation('/characters');
  const { fetchCharacterById, isLoading, error } = useCharacters();

  const [data, setData] = useState<Character | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLocalError('No character ID provided');
      return;
    }

    const characterId = parseInt(id, 10);
    if (isNaN(characterId)) {
      setLocalError('Invalid character ID');
      return;
    }

    (async () => {
      try {
        setLocalError(null);
        const character = await fetchCharacterById(characterId);
        if (character) {
          setData(character as Character);
        } else {
          setLocalError('Character not found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading character';
        setLocalError(errorMessage);
      }
    })();
  }, [id, fetchCharacterById]);

  const handleRetry = () => {
    if (!id) return;
    const characterId = parseInt(id, 10);
    if (!isNaN(characterId)) {
      void fetchCharacterById(characterId).then((character) => {
        if (character) {
          setData(character as Character);
          setLocalError(null);
        } else {
          setLocalError('Character not found');
        }
      }).catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'Error loading character';
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
          error={localError || error || 'Error loading character'}
          onRetry={handleRetry}
          itemType="character"
          title="Error loading character"
          defaultMessage="An error occurred while trying to load the character. Please try again."
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h3 className="text-xl font-semibold text-white mb-2">
            Character not found
          </h3>
          <p className="text-slate-400 text-sm text-center mb-4">
            The character you're looking for doesn't exist or has been deleted.
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
      <CharacterForm
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
