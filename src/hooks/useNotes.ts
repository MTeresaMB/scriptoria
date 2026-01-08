import { useState, useEffect, useCallback } from 'react'
import { deleteNote, getAllNotes, getNoteById, getNotesByManuscriptId, type NoteRow } from '../lib/respository/notesRepository'

export const useNotes = () => {
  const [notes, setNotes] = useState<NoteRow[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getNotes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getAllNotes()
    if (error) {
      setError(error.message || 'Error loading notes')
      setNotes([])
    } else {
      setNotes(data || [])
    }
    setIsLoading(false)
  }, [])

  const remove = useCallback(async (id: number) => {
    const { error } = await deleteNote(id)
    if (error) throw error
    await getNotes()
  }, [getNotes])

  const fetchNoteById = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getNoteById(id)
    if (error) {
      setError(error.message || 'Error loading note')
      setNotes([])
    } else {
      setNotes(data ? [data] : [])
    }
    setIsLoading(false)
    return data ?? null
  }, [])

  const fetchNotesByManuscriptId = useCallback(async (id_manuscript: number) => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getNotesByManuscriptId(id_manuscript)
    if (error) {
      setError(error.message || 'Error loading notes')
      setNotes([])
    } else {
      setNotes(data || [])
    }
    setIsLoading(false)
    return data ?? []
  }, [])

  useEffect(() => {
    void getNotes()
  }, [getNotes])

  return { notes, isLoading, error, getNotes, remove, fetchNoteById, fetchNotesByManuscriptId }
}

