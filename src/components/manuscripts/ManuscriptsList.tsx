import React, { useMemo, useState } from "react";
import { useManuscripts } from "@hooks/useManuscripts";
import { LoadingSpinner } from "@components/layout/LoadinSpinner";
import { BookOpen } from "lucide-react";
import { ManuscriptCard } from "./ManuscriptCard";
import { EmptyState } from "@/components/common/emptyState/EmptyState";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { ErrorState } from "../common/errorState/ErrorState";
import { SearchBar } from "../common/searchBar/SearchBar";
import { FilterBar } from "../common/filterBar/FilterBar";
import { SortSelect } from "../common/sortSelect/SortSelect";
import { filterBySearch, filterByField, sortItems, type SortOption } from "@/utils/filters";

interface ManuscriptsListProps {
  onCreateNewManuscript?: () => void;
  onViewManuscript?: (id: number) => void;
}

export const ManuscriptsList: React.FC<ManuscriptsListProps> = ({ onCreateNewManuscript, onViewManuscript }) => {
  const navigate = useNavigate();
  const { manuscripts, isLoading, error, remove, getManuscripts } = useManuscripts();
  const { toast } = useToast();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('recent');

  const filteredAndSortedManuscripts = useMemo(() => {
    let filtered = manuscripts || [];

    // Búsqueda
    filtered = filterBySearch(filtered, searchText, ['title', 'genre']);

    // Filtro por estado
    filtered = filterByField(filtered, 'status', statusFilter);

    // Ordenación
    filtered = sortItems(
      filtered,
      sortOption,
      'date_created',
      'title',
      'status',
      'word_count'
    );

    return filtered;
  }, [manuscripts, searchText, statusFilter, sortOption]);

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'alphabetical', label: 'A-Z' },
    { value: 'alphabetical-desc', label: 'Z-A' },
    { value: 'status', label: 'By Status' },
    { value: 'word-count', label: 'Word Count' },
  ];

  const handleCreateManuscript = () => {
    if (onCreateNewManuscript) return onCreateNewManuscript();
    navigate('/manuscripts/new');
  }

  const handleViewManuscript = (id: number) => {
    if (onViewManuscript) return onViewManuscript(id);
    navigate(`/manuscripts/${id}`);
  }

  const handleEditManuscript = (id: number) => {
    navigate(`/manuscripts/edit/${id}?from=manuscripts`);
  }

  const handleDeleteManuscript = async (id: number) => {
    try {
      await remove(id);
      toast.success('Manuscript deleted successfully');
    } catch {
      toast.error('Error deleting manuscript');
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={getManuscripts} itemType="manuscripts" />;
  }

  if (!manuscripts || manuscripts.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No manuscripts yet"
        description="Start writing your story now and share it with the world."
        actionLabel="Create new manuscript"
        onAction={handleCreateManuscript}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Manuscripts</h2>
          <p className="text-slate-400 mt-1">
            {filteredAndSortedManuscripts.length} of {manuscripts.length} {manuscripts.length === 1 ? 'Manuscript' : 'Manuscripts'}
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

      {/* Search, Filters and Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by title or genre..."
          />
        </div>
        <div className="flex gap-4">
          <FilterBar
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <SortSelect
            options={sortOptions}
            value={sortOption}
            onChange={(value) => setSortOption(value as SortOption)}
          />
        </div>
      </div>

      {filteredAndSortedManuscripts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No manuscripts match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedManuscripts.map((manuscript) => (
            <ManuscriptCard
              key={manuscript.id_manuscript}
              manuscript={manuscript}
              onView={handleViewManuscript}
              onDelete={handleDeleteManuscript}
              onEdit={handleEditManuscript}
            />
          ))}
        </div>
      )}
    </div>
  );
};
