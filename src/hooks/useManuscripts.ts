import { useState, useEffect, useCallback } from 'react'
import { deleteManuscript, getAllManuscripts, getManuscriptById, type ManuscriptRow } from '../lib/respository/manuscriptRepository'


export const useManuscripts = () => {
  const [manuscripts, setManuscripts] = useState<ManuscriptRow[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getManuscripts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getAllManuscripts()
    if (error) {
      setError(error.message || 'Error loading manuscripts')
      setManuscripts([])
    } else {
      setManuscripts(data || []);
    }
    setIsLoading(false);
  }, []);

  const remove = useCallback(async (id: number) => {
    const { error } = await deleteManuscript(id)
    if (error) throw error;
    await getManuscripts();
  }, [getManuscripts])

  const fetchManuscriptById = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getManuscriptById(id)
    if (error) {
      setError(error.message || 'Error loading manuscript')
      setManuscripts([])
    } else {
      setManuscripts(data || [])
    }
    setIsLoading(false)
    return data ?? null
  }, [])

  useEffect(() => {
    void getManuscripts();
  }, [getManuscripts])

  return { manuscripts, isLoading, error, getManuscripts, remove, fetchManuscriptById }
}