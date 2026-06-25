import { Medicine } from '../types/medicine'

const SEARCH_MAP: Record<string, string[]> = {
  paracetamol: ['ปวดหัว', 'ปวดศีรษะ', 'ไข้', 'ลดไข้', 'ปวดกล้ามเนื้อ', 'ปวด', 'ร้อน', 'heat', 'fever', 'pain'],
  chlorpheniramine: ['แพ้', 'คัน', 'ลมพิษ', 'น้ำมูก', 'จาม', 'คัดจมูก', 'ตาแดง', 'allergy', 'คลอร์'],
  antacid: ['แสบท้อง', 'กรด', 'ท้องอืด', 'ท้องเฟ้อ', 'แน่นท้อง', 'อาหารไม่ย่อย', 'heartburn', 'ลดกรด'],
  red_mineral_tonic: ['ท้องอืด', 'อาหารไม่ย่อย', 'ธาตุน้ำแดง', 'เจริญอาหาร'],
  ors_powder: ['ท้องเสีย', 'ขาดน้ำ', 'อาเจียน', 'เกลือแร่', 'ORS', 'ท้องร่วง', 'diarrhea'],
  activated_charcoal: ['สารพิษ', 'กินยาเกิน', 'ถ่าน', 'charcoal', 'ท้องอืด'],
  senna_laxative: ['ท้องผูก', 'ระบาย', 'มะขามแขก', 'ถ่าย', 'constipation'],
  mebendazole: ['พยาธิ', 'ถ่ายพยาธิ', 'worm', 'พยาธิไส้เดือน'],
  cough_syrup: ['ไอ', 'คอ', 'เจ็บคอ', 'น้ำดำ', 'cough', 'ไอแห้ง'],
  smelling_salts: ['วิงเวียน', 'เป็นลม', 'หมดสติ', 'มึนงง', 'dizziness', 'ยาดม'],
  tiger_balm: ['ปวดเมื่อย', 'นวด', 'ยาหม่อง', 'ปวดข้อ', 'คัน', 'เมื่อยล้า'],
  dimenhydrinate: ['เมารถ', 'เมาเรือ', 'เมาเครื่องบิน', 'คลื่นไส้', 'เมา', 'motion', 'travel'],
  povidone_iodine: ['แผล', 'ทำแผล', 'ฆ่าเชื้อ', 'โพวิโดน', 'ไอโอดีน', 'wound', 'antiseptic'],
  normal_saline: ['ล้างแผล', 'น้ำเกลือ', 'ล้างตา', 'saline', 'แผล'],
  calamine_lotion: ['คันผิว', 'ผื่น', 'อีสุกอีใส', 'แดดเผา', 'calamine', 'คาลาไมน์', 'ผิวหนัง'],
}

export function useSearch(medicines: Medicine[], query: string): string[] {
  if (!query.trim()) return []

  const q = query.trim().toLowerCase()

  return medicines
    .filter((med) => {
      // Direct name match
      if (med.name.toLowerCase().includes(q)) return true
      if (med.genericName.toLowerCase().includes(q)) return true
      if (med.indications.toLowerCase().includes(q)) return true

      // Keyword map match
      const keywords = SEARCH_MAP[med.id] ?? []
      return keywords.some((kw) => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase()))
    })
    .map((m) => m.id)
}
