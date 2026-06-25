import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Check, X } from 'lucide-react'
import { Medicine } from '../types/medicine'

interface MedicineCabinetProps {
  medicines: Medicine[]
  onSelect: (medicine: Medicine) => void
  checkerList: Medicine[]
  onAddToChecker: (medicine: Medicine) => void
  highlightedIds: string[]
  ownedIds: string[]
  onToggleCabinet: (id: string) => void
}

interface Shelf {
  label: string
  emoji: string
  medicines: Medicine[]
}

// Emojis are directly defined in medicines.json

function getShortName(med: Medicine): string {
  const shortNames: Record<string, string> = {
    // Group 1
    antacid_alumina_magnesia_tablets: "ลดกรด (เม็ด)",
    antacid_alumina_magnesia_suspension: "ลดกรด (น้ำ)",
    sodamint_tablets: "โซดามินท์",
    carminative_mixture: "ยาขับลมน้ำ",
    sodium_bicarbonate_infant_mixture: "แก้ท้องอืด (เด็ก)",
    mahahing_tincture: "มหาหิงคุ์",
    antacid_simethicone_suspension: "ลดกรดผสมขับลม (น้ำ)",
    antacid: "ลดกรดผสมขับลม (เม็ด)",
    citric_bicarbonate_effervescent: "ผงฟู่ลดกรด",
    simethicone_tablets: "ไซเมทิโคน",
    gaviscon_tablets: "กรดไหลย้อน (เม็ด)",
    gaviscon_liquid: "กรดไหลย้อน (น้ำ)",
    // Group 3
    glycerin_suppository_child: "เหน็บทวาร (เด็ก)",
    glycerin_suppository_adult: "เหน็บทวาร (ผู้ใหญ่)",
    magnesium_hydroxide_mixture: "ระบายแมกนีเซีย",
    sodium_chloride_enema: "ยาสวนทวาร",
    // Group 5
    paracetamol_325mg: "พาราฯ 325 มก.",
    paracetamol: "พาราฯ 500 มก.",
    paracetamol_syrup_child: "พาราฯ น้ำ (เด็ก)",
    pain_relief_plaster: "พลาสเตอร์ปวด",
    // Group 7
    cough_mixture_child: "แก้ไอ น้ำ (เด็ก)",
    // Group 8
    inhaler_menthol_camphor: "ยาดมคัดจมูก",
    vaporizing_ointment: "ยาทาระเหย (หวัด)",
    // Group 10
    eye_wash_saline: "ยาล้างตา",
    // Group 11
    throat_paint_iodine: "ยากวาดคอ",
    gentian_violet_solution: "เยนเชี่ยนไวโอเลต",
    toothache_drops: "ยาแก้ปวดฟัน",
    throat_lozenge_herbal: "ยาอมชุ่มคอ",
    throat_lozenge_chemical: "ยาอมแก้เจ็บคอ",
    // Group 12
    tincture_iodine: "ทิงเจอร์ไอโอดีน",
    tincture_thimerosal: "ทิงเจอร์แดง",
    isopropyl_alcohol_70: "IPA แอลกอฮอล์",
    ethyl_alcohol_70: "เอทิลแอลกอฮอล์",
    chloroxylenol_antiseptic: "น้ำยาฆ่าเชื้อโรค",
    // Group 15
    benzyl_benzoate_lotion: "รักษาหิดเหา (BB)",
    sulphur_ointment_10: "ขี้ผึ้งกำมะถัน",
    benzoic_salicylic_ointment: "รักษาน้ำกัดเท้า",
    coal_tar_ointment: "รักษาผิวหนังเรื้อรัง",
    sodium_thiosulfate_powder: "รักษาเกลื้อน",
    // Group 16
    vitamin_b_complex: "วิตามินบีรวม",
    vitamin_c_100mg: "วิตามินซี 100 มก.",
    ferrous_sulfate_tablets: "ยาบำรุงโลหิต",
    multivitamin_tablets: "วิตามินรวม",
    cod_liver_oil_capsules: "น้ำมันตับปลา (แคป)",
    cod_liver_oil_liquid: "น้ำมันตับปลา (น้ำ)"
  }
  return shortNames[med.id] || med.name.replace('ยา', '').trim();
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const shelfVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export function MedicineCabinet({
  medicines,
  onSelect,
  checkerList,
  onAddToChecker,
  highlightedIds,
  ownedIds,
  onToggleCabinet,
}: MedicineCabinetProps) {
  const [tab, setTab] = React.useState<'mine' | 'recommended' | 'all'>('recommended')
  const isSearching = highlightedIds.length > 0

  const safeOwnedIds = ownedIds ?? []
  const displayMedicines = tab === 'mine'
    ? medicines.filter((m) => safeOwnedIds.includes(m.id))
    : tab === 'recommended'
    ? medicines.filter((m) => m.isMOPHRecommended)
    : medicines

  const shelves: Shelf[] = [
    {
      label: 'ยาใช้ภายใน — ระบบทางเดินอาหาร',
      emoji: '🍽️',
      medicines: displayMedicines.filter(
        (m) => m.category === 'internal' && m.subcategory === 'stomach'
      ),
    },
    {
      label: 'ยาใช้ภายใน — บรรเทาอาการทั่วไป',
      emoji: '💊',
      medicines: displayMedicines.filter(
        (m) =>
          m.category === 'internal' &&
          ['pain_fever', 'allergy', 'dizziness', 'motion_sickness', 'cough', 'tonic', 'mouth_throat'].includes(m.subcategory)
      ),
    },
    {
      label: 'ยาใช้ภายนอก',
      emoji: '🩹',
      medicines: displayMedicines.filter((m) => m.category === 'external'),
    },
  ].filter((s) => s.medicines.length > 0)

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">

      {/* Tab toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-5 justify-center">
        <button
          onClick={() => setTab('mine')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs md:text-sm transition-all"
          style={{
            background: tab === 'mine'
              ? 'linear-gradient(135deg, #C8A265, #B8923A)'
              : 'white',
            color: tab === 'mine' ? 'white' : '#6B7280',
            border: tab === 'mine' ? 'none' : '1.5px solid #E5D9C9',
            boxShadow: tab === 'mine' ? '0 4px 15px rgba(200,162,101,0.4)' : 'none',
            fontFamily: 'Kanit, sans-serif',
          }}
        >
          🏠 ตู้ยาของฉัน
          {safeOwnedIds.length > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{
                background: tab === 'mine' ? 'rgba(255,255,255,0.3)' : '#F5ECD7',
                color: tab === 'mine' ? 'white' : '#B8923A',
              }}
            >
              {safeOwnedIds.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('recommended')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs md:text-sm transition-all"
          style={{
            background: tab === 'recommended'
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : 'white',
            color: tab === 'recommended' ? 'white' : '#6B7280',
            border: tab === 'recommended' ? 'none' : '1.5px solid #E5D9C9',
            boxShadow: tab === 'recommended' ? '0 4px 15px rgba(16,185,129,0.4)' : 'none',
            fontFamily: 'Kanit, sans-serif',
          }}
        >
          ✨ 15 ยาหลักแนะนำ
          <span
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{
              background: tab === 'recommended' ? 'rgba(255,255,255,0.25)' : '#D1FAE5',
              color: tab === 'recommended' ? 'white' : '#10B981',
            }}
          >
            {medicines.filter(m => m.isMOPHRecommended).length}
          </span>
        </button>
        <button
          onClick={() => setTab('all')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs md:text-sm transition-all"
          style={{
            background: tab === 'all'
              ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
              : 'white',
            color: tab === 'all' ? 'white' : '#6B7280',
            border: tab === 'all' ? 'none' : '1.5px solid #E5D9C9',
            boxShadow: tab === 'all' ? '0 4px 15px rgba(59,130,246,0.4)' : 'none',
            fontFamily: 'Kanit, sans-serif',
          }}
        >
          📚 คลังยาสามัญทั้งหมด
          <span
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{
              background: tab === 'all' ? 'rgba(255,255,255,0.25)' : '#EFF6FF',
              color: tab === 'all' ? 'white' : '#3B82F6',
            }}
          >
            {medicines.length}
          </span>
        </button>
      </div>

      {/* Progress bar (mine tab) */}
      {tab === 'mine' && (
        <div className="mb-5 mx-auto max-w-md">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: '#6B7280', fontFamily: 'Sarabun, sans-serif' }}>
            <span>ยาที่มีในตู้ของคุณ</span>
            <span style={{ color: '#B8923A', fontWeight: 600 }}>{safeOwnedIds.length}/{medicines.length} รายการ</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: '#F5ECD7' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(safeOwnedIds.length / medicines.length) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #C8A265, #B8923A)' }}
            />
          </div>
        </div>
      )}

      {/* Cabinet frame */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4A2C17, #2C1810)',
          padding: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,162,101,0.3)',
          border: '2px solid #C8A265',
        }}
      >
        {/* Handle */}
        <div className="flex items-center justify-center mb-3">
          <div className="w-16 h-2 rounded-full" style={{ background: 'linear-gradient(90deg, #B8923A, #C8A265, #B8923A)' }} />
        </div>

        {/* Empty state */}
        {shelves.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center rounded-2xl"
            style={{ background: 'linear-gradient(180deg, #F5ECD7 0%, #EDE0C4 100%)', border: '2px solid #B8923A' }}
          >
            <div className="text-5xl mb-3">📦</div>
            <p className="font-bold text-base mb-1" style={{ color: '#4A2C17', fontFamily: 'Kanit, sans-serif' }}>
              ตู้ยาของคุณยังว่างอยู่
            </p>
            <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>
              กดแท็บ "15 ยาหลักแนะนำ" หรือ "คลังยาสามัญทั้งหมด" เพื่อดูรายการยา<br />แล้วกด + เพื่อเพิ่มยาที่คุณมีเข้าตู้
            </p>
            <button
              onClick={() => setTab('recommended')}
              className="px-5 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, #C8A265, #B8923A)',
                color: 'white',
                fontFamily: 'Kanit, sans-serif',
              }}
            >
              ดูยาแนะนำ MOPH →
            </button>
          </motion.div>
        )}

        {/* Shelves */}
        <div className="flex flex-col gap-3">
          {shelves.map((shelf) => (
            <motion.div key={shelf.label} variants={shelfVariants}>
              {/* Shelf label */}
              <div className="cabinet-shelf rounded-t-xl px-4 py-2 flex items-center gap-2">
                <span>{shelf.emoji}</span>
                <span className="text-sm font-semibold" style={{ color: '#2C1810', fontFamily: 'Kanit, sans-serif' }}>
                  {shelf.label}
                </span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(44,24,16,0.3)', color: '#2C1810' }}>
                  {shelf.medicines.length} รายการ
                </span>
              </div>

              {/* Shelf content */}
              <div
                className="rounded-b-xl px-4 pt-4 pb-5"
                style={{
                  background: 'linear-gradient(180deg, #F5ECD7 0%, #EDE0C4 100%)',
                  border: '2px solid #B8923A',
                  borderTop: 'none',
                  minHeight: 110,
                }}
              >
                <div className="w-full h-1 rounded mb-4" style={{ background: 'linear-gradient(90deg, transparent, #B8923A60, transparent)' }} />
                <div className="flex flex-wrap gap-4">
                  {shelf.medicines.map((med) => {
                    const isOwned = safeOwnedIds.includes(med.id)
                    const isInChecker = checkerList.some((c) => c.id === med.id)
                    const isHighlighted = isSearching && highlightedIds.includes(med.id)
                    const isDimmed = isSearching && !highlightedIds.includes(med.id)

                    return (
                      <motion.div
                        key={med.id}
                        layout
                        animate={{ opacity: isDimmed ? 0.3 : 1, scale: isHighlighted ? 1.05 : 1 }}
                        whileHover={{ scale: isDimmed ? 1 : 1.08, zIndex: 10 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative flex-shrink-0 cursor-pointer group"
                        style={{ width: 92, height: 102 }}
                      >
                        {/* Glow when highlighted */}
                        {isHighlighted && (
                          <div className="absolute inset-0 rounded-2xl -z-10" style={{ boxShadow: `0 0 20px ${med.color}80`, background: `${med.color}20` }} />
                        )}

                        {/* Card */}
                        <div
                          onClick={() => onSelect(med)}
                          className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden"
                          style={{
                            background: isOwned
                              ? `linear-gradient(135deg, ${med.color}30, ${med.color}15)`
                              : tab !== 'mine'
                              ? 'linear-gradient(135deg, #fff 0%, rgba(200,162,101,0.08) 100%)'
                              : `linear-gradient(135deg, white, ${med.color}15)`,
                            border: isOwned
                              ? `2px solid ${med.color}80`
                              : `1px solid ${med.color}30`,
                            boxShadow: isOwned ? `0 3px 10px ${med.color}40` : `0 2px 6px ${med.color}20`,
                          }}
                        >
                          {/* Emergency badge */}
                          {med.isEmergencyKit && (
                            <div className="absolute top-1 left-1 w-4 h-4 rounded-full flex items-center justify-center z-10" style={{ background: '#DC2626', color: 'white', fontSize: 8 }}>★</div>
                          )}

                          {/* Owned checkmark */}
                          {isOwned && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center z-10" style={{ background: '#16A34A' }}>
                              <Check size={9} color="white" />
                            </div>
                          )}

                          {/* Medicine Emoji */}
                          <div className="flex-1 flex items-center justify-center relative w-full h-full p-2 pb-0">
                            <div className="text-3xl leading-none z-0">{med.icon || '💊'}</div>
                          </div>

                          <div
                            className="text-center leading-tight px-1 pb-1 z-10"
                            style={{
                              fontSize: 9.5,
                              fontWeight: 600,
                              color: '#2C1810',
                              fontFamily: 'Sarabun, sans-serif',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {getShortName(med)}
                          </div>
                        </div>

                        {/* Tooltip */}
                        <div
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 rounded-xl p-2 text-xs text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                          style={{
                            background: 'rgba(44,24,16,0.95)',
                            border: `1px solid ${med.color}60`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            fontFamily: 'Sarabun, sans-serif',
                          }}
                        >
                          <div className="font-semibold mb-1">{med.name}</div>
                          <div style={{ color: med.color, fontSize: 10 }}>{med.genericName}</div>
                        </div>

                        {/* Action buttons on hover */}
                        <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Cabinet toggle */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); onToggleCabinet(med.id) }}
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{
                              background: isOwned ? '#DC2626' : '#16A34A',
                              color: 'white',
                            }}
                            title={isOwned ? 'นำออกจากตู้ยาของฉัน' : 'เพิ่มในตู้ยาของฉัน'}
                          >
                            {isOwned ? <X size={9} /> : <Plus size={9} />}
                          </motion.button>

                          {/* Checker toggle */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); onAddToChecker(med) }}
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: isInChecker ? '#8B5CF6' : '#C8A265', color: 'white' }}
                            title="เพิ่มใน Safety Checker"
                          >
                            <Check size={9} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs" style={{ color: 'rgba(200,162,101,0.6)', fontFamily: 'Sarabun, sans-serif' }}>
          <span>★ = ยาฉุกเฉิน</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#16A34A' }} />
            = มีในตู้แล้ว
          </span>
          <span>•</span>
          <span>Hover ยา → กด + เพื่อเพิ่มในตู้</span>
        </div>
      </motion.div>
    </div>
  )
}
