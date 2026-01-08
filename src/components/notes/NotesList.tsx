import React, { useMemo, useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useToast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../layout/LoadinSpinner";
import { FileText } from "lucide-react";
import { EmptyState } from "../common/emptyState/EmptyState";
import { NoteCard } from "./NoteCard";
import { ErrorState } from "../common/errorState/ErrorState";
import { useManuscripts } from "@/hooks/useManuscripts";
import { SearchBar } from "../common/searchBar/SearchBar";
import { FilterBar } from "../common/filterBar/FilterBar";
import { SortSelect } from "../common/sortSelect/SortSelect";
import { filterBySearch, filterByField, sortItems, type SortOption } from "@/utils/filters";

interface NotesListProps {
  onCreateNewNote?: () => void;
}

export const NotesList: React.FC<NotesListProps> = ({ onCreateNewNote }) => {
  const navigate = useNavigate();
  const { notes, isLoading, error, remove, getNotes } = useNotes();
  const { manuscripts } = useManuscripts();
  const { toast } = useToast();

  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('recent');

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes || [];

    // Búsqueda
    filtered = filterBySearch(filtered, searchText, ['title', 'content', 'category']);

    // Filtros
    filtered = filterByField(filtered, 'category', categoryFilter);
    filtered = filterByField(filtered, 'priority', priorityFilter);

    // Ordenación
    filtered = sortItems(
      filtered,
      sortOption,
      'date_created',
      'title'
    );

    return filtered;
  }, [notes, searchText, categoryFilter, priorityFilter, sortOption]);

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    notes?.forEach((note) => {
      if (note.category) categories.add(note.category);
    });
    return Array.from(categories).map((cat) => ({ value: cat, label: cat }));
  }, [notes]);

  const priorityOptions = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'alphabetical', label: 'A-Z' },
    { value: 'alphabetical-desc', label: 'Z-A' },
  ];

  const handleCreateNote = () => {
    if (onCreateNewNote) return onCreateNewNote();
    navigate('/notes/new?from=notes');
  };

  const handleEditNote = (id: number) => {
    navigate(`/notes/edit/${id}?from=notes`);
  };

  const handleViewNote = (id: number) => {
    navigate(`/notes/${id}?from=notes`);
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await remove(id);
      toast.success('Note deleted successfully');
    } catch {
      toast.error('Error deleting note');
    }
  };

  const getManuscriptTitle = (id_manuscript: number | null) => {
    if (!id_manuscript) return undefined;
    return manuscripts?.find((m) => m.id_manuscript === id_manuscript)?.title;
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) return <ErrorState error={error} onRetry={getNotes} itemType="notes" />;

  if (!notes || notes.length === 0) return (
    <EmptyState
      icon={FileText}
      title="No notes yet"
      description="Start creating your notes now to capture your ideas."
      actionLabel="Create new note"
      onAction={handleCreateNote}
    />
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Notes</h2>
          <p className="text-slate-400 mt-1">
            {filteredAndSortedNotes.length} of {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
          </p>
        </div>
        <button
          onClick={handleCreateNote}
          className="flex items-center space-x-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <FileText className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Search, Filters and Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by title, content or category..."
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          {categoryOptions.length > 0 && (
            <FilterBar
              label="Category"
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
          )}
          <FilterBar
            label="Priority"
            options={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
          />
          <SortSelect
            options={sortOptions}
            value={sortOption}
            onChange={(value) => setSortOption(value as SortOption)}
          />
        </div>
      </div>

      {filteredAndSortedNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No notes match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedNotes.map((note) => (
            <NoteCard
              key={note.id_note}
              note={note}
              onDelete={handleDeleteNote}
              onEdit={handleEditNote}
              onView={handleViewNote}
              manuscriptTitle={getManuscriptTitle(note.id_manuscript)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

