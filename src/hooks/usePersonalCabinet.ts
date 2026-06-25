import { useState, useEffect } from 'react'

const KEY = 'my_personal_medicine_cabinet_v1'

export function usePersonalCabinet() {
  const [ownedIds, setOwnedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ownedIds))
  }, [ownedIds])

  const addMedicine = (id: string) => {
    setOwnedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const removeMedicine = (id: string) => {
    setOwnedIds((prev) => prev.filter((x) => x !== id))
  }

  const toggleMedicine = (id: string) => {
    setOwnedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const isOwned = (id: string) => ownedIds.includes(id)

  return { ownedIds, addMedicine, removeMedicine, toggleMedicine, isOwned }
}
