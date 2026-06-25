import { Medicine, CheckResult, InteractionLevel } from '../types/medicine'
import { INTERACTION_RULES } from '../data/checkerRules'

export function checkInteractions(medicines: Medicine[]): CheckResult {
  if (medicines.length < 2) {
    return {
      level: 'safe',
      message: 'กรุณาเลือกยาอย่างน้อย 2 รายการเพื่อตรวจสอบ',
      details: [],
    }
  }

  const ids = medicines.map((m) => m.id)
  const matched: { level: InteractionLevel; message: string }[] = []

  for (const rule of INTERACTION_RULES) {
    // Check if all drugs in rule are present, OR if any is 'any'
    const isMatch = rule.drugs.every(
      (d) => d === 'any' || ids.includes(d)
    )
    if (isMatch) {
      matched.push({ level: rule.level, message: rule.message })
    }
  }

  // antacid with 'any' — check if antacid is present with anything else
  if (ids.includes('antacid') && ids.length > 1) {
    const alreadyMatched = matched.some((m) => m.message.includes('ลดกรด'))
    if (!alreadyMatched) {
      matched.push({
        level: 'warning',
        message: 'ยาลดกรดอาจลดการดูดซึมยาอื่นๆ ควรเว้นระยะการกินอย่างน้อย 2 ชั่วโมง',
      })
    }
  }

  if (matched.length === 0) {
    return {
      level: 'safe',
      message: 'ไม่พบปฏิกิริยาที่น่ากังวลระหว่างยาเหล่านี้',
      details: ['ยาสามัญประจำบ้านเหล่านี้สามารถใช้ร่วมกันได้ตามปกติ', 'อย่างไรก็ตาม หากมีข้อสงสัยควรปรึกษาเภสัชกรเสมอ'],
    }
  }

  // Find highest severity
  let highestLevel: InteractionLevel = 'safe'
  if (matched.some((m) => m.level === 'danger')) highestLevel = 'danger'
  else if (matched.some((m) => m.level === 'warning')) highestLevel = 'warning'

  const levelMessages: Record<InteractionLevel, string> = {
    safe: 'สามารถใช้ร่วมกันได้',
    warning: 'ควรระวังการใช้ยาร่วมกัน',
    danger: 'ไม่แนะนำให้ใช้ยาร่วมกัน',
  }

  return {
    level: highestLevel,
    message: levelMessages[highestLevel],
    details: matched.map((m) => m.message),
  }
}
