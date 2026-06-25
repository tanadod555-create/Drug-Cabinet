import React from 'react'
import { motion } from 'framer-motion'
import { Phone, X, AlertTriangle } from 'lucide-react'

interface EmergencyModeProps {
  onClose: () => void
}

const EMERGENCY_DATA = [
  {
    symptom: '🤒 ไข้สูง / ปวด',
    medicines: ['ยาพาราเซตามอล'],
    urgency: 'high',
    note: 'เช็กอุณหภูมิ ถ้าเกิน 39°C ให้เช็ดตัวด้วย',
  },
  {
    symptom: '💧 ท้องเสียรุนแรง',
    medicines: ['ผงน้ำตาลเกลือแร่ ORS'],
    urgency: 'high',
    note: 'ดื่มน้ำเกลือแร่บ่อยๆ ป้องกันขาดน้ำ',
  },
  {
    symptom: '🩸 แผลสด / บาดเจ็บ',
    medicines: ['น้ำเกลือล้างแผล', 'ยาโพวิโดน-ไอโอดีน'],
    urgency: 'high',
    note: 'ล้างด้วยน้ำเกลือก่อน แล้วค่อยใส่โพวิโดน',
  },
  {
    symptom: '🤧 แพ้ / คันผิวหนัง',
    medicines: ['ยาคลอร์เฟนิรามีน', 'คาลาไมน์โลชั่น'],
    urgency: 'medium',
    note: 'ถ้าหายใจลำบากให้รีบโทร 1669 ทันที',
  },
  {
    symptom: '🤢 เมารถ / เมาเรือ',
    medicines: ['ยาไดเมนไฮดริเนท'],
    urgency: 'medium',
    note: 'กินก่อนเดินทาง 30–60 นาที จะได้ผลดีกว่า',
  },
  {
    symptom: '😵 วิงเวียน / เป็นลม',
    medicines: ['ยาดมแก้วิงเวียน'],
    urgency: 'medium',
    note: 'จัดให้นอนราบ ยกเท้าสูง หลีกเลี่ยงแสงจ้า',
  },
  {
    symptom: '🤮 คลื่นไส้ / อาหารไม่ย่อย',
    medicines: ['ยาธาตุน้ำแดง', 'ยาเม็ดลดกรด'],
    urgency: 'low',
    note: 'นอนพักและดื่มน้ำอุ่น หลีกเลี่ยงอาหารมัน',
  },
]

export function EmergencyMode({ onClose }: EmergencyModeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'rgba(220,38,38,0.05)', backdropFilter: 'blur(2px)' }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="max-w-2xl mx-auto px-4 py-6"
        style={{ fontFamily: 'Sarabun, sans-serif' }}
      >
        {/* Header */}
        <div
          className="rounded-3xl p-5 mb-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
            boxShadow: '0 20px 50px rgba(220,38,38,0.4)',
          }}
        >
          {/* Animated rings */}
          <div
            className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'white', animation: 'emergency-pulse 2s infinite' }}
          />

          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-4xl mb-2">🚨</div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Kanit, sans-serif' }}>
                โหมดฉุกเฉิน
              </h2>
              <p className="text-red-200 text-sm mt-1">
                ยาสามัญประจำบ้านสำหรับอาการเร่งด่วน
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Emergency call button */}
          <motion.a
            href="tel:1669"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-lg"
            style={{
              background: 'white',
              color: '#DC2626',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              fontFamily: 'Kanit, sans-serif',
              textDecoration: 'none',
            }}
          >
            <Phone size={22} />
            โทร 1669 — บริการการแพทย์ฉุกเฉิน
          </motion.a>
        </div>

        {/* Warning banner */}
        <div
          className="rounded-2xl px-4 py-3 mb-4 flex items-start gap-3"
          style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}
        >
          <AlertTriangle size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
          <p className="text-sm" style={{ color: '#92400E' }}>
            <strong>คำเตือน:</strong> ยาสามัญประจำบ้านใช้สำหรับอาการเบื้องต้นเท่านั้น
            หากอาการรุนแรง เด็กอายุต่ำกว่า 2 ปี หรือผู้สูงอายุ — ควรพบแพทย์หรือโทร 1669 ทันที
          </p>
        </div>

        {/* Emergency table */}
        <div className="flex flex-col gap-3">
          {EMERGENCY_DATA.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'white',
                border: item.urgency === 'high'
                  ? '2px solid #FCA5A5'
                  : item.urgency === 'medium'
                  ? '2px solid #FCD34D'
                  : '2px solid #D1FAE5',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-start p-4 gap-3">
                {/* Urgency dot */}
                <div
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{
                    background: item.urgency === 'high' ? '#DC2626'
                      : item.urgency === 'medium' ? '#D97706'
                      : '#16A34A',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: '#2C1810' }}>
                      {item.symptom}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: item.urgency === 'high' ? '#FEF2F2' : item.urgency === 'medium' ? '#FFFBEB' : '#F0FDF4',
                        color: item.urgency === 'high' ? '#DC2626' : item.urgency === 'medium' ? '#D97706' : '#16A34A',
                      }}
                    >
                      {item.urgency === 'high' ? '🔴 เร่งด่วนสูง' : item.urgency === 'medium' ? '🟡 ปานกลาง' : '🟢 ไม่เร่งด่วน'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.medicines.map((med) => (
                      <span
                        key={med}
                        className="text-xs px-2 py-1 rounded-lg font-medium"
                        style={{ background: '#F5ECD7', color: '#4A2C17', border: '1px solid #C8A265' }}
                      >
                        💊 {med}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs mt-2" style={{ color: '#6B7280', fontStyle: 'italic' }}>
                    💡 {item.note}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-2xl font-semibold"
          style={{
            background: 'linear-gradient(135deg, #2C1810, #4A2C17)',
            color: '#C8A265',
            border: '1px solid #C8A265',
            fontFamily: 'Kanit, sans-serif',
          }}
        >
          ← กลับไปที่ตู้ยา
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
