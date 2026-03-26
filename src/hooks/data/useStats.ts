import { useCallback, useState } from 'react'
import type { StatsRow } from '@/lib/repository/statsRepository'
import { getStatsByUserId, recalculateAndUpsertStats } from '@/lib/repository/statsRepository'

export const useStats = () => {
  const [stats, setStats] = useState<StatsRow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const { data, error: err } = await getStatsByUserId()
    if (err) {
      setError(err.message)
      setStats(null)
    } else {
      setStats(data)
    }
    setIsLoading(false)
  }, [])

  const refreshStats = useCallback(async () => {
    const { data, error: err } = await recalculateAndUpsertStats()
    if (err) {
      setError(err.message)
      return
    }
    setStats(data ?? null)
  }, [])

  return { stats, isLoading, error, fetchStats, refreshStats }
}
