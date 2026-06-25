import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Clock, Thermometer, Shield, Check, Home } from 'lucide-react'
import { Medicine } from '../types/medicine'

interface MedicineModalProps {
  medicine: Medicine | null
  onClose: () => void
  isInChecker: boolean
  onAddToChecker: (medicine: Medicine) => void
  isOwned: boolean
  onToggleCabinet: (id: string) => void
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

export function MedicineModal({ medicine, onClose, isInChecker, onAddToChecker, isOwned, onToggleCabinet }: MedicineModalProps) {
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

                  {/* Checker button (secondary) */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddToChecker(medicine)}
                    className="w-full py-2.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: isInChecker ? '#EDE9FE' : '#F5F3FF',
                      color: '#7C3AED',
                      border: '1.5px solid #C4B5FD',
                      fontFamily: 'Sarabun, sans-serif',
                    }}
                  >
                    {isInChecker ? (
                      <><Shield size={14} />อยู่ใน Safety Checker แล้ว — กดเพื่อนำออก</>
                    ) : (
                      <><Plus size={14} />เพิ่มเข้า Safety Checker</>
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
