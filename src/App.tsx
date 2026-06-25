import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './components/Header'
import { MedicineCabinet } from './components/MedicineCabinet'
import { MedicineModal } from './components/MedicineModal'
import { SymptomGuide } from './components/SymptomGuide'
import { ExpireTracker } from './components/ExpireTracker'
import { EvaluationModal } from './components/EvaluationModal'
import { useSearch } from './hooks/useSearch'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Medicine } from './types/medicine'
import medicinesData from './data/medicines.json'

type ActiveView = 'cabinet' | 'symptom_guide' | 'expire'

const allMedicines: Medicine[] = medicinesData.medicines as Medicine[]

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('cabinet')
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false)

  const { entries, addEntry, removeEntry, refreshDaysLeft } = useLocalStorage()
  const highlightedIds = useSearch(allMedicines, searchQuery)

  const ownedIds = Array.from(new Set(entries.map((e) => e.medicineId)))
  const isOwned = (id: string) => ownedIds.includes(id)

  const getShelfLifeYears = (shelfLife: string): number => {
    const match = shelfLife.match(/(\d+)\s*ปี/)
    return match ? parseInt(match[1]) : 3
  }

  const toggleMedicine = (id: string) => {
    if (isOwned(id)) {
      const targets = entries.filter((e) => e.medicineId === id)
      targets.forEach((t) => removeEntry(t.id))
    } else {
      const med = allMedicines.find((m) => m.id === id)
      if (med) {
        const years = getShelfLifeYears(med.shelfLife)
        const purchaseDate = new Date().toISOString().split('T')[0]
        const d = new Date(purchaseDate)
        d.setFullYear(d.getFullYear() + years)
        const expiryDate = d.toISOString().split('T')[0]
        addEntry({
          medicineId: id,
          medicineName: med.name,
          purchaseDate,
          expiryDate,
        })
      }
    }
  }

  const handleSelectMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
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
        onOpenEvaluation={() => setIsEvaluationOpen(true)}
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
                highlightedIds={highlightedIds}
                ownedIds={ownedIds}
                onToggleCabinet={toggleMedicine}
                entries={entries}
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
              <ExpireTracker
                medicines={allMedicines}
                entries={entries}
                addEntry={addEntry}
                removeEntry={removeEntry}
                refreshDaysLeft={refreshDaysLeft}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Medicine detail modal */}
      <MedicineModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        isOwned={selectedMedicine ? isOwned(selectedMedicine.id) : false}
        onToggleCabinet={toggleMedicine}
        entries={entries}
        onAddEntry={addEntry}
        onRemoveEntry={removeEntry}
      />

      {/* Evaluation form modal */}
      <EvaluationModal
        isOpen={isEvaluationOpen}
        onClose={() => setIsEvaluationOpen(false)}
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
        <p>ข้อมูลอ้างอิงจากประกาศกระทรวงสาธารณสุข เรื่อง ยาสามัญประจำบ้านแผนปัจจุบัน พ.ศ. 2568</p>
        <p className="mt-0.5">เพื่อการศึกษาเท่านั้น — ไม่ใช่คำแนะนำทางการแพทย์</p>
      </footer>
    </div>
  )
}
