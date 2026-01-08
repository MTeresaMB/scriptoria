import React, { useMemo, useState } from "react";
import { useCharacters } from "@/hooks/useCharacters";
import { useToast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../layout/LoadinSpinner";
import { User } from "lucide-react";
import { EmptyState } from "../common/emptyState/EmptyState";
import { CharacterCard } from "./CharacterCard";
import { ErrorState } from "../common/errorState/ErrorState";
import { SearchBar } from "../common/searchBar/SearchBar";
import { FilterBar } from "../common/filterBar/FilterBar";
import { SortSelect } from "../common/sortSelect/SortSelect";
import { filterBySearch, filterByField, sortItems, type SortOption } from "@/utils/filters";

interface CharactersListProps {
  onCreateNewCharacter?: () => void;
}

export const CharactersList: React.FC<CharactersListProps> = ({ onCreateNewCharacter }) => {
  const navigate = useNavigate();
  const { characters, isLoading, error, remove, getCharacters } = useCharacters();
  const { toast } = useToast();

  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical');

  const filteredAndSortedCharacters = useMemo(() => {
    let filtered = characters || [];

    // Búsqueda
    filtered = filterBySearch(filtered, searchText, ['name', 'role']);

    // Filtro por rol
    filtered = filterByField(filtered, 'role', roleFilter);

    // Ordenación
    filtered = sortItems(
      filtered,
      sortOption,
      undefined,
      'name'
    );

    return filtered;
  }, [characters, searchText, roleFilter, sortOption]);

  const roleOptions = useMemo(() => {
    const roles = new Set<string>();
    characters?.forEach((char) => {
      if (char.role) roles.add(char.role);
    });
    return Array.from(roles).map((role) => ({ value: role, label: role }));
  }, [characters]);

  const sortOptions = [
    { value: 'alphabetical', label: 'A-Z' },
    { value: 'alphabetical-desc', label: 'Z-A' },
  ];

  const handleCreateCharacter = () => {
    if (onCreateNewCharacter) return onCreateNewCharacter();
    navigate('/characters/new?from=characters');
  }

  const handleEditCharacter = (id: number) => {
    navigate(`/characters/edit/${id}?from=characters`);
  }

  const handleDeleteCharacter = async (id: number) => {
    try {
      await remove(id);
      toast.success('Character deleted successfully');
    } catch {
      toast.error('Error deleting character');
    }
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) return <ErrorState error={error} onRetry={getCharacters} itemType="characters" />;

  if (!characters || characters.length === 0) return (
    <EmptyState
      icon={User}
      title="No characters yet"
      description="Start creating your characters now and bring them to life."
      actionLabel="Create new character"
      onAction={handleCreateCharacter}
    />
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Characters</h2>
          <p className="text-slate-400 mt-1">
            {filteredAndSortedCharacters.length} of {characters.length} {characters.length === 1 ? 'Character' : 'Characters'}
          </p>
        </div>
        <button
          onClick={handleCreateCharacter}
          className="flex items-center space-x-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <User className="w-4 h-4" />
          New Character
        </button>
      </div>

      {/* Search, Filters and Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by name or role..."
          />
        </div>
        <div className="flex gap-4">
          {roleOptions.length > 0 && (
            <FilterBar
              label="Role"
              options={roleOptions}
              value={roleFilter}
              onChange={setRoleFilter}
            />
          )}
          <SortSelect
            options={sortOptions}
            value={sortOption}
            onChange={(value) => setSortOption(value as SortOption)}
          />
        </div>
      </div>

      {filteredAndSortedCharacters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No characters match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCharacters.map((character) => (
            <CharacterCard
              key={character.id_character}
              character={character}
              onDelete={handleDeleteCharacter}
              onEdit={handleEditCharacter}
              onView={(id) => navigate(`/characters/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}