import { motion } from 'framer-motion'
import { Plus, Check } from 'lucide-react'
import { Medicine } from '../types/medicine'

interface MedicineItemProps {
  medicine: Medicine
  onSelect: (medicine: Medicine) => void
  isInChecker: boolean
  onAddToChecker: (medicine: Medicine) => void
  isHighlighted: boolean
  isDimmed: boolean
}

const MEDICINE_ICONS: Record<string, string> = {
  tablets: '💊',
  bottle: '🧪',
  sachet: '🫙',
  charcoal: '⬛',
  leaf: '🌿',
  worm: '🟡',
  pill: '💊',
  allergen: '🌸',
  syrup: '🍶',
  inhaler: '💨',
  ointment: '🟡',
  motion: '🌀',
  antiseptic: '🟤',
  saline: '💧',
  lotion: '🩷',
}

export function MedicineItem({
  medicine,
  onSelect,
  isInChecker,
  onAddToChecker,
  isHighlighted,
  isDimmed,
}: MedicineItemProps) {
  const icon = MEDICINE_ICONS[medicine.icon] ?? '💊'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        y: 0,
        scale: isHighlighted ? 1.05 : 1,
      }}
      whileHover={{ scale: isDimmed ? 1.0 : 1.08, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative flex-shrink-0 cursor-pointer group"
      style={{ width: 80, height: 90 }}
    >
      {/* Glow ring when highlighted */}
      {isHighlighted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl -z-10"
          style={{
            boxShadow: `0 0 20px ${medicine.color}80`,
            background: `${medicine.color}20`,
          }}
        />
      )}

      {/* Main card */}
      <div
        onClick={() => onSelect(medicine)}
        className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden"
        style={{
          background: isInChecker
            ? `linear-gradient(135deg, ${medicine.color}40, ${medicine.color}20)`
            : `linear-gradient(135deg, white 0%, ${medicine.color}15 100%)`,
          border: isInChecker
            ? `2px solid #8B5CF6`
            : `1px solid ${medicine.color}40`,
          boxShadow: `0 2px 8px ${medicine.color}30`,
        }}
      >
        {/* Emergency star badge */}
        {medicine.isEmergencyKit && (
          <div
            className="absolute top-1 left-1 w-4 h-4 rounded-full flex items-center justify-center text-xs"
            style={{ background: '#DC2626', color: 'white', fontSize: 8 }}
            title="ยาฉุกเฉินที่ควรมีติดบ้าน"
          >
            ★
          </div>
        )}

        {/* Checker checkmark */}
        {isInChecker && (
          <div
            className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: '#8B5CF6' }}
          >
            <Check size={10} color="white" />
          </div>
        )}

        {/* Icon */}
        <div className="text-2xl leading-none">{icon}</div>

        {/* Medicine name */}
        <div
          className="text-center leading-tight px-1"
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: '#2C1810',
            fontFamily: 'Sarabun, sans-serif',
            maxWidth: '100%',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {medicine.name.replace('ยา', '').trim()}
        </div>
      </div>

      {/* Tooltip on hover */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 rounded-xl p-2 text-xs text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
        style={{
          background: 'rgba(44,24,16,0.95)',
          border: `1px solid ${medicine.color}60`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontFamily: 'Sarabun, sans-serif',
        }}
      >
        <div className="font-semibold mb-1">{medicine.name}</div>
        <div style={{ color: medicine.color, fontSize: 10 }}>{medicine.genericName}</div>
      </div>

      {/* Add to checker button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation()
          onAddToChecker(medicine)
        }}
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: isInChecker ? '#8B5CF6' : '#C8A265',
          color: 'white',
          fontSize: 12,
        }}
        title={isInChecker ? 'นำออกจาก Safety Checker' : 'เพิ่มเข้า Safety Checker'}
      >
        {isInChecker ? <Check size={10} /> : <Plus size={10} />}
      </motion.button>
    </motion.div>
  )
}
