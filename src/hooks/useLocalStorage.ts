import { useState, useEffect } from 'react'
import { ExpireEntry } from '../types/medicine'

const STORAGE_KEY = 'medicine_cabinet_expiry'

export function useLocalStorage() {
  const [entries, setEntries] = useState<ExpireEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const addEntry = (entry: Omit<ExpireEntry, 'id' | 'daysLeft'>) => {
    const today = new Date()
    const expiry = new Date(entry.expiryDate)
    const daysLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const newEntry: ExpireEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      daysLeft,
    }
    setEntries((prev) => [...prev, newEntry])
  }

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const refreshDaysLeft = () => {
    const today = new Date()
    setEntries((prev) =>
      prev.map((e) => ({
        ...e,
        daysLeft: Math.floor(
          (new Date(e.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        ),
      }))
    )
  }

  return { entries, addEntry, removeEntry, refreshDaysLeft }
}
