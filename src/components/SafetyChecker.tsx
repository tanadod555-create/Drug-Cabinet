import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, AlertTriangle, CheckCircle, XCircle, Printer } from 'lucide-react'
import { Medicine, CheckResult } from '../types/medicine'
import { checkInteractions } from '../utils/checkInteractions'

interface SafetyCheckerProps {
  medicines: Medicine[]
  checkerList: Medicine[]
  onRemoveFromChecker: (id: string) => void
  onClear: () => void
  onAddFromLibrary: (medicine: Medicine) => void
}

const MEDICINE_ICONS: Record<string, string> = {
  tablets: '💊', bottle: '🧪', sachet: '🫙', charcoal: '⬛',
  leaf: '🌿', worm: '🟡', pill: '💊', allergen: '🌸',
  syrup: '🍶', inhaler: '💨', ointment: '🟡', motion: '🌀',
  antiseptic: '🟤', saline: '💧', lotion: '🩷',
}

export function SafetyChecker({
  medicines,
  checkerList,
  onRemoveFromChecker,
  onClear,
  onAddFromLibrary,
}: SafetyCheckerProps) {
  const [result, setResult] = useState<CheckResult | null>(null)
  const [showLibrary, setShowLibrary] = useState(false)

  const handleCheck = () => {
    const res = checkInteractions(checkerList)
    setResult(res)
  }

  const handlePrint = () => {
    const medNames = checkerList.map((m) => m.name).join(', ')
    const levelText = result?.level === 'safe' ? '✅ ปลอดภัย' : result?.level === 'warning' ? '⚠️ ควรระวัง' : '❌ ไม่แนะนำ'
    const content = `
ตู้ยาดิจิทัล — ผลการตรวจสอบความปลอดภัยยา
==========================================
วันที่: ${new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
ยาที่ตรวจสอบ: ${medNames}
ผลลัพธ์: ${levelText} — ${result?.message}
รายละเอียด:
${result?.details.map((d, i) => `${i + 1}. ${d}`).join('\n')}

⚕️ ข้อมูลนี้เพื่อการศึกษาเท่านั้น หากสงสัยควรปรึกษาเภสัชกร
    `
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`<pre style="font-family:Sarabun,sans-serif;padding:20px;white-space:pre-wrap">${content}</pre>`)
      printWindow.print()
    }
  }

  const ResultIcon = result?.level === 'safe'
    ? CheckCircle
    : result?.level === 'warning'
    ? AlertTriangle
    : XCircle

  const resultColors = {
    safe: { bg: '#F0FDF4', border: '#86EFAC', text: '#16A34A', icon: '#16A34A' },
    warning: { bg: '#FFFBEB', border: '#FCD34D', text: '#D97706', icon: '#D97706' },
    danger: { bg: '#FEF2F2', border: '#FCA5A5', text: '#DC2626', icon: '#DC2626' },
  }

  const colors = result ? resultColors[result.level] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-6"
      style={{ fontFamily: 'Sarabun, sans-serif' }}
    >
      {/* Title */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: 'linear-gradient(135deg, #8B5CF620, #8B5CF640)', border: '2px solid #8B5CF660' }}>
          <Shield size={28} style={{ color: '#8B5CF6' }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: '#2C1810', fontFamily: 'Kanit, sans-serif' }}>
          Safety Checker
        </h2>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          ตรวจสอบความปลอดภัยของการใช้ยาร่วมกัน (สูงสุด 3 รายการ)
        </p>
      </div>

      {/* Selected medicines */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: 'white', border: '2px solid #E5D9C9', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: '#4A2C17' }}>
            ยาที่เลือก ({checkerList.length}/3)
          </span>
          {checkerList.length > 0 && (
            <button
              onClick={() => { onClear(); setResult(null) }}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ color: '#DC2626', background: '#FEF2F2' }}
            >
              ล้างทั้งหมด
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 min-h-12">
          {checkerList.length === 0 ? (
            <div className="text-sm w-full text-center py-3" style={{ color: '#9CA3AF' }}>
              เลือกยาจากตู้ยา หรือกดปุ่ม "+ เพิ่มจากคลัง" ด้านล่าง
            </div>
          ) : (
            checkerList.map((med) => (
              <motion.div
                key={med.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                style={{
                  background: `${med.color}15`,
                  border: `1px solid ${med.color}40`,
                  color: '#2C1810',
                }}
              >
                <span>{MEDICINE_ICONS[med.icon] ?? '💊'}</span>
                <span className="font-medium">{med.name}</span>
                <button
                  onClick={() => { onRemoveFromChecker(med.id); setResult(null) }}
                  className="ml-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.1)', color: '#6B7280' }}
                >
                  <X size={10} />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Add from library button */}
        {checkerList.length < 3 && (
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className="mt-3 w-full py-2 rounded-xl text-sm border-2 border-dashed transition-colors"
            style={{
              borderColor: '#C8A265',
              color: '#B8923A',
              background: showLibrary ? '#FDF5E6' : 'transparent',
              fontFamily: 'Sarabun, sans-serif',
            }}
          >
            + เพิ่มยาจากคลัง
          </button>
        )}

        {/* Library dropdown */}
        <AnimatePresence>
          {showLibrary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                {medicines
                  .filter((m) => !checkerList.some((c) => c.id === m.id))
                  .map((med) => (
                    <button
                      key={med.id}
                      onClick={() => {
                        onAddFromLibrary(med)
                        setShowLibrary(false)
                        setResult(null)
                      }}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors hover:opacity-80"
                      style={{
                        background: `${med.color}15`,
                        border: `1px solid ${med.color}40`,
                        color: '#2C1810',
                      }}
                    >
                      <span>{MEDICINE_ICONS[med.icon] ?? '💊'}</span>
                      {med.name}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Check button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCheck}
        disabled={checkerList.length < 2}
        className="w-full py-4 rounded-2xl font-semibold text-base mb-4 transition-all"
        style={{
          background:
            checkerList.length < 2
              ? '#E5D9C9'
              : 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
          color: checkerList.length < 2 ? '#9CA3AF' : 'white',
          boxShadow: checkerList.length >= 2 ? '0 8px 25px rgba(139,92,246,0.4)' : 'none',
          fontFamily: 'Kanit, sans-serif',
        }}
      >
        <Shield size={18} className="inline mr-2" />
        ตรวจสอบความปลอดภัย
      </motion.button>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl overflow-hidden"
            style={{
              border: `2px solid ${colors!.border}`,
              boxShadow: `0 8px 25px ${colors!.border}50`,
            }}
          >
            {/* Result header */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ background: colors!.bg }}>
              <ResultIcon size={28} style={{ color: colors!.icon }} />
              <div>
                <div className="font-bold text-lg" style={{ color: colors!.text, fontFamily: 'Kanit, sans-serif' }}>
                  {result.level === 'safe' ? '✅' : result.level === 'warning' ? '⚠️' : '❌'}{' '}
                  {result.message}
                </div>
              </div>
              <button
                onClick={handlePrint}
                className="ml-auto flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: 'rgba(0,0,0,0.08)', color: colors!.text }}
              >
                <Printer size={12} />
                บันทึกผล
              </button>
            </div>

            {/* Result details */}
            {result.details.length > 0 && (
              <div className="px-5 py-4" style={{ background: 'white' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#4A2C17' }}>รายละเอียด:</p>
                <ul className="flex flex-col gap-2">
                  {result.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
                      <span className="mt-1 flex-shrink-0" style={{ color: colors!.icon }}>•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs" style={{ color: '#9CA3AF' }}>
                  ⚕️ ปรึกษาเภสัชกรหรือแพทย์เสมอเพื่อความปลอดภัยสูงสุด
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
