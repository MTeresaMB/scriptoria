import { useState, useCallback, useRef } from 'react'

interface Snapshot {
  id: string
  content: string
  timestamp: Date
  wordCount: number
}

interface UseEditorHistoryProps {
  maxSnapshots?: number
}

export const useEditorHistory = ({ maxSnapshots = 10 }: UseEditorHistoryProps = {}) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState<number>(-1)
  const snapshotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const createSnapshot = useCallback((content: string) => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length
    
    const snapshot: Snapshot = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      wordCount,
    }

    setSnapshots((prev) => {
      const newSnapshots = [...prev, snapshot]
      if (newSnapshots.length > maxSnapshots) {
        return newSnapshots.slice(-maxSnapshots)
      }
      return newSnapshots
    })

    setCurrentSnapshotIndex((prev) => {
      const newIndex = prev + 1
      return newIndex >= maxSnapshots ? maxSnapshots - 1 : newIndex
    })
  }, [maxSnapshots])

  const getSnapshot = useCallback((index: number): Snapshot | null => {
    if (index < 0 || index >= snapshots.length) return null
    return snapshots[index]
  }, [snapshots])

  const getLatestSnapshot = useCallback((): Snapshot | null => {
    if (snapshots.length === 0) return null
    return snapshots[snapshots.length - 1]
  }, [snapshots])

  const clearSnapshots = useCallback(() => {
    setSnapshots([])
    setCurrentSnapshotIndex(-1)
  }, [])

  const startAutoSnapshot = useCallback((content: string, intervalMs: number = 300000) => {
    createSnapshot(content)
    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current)
    }

    // Set up new interval
    snapshotIntervalRef.current = setInterval(() => {
      createSnapshot(content)
    }, intervalMs)
  }, [createSnapshot])

  const stopAutoSnapshot = useCallback(() => {
    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current)
      snapshotIntervalRef.current = null
    }
  }, [])

  return {
    snapshots,
    currentSnapshotIndex,
    createSnapshot,
    getSnapshot,
    getLatestSnapshot,
    clearSnapshots,
    startAutoSnapshot,
    stopAutoSnapshot,
  }
}
