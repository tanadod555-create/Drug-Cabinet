import React from 'react'
import { motion } from 'framer-motion'
import { Search, ClipboardList, BookOpen, Phone } from 'lucide-react'

type ActiveView = 'cabinet' | 'symptom_guide' | 'expire'

interface HeaderProps {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onOpenEvaluation: () => void
}

export function Header({ activeView, onViewChange, searchQuery, onSearchChange, onOpenEvaluation }: HeaderProps) {
  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #2C1810 0%, #4A2C17 50%, #3A1F0F 100%)',
        borderBottom: '3px solid #C8A265',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Main row */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange('cabinet')}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #C8A265, #B8923A)' }}
            >
              🏥
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-white text-lg leading-tight" style={{ fontFamily: 'Kanit, sans-serif' }}>
                ตู้ยาดิจิทัล
              </div>
              <div className="text-xs" style={{ color: '#C8A265' }}>
                ยาสามัญประจำบ้าน
              </div>
            </div>
          </motion.button>

          {/* Search bar */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#C8A265' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ค้นหายา หรืออาการ เช่น ปวดหัว, แพ้, ท้องเสีย..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(200,162,101,0.3)',
                color: 'white',
                fontFamily: 'Sarabun, sans-serif',
              }}
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs">
                ✕
              </button>
            )}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-1.5">
            <NavBtn
              icon={<ClipboardList size={14} />}
              label="หมดอายุ"
              active={activeView === 'expire'}
              color="#0EA5E9"
              onClick={() => onViewChange('expire')}
            />
            <NavBtn
              icon={<BookOpen size={14} />}
              label="คู่มือโรค"
              active={activeView === 'symptom_guide'}
              color="#16A34A"
              onClick={() => onViewChange('symptom_guide')}
            />
            <NavBtn
              icon={<span style={{ fontSize: 13, lineHeight: 1 }}>📝</span>}
              label="ประเมินเว็บ"
              active={false}
              color="#C8A265"
              onClick={onOpenEvaluation}
            />

            {/* 1669 always-visible button */}
            <motion.a
              href="tel:1669"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold emergency-btn"
              style={{
                background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                color: 'white',
                border: '1px solid rgba(248,113,113,0.4)',
                textDecoration: 'none',
                fontFamily: 'Kanit, sans-serif',
                flexShrink: 0,
              }}
              title="โทรสายด่วนฉุกเฉิน 1669"
            >
              <Phone size={13} />
              <span className="hidden sm:inline">1669</span>
            </motion.a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs mt-2" style={{ color: 'rgba(200,162,101,0.6)', fontFamily: 'Sarabun, sans-serif' }}>
          ⚕️ ข้อมูลเพื่อการศึกษาเท่านั้น — หากอาการรุนแรงควรพบแพทย์ทันที
        </div>
      </div>
    </header>
  )
}

function NavBtn({
  icon, label, active, color, onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  color: string
  onClick: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all"
      style={{
        background: active ? color : `${color}20`,
        color: active ? 'white' : color,
        border: `1px solid ${color}40`,
        fontFamily: 'Sarabun, sans-serif',
      }}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </motion.button>
  )
}
