import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './components/Header'
import { MedicineCabinet } from './components/MedicineCabinet'
import { MedicineModal } from './components/MedicineModal'
import { SafetyChecker } from './components/SafetyChecker'
import { SymptomGuide } from './components/SymptomGuide'
import { ExpireTracker } from './components/ExpireTracker'
import { useSearch } from './hooks/useSearch'
import { usePersonalCabinet } from './hooks/usePersonalCabinet'
import { Medicine } from './types/medicine'
import medicinesData from './data/medicines.json'

type ActiveView = 'cabinet' | 'checker' | 'symptom_guide' | 'expire'

const allMedicines: Medicine[] = medicinesData.medicines as Medicine[]

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('cabinet')
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [checkerList, setCheckerList] = useState<Medicine[]>([])

  const { ownedIds, toggleMedicine, isOwned } = usePersonalCabinet()
  const highlightedIds = useSearch(allMedicines, searchQuery)

  const handleSelectMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
  }

  const handleAddToChecker = (medicine: Medicine) => {
    setCheckerList((prev) => {
      const already = prev.find((m) => m.id === medicine.id)
      if (already) return prev.filter((m) => m.id !== medicine.id)
      if (prev.length >= 3) return prev
      return [...prev, medicine]
    })
  }

  const handleRemoveFromChecker = (id: string) => {
    setCheckerList((prev) => prev.filter((m) => m.id !== id))
  }

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view)
    if (view !== 'cabinet') setSelectedMedicine(null)
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FDF8F0 0%, #F5ECD7 100%)' }}>
      <Header
        activeView={activeView}
        onViewChange={handleViewChange}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q)
          if (q && activeView !== 'cabinet') setActiveView('cabinet')
        }}
      />

      <main>
        <AnimatePresence mode="wait">
          {activeView === 'cabinet' && (
            <motion.div
              key="cabinet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MedicineCabinet
                medicines={allMedicines}
                onSelect={handleSelectMedicine}
                checkerList={checkerList}
                onAddToChecker={handleAddToChecker}
                highlightedIds={highlightedIds}
                ownedIds={ownedIds}
                onToggleCabinet={toggleMedicine}
              />
            </motion.div>
          )}

          {activeView === 'checker' && (
            <motion.div
              key="checker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SafetyChecker
                medicines={allMedicines}
                checkerList={checkerList}
                onRemoveFromChecker={handleRemoveFromChecker}
                onClear={() => setCheckerList([])}
                onAddFromLibrary={handleAddToChecker}
              />
            </motion.div>
          )}

          {activeView === 'symptom_guide' && (
            <motion.div
              key="symptom_guide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SymptomGuide />
            </motion.div>
          )}

          {activeView === 'expire' && (
            <motion.div
              key="expire"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ExpireTracker medicines={allMedicines} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Medicine detail modal */}
      <MedicineModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        isInChecker={checkerList.some((m) => m.id === selectedMedicine?.id)}
        onAddToChecker={handleAddToChecker}
        isOwned={selectedMedicine ? isOwned(selectedMedicine.id) : false}
        onToggleCabinet={toggleMedicine}
      />

      {/* Footer */}
      <footer
        className="text-center py-4 text-xs mt-8"
        style={{
          color: '#9CA3AF',
          borderTop: '1px solid #E5D9C9',
          fontFamily: 'Sarabun, sans-serif',
        }}
      >
        <p>ข้อมูลอ้างอิงจากประกาศกระทรวงสาธารณสุข เรื่อง ยาสามัญประจำบ้านแผนปัจจุบัน พ.ศ. 2542</p>
        <p className="mt-0.5">เพื่อการศึกษาเท่านั้น — ไม่ใช่คำแนะนำทางการแพทย์</p>
      </footer>
    </div>
  )
}
