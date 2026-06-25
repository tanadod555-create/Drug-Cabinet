import { InteractionRule } from '../types/medicine'

export const INTERACTION_RULES: InteractionRule[] = [
  {
    drugs: ['chlorpheniramine', 'dimenhydrinate'],
    level: 'warning',
    message:
      'ยาทั้งสองตัวมีฤทธิ์ง่วงนอน การใช้ร่วมกันอาจทำให้ง่วงมากขึ้นอย่างเห็นได้ชัด ควรระวังการขับรถและเครื่องจักร',
  },
  {
    drugs: ['antacid', 'chlorpheniramine'],
    level: 'warning',
    message:
      'ยาลดกรดอาจลดการดูดซึมของยาคลอร์เฟนิรามีน ควรเว้นระยะการกินอย่างน้อย 2 ชั่วโมง',
  },
  {
    drugs: ['antacid', 'mebendazole'],
    level: 'warning',
    message:
      'ยาลดกรดอาจลดการดูดซึมของยาถ่ายพยาธิ ควรรับประทานยาถ่ายพยาธิหลังอาหาร และเว้น 2 ชั่วโมงก่อนกิน antacid',
  },
  {
    drugs: ['antacid', 'paracetamol'],
    level: 'safe',
    message:
      'สามารถรับประทานร่วมกันได้ แต่ควรเว้นระยะอย่างน้อย 1–2 ชั่วโมง เพื่อให้ยาแต่ละตัวออกฤทธิ์ได้เต็มที่',
  },
  {
    drugs: ['paracetamol', 'cough_syrup'],
    level: 'warning',
    message:
      'ยาแก้ไอน้ำดำบางสูตรอาจมีพาราเซตามอลเป็นส่วนประกอบ ตรวจสอบฉลากทุกครั้งเพื่อป้องกันการได้รับพาราเซตามอลเกินขนาด',
  },
  {
    drugs: ['chlorpheniramine', 'cough_syrup'],
    level: 'warning',
    message:
      'ยาทั้งสองมีฤทธิ์กดประสาท ทำให้ง่วงนอนรุนแรงขึ้น ไม่ควรใช้ร่วมกัน หรือใช้ในขนาดต่ำสุดที่จำเป็นและหลีกเลี่ยงการขับรถ',
  },
  {
    drugs: ['dimenhydrinate', 'cough_syrup'],
    level: 'warning',
    message:
      'ยาทั้งสองมีฤทธิ์กดการทำงานของระบบประสาท อาจทำให้ง่วงนอนมากและกดการหายใจ โดยเฉพาะในเด็ก ควรหลีกเลี่ยง',
  },
  {
    drugs: ['activated_charcoal', 'paracetamol'],
    level: 'danger',
    message:
      'ถ่านกัมมันต์จะดูดซับพาราเซตามอลในกระเพาะ ทำให้ยาไม่ออกฤทธิ์ ห้ามรับประทานพร้อมกัน ต้องเว้นอย่างน้อย 2–3 ชั่วโมง',
  },
  {
    drugs: ['activated_charcoal', 'mebendazole'],
    level: 'danger',
    message:
      'ถ่านกัมมันต์จะดูดซับยาถ่ายพยาธิ ทำให้การรักษาล้มเหลว ห้ามรับประทานพร้อมกัน ต้องเว้นอย่างน้อย 2–3 ชั่วโมง',
  },
  {
    drugs: ['senna_laxative', 'ors_powder'],
    level: 'safe',
    message:
      'สามารถใช้ร่วมกันได้ในบางกรณี แต่ไม่แนะนำในผู้ที่ท้องเสียอยู่แล้ว เพราะยาระบายจะทำให้ขาดน้ำมากขึ้น',
  },
]
