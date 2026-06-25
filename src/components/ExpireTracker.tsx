import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ClipboardList, RefreshCw } from 'lucide-react'
import { Medicine, ExpireEntry } from '../types/medicine'

interface ExpireTrackerProps {
  medicines: Medicine[]
  entries: ExpireEntry[]
  addEntry: (entry: Omit<ExpireEntry, 'id' | 'daysLeft'>) => void
  removeEntry: (id: string) => void
  refreshDaysLeft: () => void
}

function getShelfLifeYears(shelfLife: string): number {
  const match = shelfLife.match(/(\d+)\s*ปี/)
  return match ? parseInt(match[1]) : 3
}

function getDaysLeftColor(days: number) {
  if (days < 0) return { bg: '#FEF2F2', border: '#FCA5A5', text: '#DC2626', label: 'หมดอายุแล้ว', dot: '#DC2626' }
  if (days < 30) return { bg: '#FEF2F2', border: '#FCA5A5', text: '#DC2626', label: `เหลือ ${days} วัน`, dot: '#DC2626' }
  if (days < 90) return { bg: '#FFFBEB', border: '#FCD34D', text: '#D97706', label: `เหลือ ${days} วัน`, dot: '#D97706' }
  return { bg: '#F0FDF4', border: '#86EFAC', text: '#16A34A', label: `เหลือ ${days} วัน`, dot: '#16A34A' }
}

export function ExpireTracker({
  medicines,
  entries,
  addEntry,
  removeEntry,
  refreshDaysLeft,
}: ExpireTrackerProps) {
  const [selectedId, setSelectedId] = useState('')
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0])
  const [customExpiry, setCustomExpiry] = useState('')
  const [error, setError] = useState('')

  const selectedMed = medicines.find((m) => m.id === selectedId)
  const autoExpiry = selectedMed
    ? (() => {
        const years = getShelfLifeYears(selectedMed.shelfLife)
        const d = new Date(purchaseDate)
        d.setFullYear(d.getFullYear() + years)
        return d.toISOString().split('T')[0]
      })()
    : ''

  const handleAdd = () => {
    if (!selectedId) { setError('กรุณาเลือกชื่อยา'); return }
    if (!purchaseDate) { setError('กรุณาระบุวันที่ซื้อ'); return }
    const expiryDate = customExpiry || autoExpiry
    if (!expiryDate) { setError('ไม่สามารถคำนวณวันหมดอายุได้'); return }
    setError('')
    addEntry({
      medicineId: selectedId,
      medicineName: selectedMed!.name,
      purchaseDate,
      expiryDate,
    })
    setSelectedId('')
    setCustomExpiry('')
    setPurchaseDate(new Date().toISOString().split('T')[0])
  }

  const sorted = [...entries].sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-6"
      style={{ fontFamily: 'Sarabun, sans-serif' }}
    >
      {/* Title */}
      <div className="text-center mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: 'linear-gradient(135deg, #0EA5E920, #0EA5E940)', border: '2px solid #0EA5E960' }}
        >
          <ClipboardList size={28} style={{ color: '#0EA5E9' }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: '#2C1810', fontFamily: 'Kanit, sans-serif' }}>
          ติดตามวันหมดอายุยา
        </h2>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          บันทึกวันซื้อ แอปจะคำนวณและแจ้งเตือนให้อัตโนมัติ
        </p>
      </div>

      {/* Add form */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{
          background: 'white',
          border: '2px solid #E5D9C9',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}
      >
        <h3 className="font-semibold mb-3 text-sm" style={{ color: '#4A2C17' }}>
          ➕ เพิ่มยาในตู้
        </h3>

        <div className="flex flex-col gap-3">
          {/* Medicine select */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>
              ชื่อยา
            </label>
            <select
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setCustomExpiry('') }}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                border: '1px solid #E5D9C9',
                background: '#FFFBF5',
                color: '#2C1810',
                fontFamily: 'Sarabun, sans-serif',
              }}
            >
              <option value="">-- เลือกยา --</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Purchase date */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>
                วันที่ซื้อ
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => { setPurchaseDate(e.target.value); setCustomExpiry('') }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: '1px solid #E5D9C9', background: '#FFFBF5', color: '#2C1810', fontFamily: 'Sarabun, sans-serif' }}
              />
            </div>

            {/* Expiry date (auto or custom) */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>
                วันหมดอายุ {autoExpiry && !customExpiry && <span style={{ color: '#16A34A' }}>(คำนวณอัตโนมัติ)</span>}
              </label>
              <input
                type="date"
                value={customExpiry || autoExpiry}
                onChange={(e) => setCustomExpiry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: '1px solid #E5D9C9', background: customExpiry ? '#FFFBF5' : '#F0FDF4', color: '#2C1810', fontFamily: 'Sarabun, sans-serif' }}
              />
            </div>
          </div>

          {/* Shelf life info */}
          {selectedMed && (
            <div
              className="text-xs px-3 py-2 rounded-xl"
              style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}
            >
              📋 อายุยาตามมาตรฐาน: <strong>{selectedMed.shelfLife}</strong>
            </div>
          )}

          {error && (
            <p className="text-xs" style={{ color: '#DC2626' }}>⚠️ {error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #C8A265, #B8923A)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(200,162,101,0.4)',
              fontFamily: 'Kanit, sans-serif',
            }}
          >
            <Plus size={16} />
            บันทึกยา
          </motion.button>
        </div>
      </div>

      {/* Entries list */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm" style={{ color: '#4A2C17' }}>
          ยาในตู้ของคุณ ({entries.length} รายการ)
        </h3>
        {entries.length > 0 && (
          <button
            onClick={refreshDaysLeft}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
            style={{ color: '#0EA5E9', background: '#F0F9FF' }}
          >
            <RefreshCw size={11} />
            อัปเดต
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: 'white', border: '2px dashed #E5D9C9' }}
        >
          <div className="text-4xl mb-2">📦</div>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>ยังไม่มียาในตู้ เพิ่มยาจากฟอร์มด้านบน</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {sorted.map((entry) => {
              const color = getDaysLeftColor(entry.daysLeft)
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{
                    background: color.bg,
                    border: `2px solid ${color.border}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Status dot */}
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: color.dot }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: '#2C1810' }}>
                      {entry.medicineName}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                      ซื้อ: {new Date(entry.purchaseDate).toLocaleDateString('th-TH')} →
                      หมดอายุ: {new Date(entry.expiryDate).toLocaleDateString('th-TH')}
                    </div>
                  </div>

                  {/* Days left badge */}
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0"
                    style={{ background: 'white', color: color.text, border: `1px solid ${color.border}` }}
                  >
                    {color.label}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: 'rgba(220,38,38,0.1)', color: '#DC2626' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Legend */}
      <div
        className="mt-5 rounded-xl px-4 py-3 flex flex-wrap gap-4 text-xs"
        style={{ background: 'white', border: '1px solid #E5D9C9' }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#16A34A' }} />
          <span style={{ color: '#16A34A' }}>มากกว่า 90 วัน</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#D97706' }} />
          <span style={{ color: '#D97706' }}>30–90 วัน</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#DC2626' }} />
          <span style={{ color: '#DC2626' }}>น้อยกว่า 30 วัน / หมดอายุ</span>
        </span>
      </div>
    </motion.div>
  )
}
