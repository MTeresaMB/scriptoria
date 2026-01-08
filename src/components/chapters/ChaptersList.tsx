import React, { useMemo } from "react"
import { useChapters } from "@/hooks/useChapters"
import { LoadingSpinner } from "@/components/layout/LoadinSpinner"
import { EmptyState } from "@/components/common/emptyState/EmptyState"
import { ErrorState } from "@/components/common/errorState/ErrorState"
import { ChapterCard } from "@/components/chapters/ChapterCard"
import { FileText, BookOpen } from "lucide-react"
import { useManuscripts } from "@/hooks/useManuscripts"
import { SearchBar } from "@/components/common/searchBar/SearchBar"
import { FilterBar } from "@/components/common/filterBar/FilterBar"
import { SortSelect } from "@/components/common/sortSelect/SortSelect"
import type { SortOption } from "@/utils/filters"
import { useChapterFilters } from "./hooks/useChapterFilters"
import { useChapterGrouping } from "./hooks/useChapterGrouping"
import { useChapterActions } from "./hooks/useChapterActions"

interface ChaptersListProps {
  onCreateNewChapter?: () => void
}

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'alphabetical-desc', label: 'Z-A' },
  { value: 'status', label: 'By Status' },
  { value: 'word-count', label: 'Word Count' },
]

export const ChaptersList: React.FC<ChaptersListProps> = ({ onCreateNewChapter }) => {
  const { chapters, isLoading, error, getChapters } = useChapters()
  const { manuscripts } = useManuscripts()

  const {
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    filteredAndSortedChapters,
  } = useChapterFilters(chapters)

  const { groupedChapters, getGroupColor } = useChapterGrouping(filteredAndSortedChapters)

  const {
    handleCreateChapter,
    handleEditChapter,
    handleViewChapter,
    handleDeleteChapter,
  } = useChapterActions({ onCreateNewChapter })

  const getManuscriptTitle = useMemo(() => {
    return (id_manuscript: number | null) => {
      if (!id_manuscript) return undefined
      return manuscripts?.find((m) => m.id_manuscript === id_manuscript)?.title
    }
  }, [manuscripts])

  if (isLoading) return <LoadingSpinner />

  if (error) return <ErrorState error={error} onRetry={getChapters} itemType="chapters" />

  if (!chapters || chapters.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No chapters yet"
        description="Create your first chapter and start structuring your story."
        actionLabel="Create new chapter"
        onAction={handleCreateChapter}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Chapters</h2>
          <p className="text-slate-400 mt-1">
            {filteredAndSortedChapters.length} of {chapters.length} {chapters.length === 1 ? 'Chapter' : 'Chapters'}
          </p>
        </div>
        <button
          onClick={handleCreateChapter}
          className="flex items-center space-x-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>New Chapter</span>
        </button>
      </div>

      {/* Search, Filters and Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by name or summary..."
          />
        </div>
        <div className="flex gap-4">
          <FilterBar
            label="Status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <SortSelect
            options={SORT_OPTIONS}
            value={sortOption}
            onChange={(value) => setSortOption(value as SortOption)}
          />
        </div>
      </div>

      {filteredAndSortedChapters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No chapters match your filters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(groupedChapters.entries()).map(([manuscriptId, chaptersInGroup]) => {
            const manuscript = manuscriptId !== 'no-manuscript'
              ? manuscripts?.find((m) => m.id_manuscript === manuscriptId)
              : null
            const colors = getGroupColor(manuscriptId)

            return (
              <div key={manuscriptId} className="space-y-4">
                {/* Encabezado del grupo */}
                <div className={`flex items-center gap-3 pb-2 border-b ${colors.border}`}>
                  <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <BookOpen className={`w-4 h-4 ${colors.icon}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {manuscript ? manuscript.title : 'No Manuscript'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {chaptersInGroup.length} {chaptersInGroup.length === 1 ? 'chapter' : 'chapters'}
                    </p>
                  </div>
                </div>

                {/* Grid de capítulos del grupo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chaptersInGroup.map((chapter) => (
                    <ChapterCard
                      key={chapter.id_chapter}
                      chapter={chapter}
                      manuscriptTitle={getManuscriptTitle(chapter.id_manuscript)}
                      onView={handleViewChapter}
                      onEdit={handleEditChapter}
                      onDelete={handleDeleteChapter}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


