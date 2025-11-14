import React from 'react'
import { BookOpen, Users, FileText, StickyNote, Plus } from 'lucide-react'
import { useManuscripts } from '../hooks/useManuscripts';
import { useCharacters } from '../hooks/useCharacters';
import { ManuscriptsList } from '../components/manuscripts/ManuscriptsList';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { manuscripts, isLoading: loadingManuscripts } = useManuscripts()
  const { characters, isLoading: loadingCharacters } = useCharacters()
  const handleCreateManuscript = () => {
    navigate('/manuscripts/new')
  }

  const stats = [
    {
      title: 'Manuscripts',
      value: manuscripts?.length || 0,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Characters',
      value: 0,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Chapters',
      value: 0,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Total Words',
      value: manuscripts?.reduce((acc, m) => acc + (m.word_count || 0), 0) || 0,
      icon: StickyNote,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10'
    }
  ]

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Resume of your writing activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-slate-700`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {loadingManuscripts || loadingCharacters ? '...' : stat.value.toLocaleString()}
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
        {/* Sección de Manuscritos */}
        <div className="mb-8">
          <ManuscriptsList onCreateNewManuscript={handleCreateManuscript} />
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personajes Recientes */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Personajes Principales</h3>
              <button className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                New Character
              </button>
            </div>

            {loadingCharacters ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : characters && characters.length > 0 ? (
              <div className="space-y-4">
                {characters.slice(0, 3).map((character) => (
                  <div key={character.id_character} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{character.name}</h4>
                      {character.role && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                          {character.role}
                        </span>
                      )}
                    </div>
                    {character.biography && (
                      <p className="text-slate-400 text-sm line-clamp-2">{character.biography}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">No characters yet</p>
              </div>
            )}
          </div>

          {/* Notas Recientes */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Notes</h3>
              <button className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </button>
            </div>

            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No notes yet</p>
              <p className="text-slate-600 text-sm mt-1">Create your first note to get started</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}