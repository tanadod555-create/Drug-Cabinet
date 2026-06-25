import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Thermometer, Check, Home, Plus, Trash2 } from 'lucide-react'
import { Medicine, ExpireEntry } from '../types/medicine'

interface MedicineModalProps {
  medicine: Medicine | null
  onClose: () => void
  isOwned: boolean
  onToggleCabinet: (id: string) => void
  entries: ExpireEntry[]
  onAddEntry: (entry: Omit<ExpireEntry, 'id' | 'daysLeft'>) => void
  onRemoveEntry: (id: string) => void
}

// Emojis are directly defined in medicines.json

const SUBCATEGORY_LABELS: Record<string, string> = {
  stomach: 'ระบบทางเดินอาหาร',
  pain_fever: 'ลดไข้/แก้ปวด',
  allergy: 'แก้แพ้/ไอ',
  dizziness: 'แก้วิงเวียน',
  motion_sickness: 'แก้เมารถ',
  wound: 'รักษาแผล',
  skin: 'ผิวหนัง',
  external_pain: 'ปวดภายนอก',
}

export function MedicineModal({
  medicine,
  onClose,
  isOwned,
  onToggleCabinet,
  entries,
  onAddEntry,
  onRemoveEntry,
}: MedicineModalProps) {
  const [purchaseDate, setPurchaseDate] = React.useState(new Date().toISOString().split('T')[0])
  const [customExpiry, setCustomExpiry] = React.useState('')

  React.useEffect(() => {
    if (medicine) {
      setPurchaseDate(new Date().toISOString().split('T')[0])
      setCustomExpiry('')
    }
  }, [medicine])

  const getShelfLifeYears = (shelfLife: string): number => {
    const match = shelfLife.match(/(\d+)\s*ปี/)
    return match ? parseInt(match[1]) : 3
  }

  const handleAddBatch = () => {
    if (!medicine) return
    const years = getShelfLifeYears(medicine.shelfLife)
    const d = new Date(purchaseDate)
    d.setFullYear(d.getFullYear() + years)
    const expiryDate = customExpiry || d.toISOString().split('T')[0]
    
    onAddEntry({
      medicineId: medicine.id,
      medicineName: medicine.name,
      purchaseDate,
      expiryDate,
    })
    setCustomExpiry('')
  }

  const medEntries = medicine ? entries.filter((e) => e.medicineId === medicine.id) : []
  return (
    <AnimatePresence>
      {medicine && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 60 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
              style={{
                background: 'linear-gradient(180deg, #FFFBF5 0%, #F5ECD7 100%)',
                border: `2px solid ${medicine.color}60`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${medicine.color}30`,
              }}
            >
              {/* Header */}
              <div
                className="sticky top-0 px-5 pt-5 pb-4 rounded-t-3xl z-10"
                style={{
                  background: '#FFFBF5',
                  borderBottom: `2px solid ${medicine.color}40`,
                  boxShadow: '0 4px 16px rgba(44,24,16,0.08)',
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon bubble */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'white',
                      border: `2px solid ${medicine.color}40`,
                    }}
                  >
                    <div className="text-4xl">{medicine.icon || '💊'}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-xl font-bold leading-tight"
                      style={{ color: '#2C1810', fontFamily: 'Kanit, sans-serif' }}
                    >
                      {medicine.name}
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
                      {medicine.genericName}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge-official">✓ ยาสามัญประจำบ้าน</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `${medicine.color}20`,
                          color: medicine.color,
                          border: `1px solid ${medicine.color}40`,
                          fontFamily: 'Sarabun, sans-serif',
                        }}
                      >
                        {SUBCATEGORY_LABELS[medicine.subcategory] ?? medicine.subcategory}
                      </span>
                      {medicine.isEmergencyKit && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', fontFamily: 'Sarabun, sans-serif' }}
                        >
                          🚨 ยาฉุกเฉิน
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: 'rgba(44,24,16,0.1)', color: '#6B7280' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 pb-5 pt-4 flex flex-col gap-4" style={{ fontFamily: 'Sarabun, sans-serif' }}>

                {/* Indications */}
                <Section icon="📋" title="สรรพคุณ" color={medicine.color}>
                  <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                    {medicine.indications}
                  </p>
                </Section>

                {/* Dosage */}
                <Section icon="💊" title="วิธีใช้และขนาดยา" color={medicine.color}>
                  <div className="flex flex-col gap-2">
                    <DosageRow label="ผู้ใหญ่" value={medicine.dosage.adult} />
                    <DosageRow label="เด็ก" value={medicine.dosage.child} />
                    <DosageRow label="สูงสุด/วัน" value={medicine.dosage.maxPerDay} highlight />
                  </div>
                </Section>

                {/* Warnings */}
                <Section icon="⚠️" title="ข้อควรระวัง" color="#D97706" bg="#FFFBEB">
                  <ul className="flex flex-col gap-1.5">
                    {medicine.warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#92400E' }}>
                        <span className="mt-1 flex-shrink-0">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                {/* Contraindications */}
                <Section icon="🚫" title="ห้ามใช้ใน" color="#DC2626" bg="#FEF2F2">
                  <p className="text-sm" style={{ color: '#991B1B' }}>{medicine.contraindications}</p>
                </Section>

                {/* Storage & Shelf Life */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-xl p-3"
                    style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Clock size={12} style={{ color: '#16A34A' }} />
                      <span className="text-xs font-semibold" style={{ color: '#16A34A' }}>อายุยา</span>
                    </div>
                    <p className="text-xs" style={{ color: '#166534' }}>{medicine.shelfLife}</p>
                  </div>
                  <div
                    className="rounded-xl p-3"
                    style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Thermometer size={12} style={{ color: '#2563EB' }} />
                      <span className="text-xs font-semibold" style={{ color: '#2563EB' }}>การเก็บรักษา</span>
                    </div>
                    <p className="text-xs" style={{ color: '#1E40AF' }}>{medicine.storage}</p>
                  </div>
                </div>

                {/* Label check */}
                <Section icon="🔍" title="สังเกตฉลากก่อนซื้อ" color="#7C3AED" bg="#F5F3FF">
                  <p className="text-sm" style={{ color: '#4C1D95' }}>{medicine.labelCheck}</p>
                </Section>

                {/* Expiration and batch management */}
                {isOwned && (
                  <Section icon="📌" title="จัดการรุ่นยาในตู้ของคุณ" color="#B8923A" bg="#FFFDF9">
                    <div className="flex flex-col gap-3">
                      {medEntries.length === 0 ? (
                        <p className="text-xs text-gray-500">ไม่พบล็อตยาที่เปิดใช้งานอยู่ในตู้</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {medEntries.map((entry) => {
                            const daysLeft = entry.daysLeft
                            let statusLabel = `เหลือ ${daysLeft} วัน`
                            let statusColor = '#16A34A'
                            if (daysLeft < 0) {
                              statusLabel = 'หมดอายุแล้ว'
                              statusColor = '#DC2626'
                            } else if (daysLeft < 30) {
                              statusLabel = `เหลือ ${daysLeft} วัน`
                              statusColor = '#DC2626'
                            } else if (daysLeft < 90) {
                              statusLabel = `เหลือ ${daysLeft} วัน`
                              statusColor = '#D97706'
                            }
                            return (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between p-2 rounded-xl text-xs"
                                style={{ background: 'white', border: '1px solid #E5D9C9' }}
                              >
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className="font-semibold text-gray-700">
                                    ซื้อ: {new Date(entry.purchaseDate).toLocaleDateString('th-TH')}
                                  </div>
                                  <div className="text-gray-500 mt-0.5">
                                    หมดอายุ: {new Date(entry.expiryDate).toLocaleDateString('th-TH')}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span
                                    className="px-2 py-0.5 rounded-full font-semibold text-[10px]"
                                    style={{ background: statusColor + '15', color: statusColor }}
                                  >
                                    {statusLabel}
                                  </span>
                                  
                                  <button
                                    onClick={() => onRemoveEntry(entry.id)}
                                    className="w-6 h-6 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors"
                                    style={{ border: '1px solid rgba(220,38,38,0.2)' }}
                                    title="ลบล็อตนี้"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                      
                      {/* Inline form to add batch */}
                      <div
                        className="p-3 rounded-xl flex flex-col gap-2.5"
                        style={{ background: '#F5ECD740', border: '1px dashed #C8A26560' }}
                      >
                        <div className="text-[11px] font-bold text-amber-900">➕ เพิ่มล็อตยา/วันหมดอายุอื่น</div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">วันที่ซื้อ</label>
                            <input
                              type="date"
                              value={purchaseDate}
                              onChange={(e) => setPurchaseDate(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg text-xs outline-none bg-white border border-amber-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">วันหมดอายุ</label>
                            <input
                              type="date"
                              value={customExpiry || (() => {
                                if (!medicine) return ''
                                const years = getShelfLifeYears(medicine.shelfLife)
                                const d = new Date(purchaseDate)
                                d.setFullYear(d.getFullYear() + years)
                                return d.toISOString().split('T')[0]
                              })()}
                              onChange={(e) => setCustomExpiry(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg text-xs outline-none bg-white border border-amber-200"
                            />
                          </div>
                        </div>
                        
                        <button
                          onClick={handleAddBatch}
                          className="py-1 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 bg-amber-700 text-white hover:bg-amber-800 transition-colors"
                          style={{ border: 'none', cursor: 'pointer', fontFamily: 'Kanit, sans-serif' }}
                        >
                          <Plus size={12} />
                          บันทึกล็อตการซื้อนี้
                        </button>
                      </div>
                    </div>
                  </Section>
                )}

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                  {/* Cabinet button (primary) */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onToggleCabinet(medicine.id)}
                    className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: isOwned
                        ? 'linear-gradient(135deg, #16A34A, #15803D)'
                        : 'linear-gradient(135deg, #C8A265, #B8923A)',
                      color: 'white',
                      boxShadow: isOwned
                        ? '0 4px 15px rgba(22,163,74,0.4)'
                        : '0 4px 15px rgba(200,162,101,0.4)',
                      fontFamily: 'Kanit, sans-serif',
                    }}
                  >
                    {isOwned ? (
                      <><Check size={16} />มีในตู้ยาของฉันแล้ว — กดเพื่อนำออก</>
                    ) : (
                      <><Home size={16} />เพิ่มเข้าตู้ยาของฉัน</>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Section({
  icon,
  title,
  color,
  bg,
  children,
}: {
  icon: string
  title: string
  color: string
  bg?: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: bg ?? '#F9FAFB',
        border: `1px solid ${color}20`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <span className="text-sm font-semibold" style={{ color }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

function DosageRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex gap-2 text-sm">
      <span
        className="flex-shrink-0 font-medium"
        style={{ color: '#6B7280', minWidth: 60 }}
      >
        {label}:
      </span>
      <span style={{ color: highlight ? '#DC2626' : '#374151', fontWeight: highlight ? 600 : 400 }}>
        {value}
      </span>
    </div>
  )
}
