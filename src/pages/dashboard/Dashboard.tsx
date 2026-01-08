import React from 'react'
import { BookOpen, Users, FileText, ArrowRight, Plus, ScrollText } from 'lucide-react'
import { formatWordCountNumber, calculateProgress, getInitials, formatDate } from '@/utils/formatters';
import { getStatusGradientClasses } from '@/utils/statusColors';
import { StatusBadge } from '@/components/common/statusBadge/StatusBadge';
import { ProgressBar } from '@/components/common/progressBar/ProgressBar';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { SkeletonLoader } from '@/components/common/skeletonLoader/SkeletonLoader';
import { StatValueSkeleton } from '@/components/common/statValueSkeleton/StatValueSkeleton';
import { useDashboardNavigation } from '@/hooks/useDashboardNavigation';
import { useCharacters } from '@/hooks/useCharacters';
import { useManuscripts } from '@/hooks/useManuscripts';
import { useChapters } from '@/hooks/useChapters';
import { useNotes } from '@/hooks/useNotes';
import { CardMenu } from '@/components/common/cardMenu/CardMenu';

const RECENT_ITEMS_COUNT = 3

export const Dashboard: React.FC = () => {
  const { manuscripts, isLoading: loadingManuscripts } = useManuscripts()
  const { characters, isLoading: loadingCharacters } = useCharacters()
  const { chapters, isLoading: loadingChapters } = useChapters()
  const { notes, isLoading: loadingNotes } = useNotes()

  const {
    handleViewAllManuscripts,
    handleViewAllCharacters,
    handleViewAllChapters,
    handleViewAllNotes,
    handleCreateManuscript,
    handleCreateCharacter,
    handleCreateNote,
    handleCreateChapter,
    handleEditChapter,
    handleViewManuscript,
    handleViewCharacter,
    handleViewChapter,
    handleViewNote,
  } = useDashboardNavigation()

  const stats = useDashboardStats(manuscripts, characters, chapters, notes)

  return (
    <>
      <div className="p-6 bg-slate-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">Resume of your writing activity</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={handleCreateManuscript}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Manuscript
            </button>
            <button
              onClick={handleCreateCharacter}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Character
            </button>
            <button
              onClick={handleCreateChapter}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Chapter
            </button>
            <button
              onClick={handleCreateNote}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.title} className={`${stat.bgColor} rounded-xl p-6 border border-slate-700`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {loadingManuscripts || loadingCharacters || loadingChapters || loadingNotes ? (
                          <StatValueSkeleton />
                        ) : (
                          stat.formatValue ? stat.formatValue(stat.value) : stat.value.toLocaleString()
                        )}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-linear-to-r ${stat.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Recent Manuscripts */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-bold text-lg">Recent Manuscripts</h2>
                <button
                  onClick={handleViewAllManuscripts}
                  className="text-xs text-purple-500 hover:text-white transition-colors flex items-center gap-1"
                  aria-label="View all manuscripts"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {loadingManuscripts ? (
                <SkeletonLoader count={RECENT_ITEMS_COUNT} />
              ) : manuscripts && manuscripts.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {manuscripts.slice(0, RECENT_ITEMS_COUNT).map((manuscript) => {
                    const progress = calculateProgress(manuscript.word_count ?? 0);
                    const gradientClasses = getStatusGradientClasses(manuscript.status);
                    return (
                      <div
                        key={manuscript.id_manuscript}
                        className="group relative flex bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 cursor-pointer min-h-[140px] shadow-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900"
                        onClick={() => handleViewManuscript(manuscript.id_manuscript)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleViewManuscript(manuscript.id_manuscript);
                          }
                        }}
                        aria-label={`View manuscript: ${manuscript.title}`}
                      >
                        {/* Gradient Sidebar */}
                        <div className={`w-24 min-h-full bg-linear-to-br ${gradientClasses} flex items-center justify-center shrink-0`}>
                          <BookOpen className="w-8 h-8 text-white opacity-50" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 flex flex-col justify-between relative min-w-0 gap-2">
                          <div className="pr-8 min-w-0 flex-1 flex flex-col gap-1.5">
                            <div>
                              <StatusBadge status={manuscript.status} size="sm" />
                            </div>
                            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                              {manuscript.title}
                            </h3>
                            {manuscript.genre && (
                              <p className="text-slate-400 text-xs mt-0.5">{manuscript.genre}</p>
                            )}
                          </div>

                          <div className="w-full mt-auto">
                            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                              <span>{formatWordCountNumber(manuscript.word_count ?? 0)} words</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <ProgressBar
                              progress={progress}
                              status={manuscript.status}
                              showLabel={false}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No manuscripts yet</p>
                  <button
                    onClick={handleCreateManuscript}
                    className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                  >
                    Create your first manuscript
                  </button>
                </div>
              )}
            </div>

            {/* Main Characters */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-bold text-lg">Main Characters</h2>
                <button
                  onClick={handleViewAllCharacters}
                  className="text-xs text-purple-500 hover:text-white transition-colors flex items-center gap-1"
                  aria-label="View all characters"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {loadingCharacters ? (
                <SkeletonLoader count={RECENT_ITEMS_COUNT} />
              ) : characters && characters.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {characters.slice(0, RECENT_ITEMS_COUNT).map((character) => {
                    const initials = getInitials(character.name);
                    return (
                      <div
                        key={character.id_character}
                        className="group flex items-center justify-between bg-slate-800 border border-slate-700 p-4 rounded-xl hover:border-emerald-500 transition-all cursor-pointer"
                        onClick={() => handleViewCharacter(character.id_character)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleViewCharacter(character.id_character);
                          }
                        }}
                        aria-label={`View character: ${character.name}`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-base font-bold text-white border-2 border-slate-800 shadow-sm">
                            {character.picture ? (
                              <img
                                src={character.picture}
                                alt={character.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span>{initials}</span>
                            )}
                          </div>

                          {/* Content */}
                          <div>
                            <h4 className="text-white font-semibold text-base">{character.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              {character.role && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                                  {character.role}
                                </span>
                              )}
                              {manuscripts.find((m) => m.id_manuscript === character.id_manuscript)?.title ? (
                                <span className="text-slate-500 text-xs">• {manuscripts.find((m) => m.id_manuscript === character.id_manuscript)?.title}</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No characters yet</p>
                  <button
                    onClick={handleCreateCharacter}
                    className="mt-3 text-sm text-green-400 hover:text-green-300"
                  >
                    Create your first character
                  </button>
                </div>
              )}
            </div>

            {/* Recent Chapters */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-bold text-lg">Recent Chapters</h2>
                <button
                  onClick={handleViewAllChapters}
                  className="text-xs text-purple-500 hover:text-white transition-colors flex items-center gap-1"
                  aria-label="View all chapters"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {loadingChapters ? (
                <SkeletonLoader count={RECENT_ITEMS_COUNT} />
              ) : chapters && chapters.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {chapters.slice(0, RECENT_ITEMS_COUNT).map((chapter) => {
                    const chapterLabel = chapter.chapter_number != null
                      ? `Chapter ${chapter.chapter_number}`
                      : 'Chapter';
                    const relatedManuscript = chapter.id_manuscript
                      ? manuscripts?.find((m) => m.id_manuscript === chapter.id_manuscript)
                      : null;
                    return (
                      <div
                        key={chapter.id_chapter}
                        className="group relative flex items-center justify-between bg-slate-800 border border-slate-700 p-4 rounded-xl hover:border-purple-500 transition-all"
                      >
                        <div
                          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleViewChapter(chapter.id_chapter)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleViewChapter(chapter.id_chapter);
                            }
                          }}
                          aria-label={`View chapter: ${chapter.name_chapter}`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                            <ScrollText className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm truncate">{chapter.name_chapter}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-slate-400 text-xs">{chapterLabel}</p>
                              {relatedManuscript && (
                                <>
                                  <span className="text-slate-600 text-xs">•</span>
                                  <p className="text-slate-400 text-xs truncate">{relatedManuscript.title}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                          <CardMenu
                            onView={() => handleViewChapter(chapter.id_chapter)}
                            onEdit={() => handleEditChapter(chapter.id_chapter)}
                            itemType="chapter"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ScrollText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No chapters yet</p>
                  <button
                    onClick={handleCreateChapter}
                    className="mt-3 text-sm text-purple-400 hover:text-purple-300"
                  >
                    Create your first chapter
                  </button>
                </div>
              )}
            </div>

            {/* Recent Notes */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-bold text-lg">Recent Notes</h2>
                <button
                  onClick={handleViewAllNotes}
                  className="text-xs text-purple-500 hover:text-white transition-colors flex items-center gap-1"
                  aria-label="View all notes"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {loadingNotes ? (
                <SkeletonLoader count={RECENT_ITEMS_COUNT} />
              ) : notes && notes.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {notes.slice(0, RECENT_ITEMS_COUNT).map((note) => (
                    <div
                      key={note.id_note}
                      className="group flex items-center justify-between bg-slate-800 border border-slate-700 p-4 rounded-xl hover:border-cyan-500 transition-all cursor-pointer"
                      onClick={() => handleViewNote(note.id_note)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleViewNote(note.id_note);
                        }
                      }}
                      aria-label={`View note: ${note.title}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-sm truncate">{note.title}</h4>
                          {note.date_created && (
                            <p className="text-slate-400 text-xs mt-0.5">{formatDate(note.date_created)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No notes yet</p>
                  <button
                    onClick={handleCreateNote}
                    className="mt-3 text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    Create your first note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  )
}