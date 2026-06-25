import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ChevronDown, ChevronUp, AlertTriangle, Clock, Home, Stethoscope } from 'lucide-react'

interface SymptomGuideProps {
  onClose?: () => void
}

interface SymptomData {
  id: string
  icon: string
  name: string
  description: string
  medicineNames: string[]
  medicineColors: string[]
  homecare: string[]
  seeDoctor: string
  urgency: 'low' | 'medium' | 'high'
}

const SYMPTOMS: SymptomData[] = [
  {
    id: 'fever',
    icon: '🌡️',
    name: 'ไข้',
    description: 'อุณหภูมิร่างกายสูงกว่า 37.5°C รู้สึกร้อน หนาวสั่น อ่อนเพลีย',
    medicineNames: ['ยาพาราเซตามอล'],
    medicineColors: ['#E24B4A'],
    homecare: [
      'เช็ดตัวด้วยน้ำอุ่น (ไม่ใช่น้ำเย็น) บริเวณซอกคอ รักแร้ และขาหนีบ',
      'ดื่มน้ำเปล่ามากๆ อย่างน้อยวันละ 8-10 แก้ว',
      'พักผ่อนให้เพียงพอ หลีกเลี่ยงการออกแรง',
      'สวมเสื้อผ้าที่บางและระบายอากาศได้ดี',
    ],
    seeDoctor: 'ไข้สูงกว่า 39°C, ไข้นานเกิน 3 วัน, มีอาการชักหรือซึมผิดปกติ, เด็กอายุต่ำกว่า 3 เดือน',
    urgency: 'medium',
  },
  {
    id: 'cold',
    icon: '🤧',
    name: 'หวัด',
    description: 'น้ำมูกไหล คัดจมูก จาม คอเจ็บ อาจมีไข้ต่ำ อ่อนเพลีย',
    medicineNames: ['ยาคลอร์เฟนิรามีน', 'ยาพาราเซตามอล (ถ้ามีไข้)'],
    medicineColors: ['#8B5CF6', '#E24B4A'],
    homecare: [
      'พักผ่อนให้เพียงพอ ร่างกายต้องการพลังงานสู้ไวรัส',
      'ดื่มน้ำอุ่น น้ำผึ้งมะนาว หรือซุปร้อนๆ',
      'หลีกเลี่ยงการใกล้ชิดผู้อื่น ใส่หน้ากากป้องกัน',
      'ล้างมือบ่อยๆ ด้วยสบู่อย่างน้อย 20 วินาที',
    ],
    seeDoctor: 'อาการไม่ดีขึ้นใน 7-10 วัน, มีเสมหะสีเขียวหรือเหลืองเข้ม, หายใจลำบาก, เจ็บหน้าอก',
    urgency: 'low',
  },
  {
    id: 'headache',
    icon: '🤕',
    name: 'ปวดหัว',
    description: 'ปวดบริเวณศีรษะ หน้าผาก ขมับ หรือท้ายทอย อาจปวดตุบๆ หรือปวดตลอดเวลา',
    medicineNames: ['ยาพาราเซตามอล'],
    medicineColors: ['#E24B4A'],
    homecare: [
      'พักในที่เงียบ แสงสลัว หลีกเลี่ยงเสียงดัง',
      'นวดขมับหรือฐานกะโหลกเบาๆ เป็นวงกลม',
      'ดื่มน้ำ — ขาดน้ำเป็นสาเหตุปวดหัวที่พบบ่อยมาก',
      'ผ่อนคลายความเครียด นอนหลับพักผ่อน',
    ],
    seeDoctor: 'ปวดหัวอย่างรุนแรงกะทันหัน ("ปวดหัวที่เจ็บที่สุดในชีวิต"), ปวดพร้อมไข้สูงและคอแข็ง, ตามัว หรือพูดไม่ออก',
    urgency: 'medium',
  },
  {
    id: 'diarrhea',
    icon: '🚽',
    name: 'ท้องเสีย',
    description: 'ถ่ายเหลวหรือถ่ายบ่อยผิดปกติ (มากกว่า 3 ครั้ง/วัน) อาจมีปวดท้อง คลื่นไส้',
    medicineNames: ['ผงน้ำตาลเกลือแร่ ORS', 'ผงถ่านกัมมันต์ (กรณีอาหารเป็นพิษ)'],
    medicineColors: ['#34D399', '#6B7280'],
    homecare: [
      'ดื่มน้ำเกลือแร่ ORS บ่อยๆ เพื่อทดแทนน้ำที่เสียไป',
      'งดอาหารมัน เผ็ด และนมสด แต่ยังกินข้าวต้มหรือโจ๊กได้',
      'หลีกเลี่ยงผลไม้ที่มีน้ำตาลสูงและน้ำผลไม้',
      'ล้างมือก่อนกินอาหารและหลังเข้าห้องน้ำเสมอ',
    ],
    seeDoctor: 'ถ่ายเป็นเลือด, อาการรุนแรงหรือนานเกิน 2 วัน, ขาดน้ำรุนแรง (ปากแห้ง ตาโหล ไม่ปัสสาวะ)',
    urgency: 'high',
  },
  {
    id: 'stomach',
    icon: '🤢',
    name: 'ท้องอืด / อาหารไม่ย่อย',
    description: 'แน่นท้อง ท้องเฟ้อ ปวดแสบกลางอก เรอบ่อย หรือคลื่นไส้หลังอาหาร',
    medicineNames: ['ยาเม็ดลดกรด', 'ยาธาตุน้ำแดง'],
    medicineColors: ['#60A5FA', '#F87171'],
    homecare: [
      'กินช้าๆ เคี้ยวให้ละเอียด อย่ากินรีบเร่ง',
      'หลีกเลี่ยงอาหารมัน เผ็ด ทอด และกาแฟ',
      'อย่านอนทันทีหลังอาหาร รอ 2-3 ชั่วโมง',
      'ดื่มน้ำขิงอุ่นๆ หรือชาขิงช่วยบรรเทาอาการ',
    ],
    seeDoctor: 'ปวดท้องรุนแรงกะทันหัน, ปวดเรื้อรังไม่หาย, มีเลือดปนในอุจจาระ, น้ำหนักลดโดยไม่มีสาเหตุ',
    urgency: 'low',
  },
  {
    id: 'constipation',
    icon: '💩',
    name: 'ท้องผูก',
    description: 'ถ่ายยากหรือไม่ถ่ายเกิน 3 วัน อุจจาระแข็ง ต้องเบ่งมาก',
    medicineNames: ['ยาระบายมะขามแขก'],
    medicineColors: ['#A3E635'],
    homecare: [
      'ดื่มน้ำอย่างน้อยวันละ 8-10 แก้ว โดยเฉพาะน้ำอุ่นตอนเช้า',
      'กินผักและผลไม้ที่มีใยอาหารสูง เช่น มะละกอ มะนาว',
      'ออกกำลังกายเบาๆ เดินหลังอาหาร 15-30 นาที',
      'ไม่กลั้นอุจจาระ เมื่อปวดควรไปทันที',
    ],
    seeDoctor: 'ท้องผูกนานเกิน 2 สัปดาห์, ถ่ายเป็นเลือด, ปวดท้องรุนแรง, ท้องอืดมาก',
    urgency: 'low',
  },
  {
    id: 'wound',
    icon: '🩹',
    name: 'แผลสด / บาดเจ็บ',
    description: 'แผลถลอก แผลตัด บาดเจ็บเล็กน้อย มีเลือดออก',
    medicineNames: ['น้ำเกลือล้างแผล', 'ยาโพวิโดน-ไอโอดีน'],
    medicineColors: ['#38BDF8', '#854D0E'],
    homecare: [
      '1️⃣ กดห้ามเลือดด้วยผ้าสะอาด 5-10 นาที',
      '2️⃣ ล้างแผลด้วยน้ำเกลือหรือน้ำสะอาดไหลผ่าน',
      '3️⃣ ทาโพวิโดน-ไอโอดีนรอบขอบแผล ไม่ต้องทาในแผลลึก',
      '4️⃣ ปิดด้วยพลาสเตอร์หรือผ้าก๊อซ เปลี่ยนทุกวัน',
    ],
    seeDoctor: 'แผลลึกหรือกว้าง ขอบแผลเปิด, เลือดไม่หยุดหลัง 10 นาที, แผลจากสัตว์กัด, มีสัญญาณติดเชื้อ (บวม แดง ร้อน หนอง)',
    urgency: 'high',
  },
  {
    id: 'allergy',
    icon: '🌸',
    name: 'แพ้ / คันผิวหนัง',
    description: 'ผื่นลมพิษ คันตามร่างกาย น้ำมูลไหล จาม แพ้อากาศ แพ้อาหาร',
    medicineNames: ['ยาคลอร์เฟนิรามีน', 'คาลาไมน์โลชั่น (ทาที่ผิว)'],
    medicineColors: ['#8B5CF6', '#F9A8D4'],
    homecare: [
      'หลีกเลี่ยงสิ่งที่กระตุ้นอาการ (ฝุ่น ขนสัตว์ ละอองเกสร อาหารที่แพ้)',
      'อาบน้ำเย็น (ไม่ร้อน) เพื่อบรรเทาอาการคัน',
      'ทาคาลาไมน์โลชั่นบริเวณที่คันและเป็นผื่น',
      'ห้ามเกาเด็ดขาด จะทำให้ผื่นอักเสบและแพร่กระจาย',
    ],
    seeDoctor: 'หายใจลำบาก ริมฝีปากหรือลิ้นบวม ความดันต่ำ (Anaphylaxis) — โทร 1669 ทันที!',
    urgency: 'medium',
  },
  {
    id: 'motion_sickness',
    icon: '🚗',
    name: 'เมารถ / เมาเรือ',
    description: 'คลื่นไส้ เวียนศีรษะ อาเจียน เหงื่อออก ซีด ระหว่างเดินทาง',
    medicineNames: ['ยาไดเมนไฮดริเนท'],
    medicineColors: ['#10B981'],
    homecare: [
      'กินยาก่อนเดินทาง 30-60 นาทีเพื่อประสิทธิภาพสูงสุด',
      'นั่งเบาะหน้า มองออกไปข้างหน้า ไม่อ่านหนังสือ',
      'เปิดหน้าต่างให้อากาศถ่ายเท หรือเปิด AC รับอากาศ',
      'จิบน้ำขิงหรือลูกอมขิงช่วยบรรเทาคลื่นไส้ได้',
    ],
    seeDoctor: 'อาเจียนรุนแรงจนขาดน้ำ, อาการไม่ดีขึ้นหลังกินยา, มีอาการหูดับหรือการได้ยินผิดปกติ',
    urgency: 'low',
  },
  {
    id: 'muscle_pain',
    icon: '💪',
    name: 'ปวดเมื่อยกล้ามเนื้อ',
    description: 'ปวดกล้ามเนื้อ ปวดหลัง ปวดคอ ปวดข้อ จากการออกแรงหรืออิริยาบถ',
    medicineNames: ['ยาพาราเซตามอล', 'ยาหม่อง (ทาภายนอก)'],
    medicineColors: ['#E24B4A', '#F59E0B'],
    homecare: [
      'ประคบเย็น 15-20 นาทีใน 24-48 ชั่วโมงแรก (ลดบวม)',
      'ประคบร้อนหลัง 48 ชั่วโมง (ผ่อนคลายกล้ามเนื้อ)',
      'ยืดเส้นเบาๆ ค่อยๆ ไม่ฝืน',
      'พักผ่อนและหลีกเลี่ยงกิจกรรมที่ทำให้ปวดมากขึ้น',
    ],
    seeDoctor: 'ปวดรุนแรงมาก ปวดร้าวลงขา มีอ่อนแรง ชาหรือรู้สึกผิดปกติ ปวดหลังจากได้รับบาดเจ็บ',
    urgency: 'low',
  },
  {
    id: 'insect_bite',
    icon: '🦟',
    name: 'แมลงกัดต่อย',
    description: 'ยุงกัด มดกัด ผึ้งหรือต่อต่อย บวม คัน แสบร้อนบริเวณที่ถูกกัด',
    medicineNames: ['คาลาไมน์โลชั่น', 'ยาคลอร์เฟนิรามีน (กรณีคันมาก)', 'ยาหม่อง'],
    medicineColors: ['#F9A8D4', '#8B5CF6', '#F59E0B'],
    homecare: [
      'ล้างบริเวณที่ถูกกัดด้วยน้ำสะอาดและสบู่',
      'ประคบเย็นเพื่อลดบวมและบรรเทาอาการปวด',
      'ทาคาลาไมน์โลชั่นหรือยาหม่องเพื่อลดอาการคัน',
      'ห้ามเกาเพราะอาจทำให้ผิวหนังติดเชื้อ',
    ],
    seeDoctor: 'แพ้รุนแรง (Anaphylaxis): หายใจลำบาก หน้าบวม ความดันต่ำ — โทร 1669 ทันที! หรือเสี่ยงแมลงกัดนำโรค เช่น ยุงลาย',
    urgency: 'medium',
  },
  {
    id: 'dizziness',
    icon: '😵',
    name: 'วิงเวียนศีรษะ',
    description: 'บ้านหมุน เวียนหัว รู้สึกจะเป็นลม โดยเฉพาะเมื่อลุกขึ้นรวดเร็ว',
    medicineNames: ['ยาดมแก้วิงเวียน'],
    medicineColors: ['#06B6D4'],
    homecare: [
      'นั่งหรือนอนราบทันที ยกเท้าสูงกว่าระดับหัวใจ',
      'ดมยาดมเบาๆ ห่างจากจมูก 10-15 ซม.',
      'ลุกขึ้นช้าๆ เสมอ โดยเฉพาะตอนเช้า',
      'ดื่มน้ำและกินอาหาร ถ้าเกิดจากน้ำตาลหรือน้ำในเลือดต่ำ',
    ],
    seeDoctor: 'เป็นลมหมดสติ, เจ็บหน้าอก, ชาครึ่งซีก, พูดไม่ออก หรือตามัว — อาจเป็นสัญญาณ Stroke',
    urgency: 'high',
  },
]

const URGENCY_CONFIG = {
  low: { label: 'ไม่เร่งด่วน', color: '#16A34A', bg: '#F0FDF4', dot: '#16A34A' },
  medium: { label: 'ปานกลาง', color: '#D97706', bg: '#FFFBEB', dot: '#D97706' },
  high: { label: 'ควรระวัง', color: '#DC2626', bg: '#FEF2F2', dot: '#DC2626' },
}

export function SymptomGuide(_props: SymptomGuideProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-6"
      style={{ fontFamily: 'Sarabun, sans-serif' }}
    >
      {/* Header */}
      <div className="text-center mb-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: 'linear-gradient(135deg, #3B82F620, #3B82F640)', border: '2px solid #3B82F660' }}
        >
          <Stethoscope size={28} style={{ color: '#3B82F6' }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: '#2C1810', fontFamily: 'Kanit, sans-serif' }}>
          คู่มือดูแลอาการเบื้องต้น
        </h2>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          แนะนำการใช้ยาสามัญประจำบ้านสำหรับอาการทั่วไป
        </p>
      </div>

      {/* Emergency call banner */}
      <motion.a
        href="tel:1669"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-3 py-3 rounded-2xl font-bold mb-5"
        style={{
          background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
          color: 'white',
          boxShadow: '0 6px 20px rgba(220,38,38,0.35)',
          textDecoration: 'none',
          fontFamily: 'Kanit, sans-serif',
        }}
      >
        <Phone size={20} />
        <span>สายด่วนฉุกเฉิน 1669 — กดโทรได้เลย</span>
      </motion.a>

      {/* Disclaimer */}
      <div
        className="rounded-xl px-4 py-3 mb-5 flex items-start gap-2 text-xs"
        style={{ background: '#FFFBEB', border: '1px solid #FCD34D', color: '#92400E' }}
      >
        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
        <p>ข้อมูลนี้เป็นแนวทางเบื้องต้นเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ หากอาการรุนแรงหรือไม่แน่ใจควรพบแพทย์เสมอ</p>
      </div>

      {/* Symptom cards */}
      <div className="flex flex-col gap-3">
        {SYMPTOMS.map((s) => {
          const isOpen = openId === s.id
          const uc = URGENCY_CONFIG[s.urgency]

          return (
            <motion.div
              key={s.id}
              layout
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'white',
                border: `1.5px solid ${isOpen ? uc.dot + '60' : '#E5D9C9'}`,
                boxShadow: isOpen ? `0 4px 20px ${uc.dot}20` : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Card header — always visible */}
              <button
                onClick={() => toggle(s.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base" style={{ color: '#2C1810', fontFamily: 'Kanit, sans-serif' }}>
                      {s.name}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: uc.bg, color: uc.color }}
                    >
                      {s.urgency === 'high' ? '🔴' : s.urgency === 'medium' ? '🟡' : '🟢'} {uc.label}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#6B7280' }}>
                    {s.description}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                ) : (
                  <ChevronDown size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                )}
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: `1px solid ${uc.dot}20` }}>

                      {/* Medicines */}
                      <div className="pt-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-sm font-semibold" style={{ color: '#4A2C17' }}>💊 ยาที่แนะนำ</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {s.medicineNames.map((name, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-medium"
                              style={{
                                background: `${s.medicineColors[i] ?? '#C8A265'}15`,
                                border: `1.5px solid ${s.medicineColors[i] ?? '#C8A265'}40`,
                                color: '#2C1810',
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: s.medicineColors[i] ?? '#C8A265' }}
                              />
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Home care */}
                      <div
                        className="rounded-xl p-3"
                        style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <Home size={13} style={{ color: '#16A34A' }} />
                          <span className="text-xs font-semibold" style={{ color: '#16A34A' }}>การดูแลตัวเองที่บ้าน</span>
                        </div>
                        <ul className="flex flex-col gap-1">
                          {s.homecare.map((tip, i) => (
                            <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: '#166534' }}>
                              <span className="flex-shrink-0 mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* See doctor */}
                      <div
                        className="rounded-xl p-3"
                        style={{ background: uc.bg, border: `1px solid ${uc.dot}40` }}
                      >
                        <div className="flex items-start gap-1.5">
                          <Clock size={13} style={{ color: uc.color, flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <span className="text-xs font-semibold" style={{ color: uc.color }}>ควรพบแพทย์เมื่อ</span>
                            <p className="text-xs mt-1" style={{ color: uc.color }}>
                              {s.seeDoctor}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom emergency CTA */}
      <div
        className="mt-6 rounded-2xl p-4 text-center"
        style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}
      >
        <p className="text-sm font-semibold mb-2" style={{ color: '#DC2626' }}>
          ⚠️ หากอาการรุนแรงหรือไม่แน่ใจ
        </p>
        <p className="text-xs mb-3" style={{ color: '#991B1B' }}>
          อย่าลังเลที่จะโทรหาผู้เชี่ยวชาญ การปรึกษาแพทย์ไม่เสียหายเลย
        </p>
        <a
          href="tel:1669"
          className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm"
          style={{
            background: '#DC2626',
            color: 'white',
            textDecoration: 'none',
            fontFamily: 'Kanit, sans-serif',
          }}
        >
          <Phone size={16} />
          โทร 1669
        </a>
      </div>
    </div>
  )
}
