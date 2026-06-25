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
  category: 'general' | 'gi' | 'wound_muscle' | 'mouth_throat_eye'
}

const SYMPTOMS: SymptomData[] = [
  // --- หมวดทั่วไป ---
  {
    id: 'fever',
    icon: '🌡️',
    name: 'ไข้ (ตัวร้อน)',
    description: 'อุณหภูมิร่างกายสูงกว่า 37.5°C รู้สึกร้อน หนาวสั่น อ่อนเพลีย',
    medicineNames: ['ยาพาราเซตามอล 500 มก.', 'ยาพาราเซตามอล 325 มก. (ตามน้ำหนักตัว)'],
    medicineColors: ['#EF4444', '#EF4444'],
    homecare: [
      'เช็ดตัวด้วยน้ำอุ่น (ไม่ใช่น้ำเย็น) บริเวณซอกคอ รักแร้ และขาหนีบย้อนทิศขนเพื่อระบายความร้อน',
      'ดื่มน้ำเปล่ามากๆ อย่างน้อยวันละ 8-10 แก้ว เพื่อป้องกันภาวะขาดน้ำ',
      'พักผ่อนให้เพียงพอ หลีกเลี่ยงการออกกำลังกายหรือออกแรงหนัก',
      'สวมเสื้อผ้าที่บาง สบาย และระบายอากาศได้ดี',
    ],
    seeDoctor: 'ไข้สูงเกิน 39°C ไม่ลดลงหลังกินยา, ไข้นานติดต่อกันเกิน 3 วัน, มีอาการชักหรือซึมผิดปกติ, เด็กอายุต่ำกว่า 3 เดือน',
    urgency: 'medium',
    category: 'general',
  },
  {
    id: 'cold',
    icon: '🤧',
    name: 'หวัด (มีน้ำมูก)',
    description: 'น้ำมูกไหล คัดจมูก จาม คอเจ็บ อาจมีไข้ต่ำและมีอาการครั่นเนื้อครั่นตัว',
    medicineNames: ['ยาคลอร์เฟนิรามีน', 'ยาพาราเซตามอล (เมื่อมีไข้ร่วมด้วย)'],
    medicineColors: ['#8B5CF6', '#EF4444'],
    homecare: [
      'พักผ่อนให้เพียงพอ เพื่อให้ร่างกายสร้างภูมิคุ้มกันมาสู้กับไวรัส',
      'ดื่มน้ำอุ่นบ่อยๆ หลีกเลี่ยงน้ำเย็นจัด',
      'สวมหน้ากากอนามัยเพื่อป้องกันการแพร่เชื้อให้ผู้อื่น',
      'ล้างมือบ่อยๆ ด้วยสบู่หรือแอลกอฮอล์เจล',
    ],
    seeDoctor: 'อาการไม่ดีขึ้นใน 7-10 วัน, มีเสมหะหรือน้ำมูกสีเขียว/เหลืองเข้มข้น, หายใจลำบากหรือเจ็บแน่นหน้าอก',
    urgency: 'low',
    category: 'general',
  },
  {
    id: 'headache',
    icon: '🤕',
    name: 'ปวดศีรษะ',
    description: 'ปวดบริเวณศีรษะ หน้าผาก ขมับ หรือท้ายทอย อาจปวดตุบๆ หรือปวดตื้อๆ',
    medicineNames: ['ยาพาราเซตามอล 500 มก.'],
    medicineColors: ['#EF4444'],
    homecare: [
      'นอนพักผ่อนในห้องที่เงียบ แสงสลัว และไม่มีเสียงรบกวน',
      'นวดขมับ ท้ายทอย หรือฐานกะโหลกเบาๆ เพื่อผ่อนคลายกล้ามเนื้อ',
      'ดื่มน้ำสะอาดมากๆ (การขาดน้ำเป็นสาเหตุของอาการปวดหัวที่พบบ่อยมาก)',
      'ผ่อนคลายความเครียดด้วยการฝึกลมหายใจช้าๆ',
    ],
    seeDoctor: 'ปวดหัวอย่างรุนแรงกะทันหันแบบไม่เคยเป็นมาก่อน, ปวดร่วมกับมีไข้สูงและคอแข็งเกร็ง, มีอาการชาร่างกายครึ่งซีก ตาพร่ามัว หรือพูดไม่ชัด',
    urgency: 'high',
    category: 'general',
  },
  {
    id: 'allergy',
    icon: '🌸',
    name: 'ผื่นแพ้ / ลมพิษ / คันผิวหนัง',
    description: 'ผื่นลมพิษนูนแดง คันตามผิวหนัง คันตา จาม หรือน้ำมูกไหลจากภูมิแพ้',
    medicineNames: ['ยาคลอร์เฟนิรามีน', 'คาลาไมน์โลชั่น (ทาภายนอกบรรเทาคัน)'],
    medicineColors: ['#8B5CF6', '#EC4899'],
    homecare: [
      'หลีกเลี่ยงสิ่งกระตุ้นที่ทำให้แพ้ทันที (เช่น ฝุ่น ขนสัตว์ เกสรดอกอาหาร แพ้ยา)',
      'อาบน้ำอุณหภูมิห้องหรือค่อนข้างเย็น งดการอาบน้ำอุ่นจัดที่จะกระตุ้นผื่นคัน',
      'ทาคาลาไมน์โลชั่นบริเวณที่มีผื่นคันได้บ่อยๆ เพื่อลดอาการคันระคายเคือง',
      'ห้ามเกาผิวหนังบริเวณที่คันเด็ดขาด เพื่อป้องกันการอักเสบติดเชื้อแบคทีเรียซ้ำซ้อน',
    ],
    seeDoctor: 'มีอาการหน้าบวม เปลือกตาบวม ริมฝีปากบวม หายใจลำบาก หายใจดังหวีด หรือแน่นหน้าอก (เป็นอาการแพ้รุนแรงเฉียบพลัน Anaphylaxis — โทร 1669 ทันที)',
    urgency: 'high',
    category: 'general',
  },
  {
    id: 'dizziness',
    icon: '😵',
    name: 'วิงเวียนศีรษะ / บ้านหมุน',
    description: 'เวียนหัว รู้สึกหน้ามืด บ้านหมุน พะอืดพะอม คล้ายจะเป็นลม',
    medicineNames: ['ยาดมแก้วิงเวียน', 'ยาเม็ดแก้เมารถ ไดเมนไฮดริเนท (หากมีอาการคลื่นไส้จัด)'],
    medicineColors: ['#22D3EE', '#10B981'],
    homecare: [
      'นั่งพักหรือนอนราบทันที หลับตา ป้องกันการล้มหัวฟาดพื้น',
      'สูดดมยาดมเบาๆ ห่างจากจมูกเล็กน้อย (10-15 ซม.) เพื่อความโล่ง',
      'หลีกเลี่ยงการเปลี่ยนท่าทางกะทันหัน โดยเฉพาะการลุกขึ้นยืนเร็วๆ',
      'ดื่มน้ำหวานหรือน้ำสะอาดหากเกิดจากการขาดน้ำหรือน้ำตาลในเลือดต่ำ',
    ],
    seeDoctor: 'เวียนศีรษะร่วมกับชาครึ่งซีก อ่อนแรงครึ่งซีก ปากเบี้ยว พูดไม่ชัด ตามัว หรือทรงตัวไม่ได้กะทันหัน',
    urgency: 'high',
    category: 'general',
  },
  {
    id: 'motion_sickness',
    icon: '🚗',
    name: 'เมารถ / เมาเรือ / เมาเครื่องบิน',
    description: 'คลื่นไส้ อาเจียน มึนศีรษะ ซีด และเหงื่อออกมากขณะเดินทางด้วยยานพาหนะ',
    medicineNames: ['ยาไดเมนไฮดริเนท'],
    medicineColors: ['#10B981'],
    homecare: [
      'รับประทานยาก่อนเริ่มเดินทางอย่างน้อย 30-60 นาที เพื่อประสิทธิภาพยาที่ดีที่สุด',
      'เลือกนั่งเบาะหน้าของรถยนต์ หรือส่วนกลางของเรือเพื่อลดแรงเหวี่ยง',
      'มองออกไปนอกรถในทิศทางด้านหน้าไกลๆ งดการจ้องมองโทรศัพท์หรืออ่านหนังสือ',
      'เปิดหน้าต่างรับลมให้อากาศระบายถ่ายเทได้ดี',
    ],
    seeDoctor: 'อาเจียนรุนแรงจนอ่อนเพลียมากและดื่มน้ำไม่ได้เลย, มีอาการหน้ามืดหมดสติ',
    urgency: 'low',
    category: 'general',
  },

  // --- หมวดทางเดินอาหาร ---
  {
    id: 'diarrhea',
    icon: '🚽',
    name: 'ท้องเสีย (ท้องร่วง)',
    description: 'ถ่ายอุจจาระเหลวหรือถ่ายเป็นน้ำตั้งแต่ 3 ครั้งขึ้นไปต่อวัน หรือถ่ายเป็นมูกเลือด',
    medicineNames: ['ผงน้ำตาลเกลือแร่ ORS', 'ผงถ่านกัมมันต์ (กรณีอาหารเป็นพิษ/ดูดซับสารพิษ)'],
    medicineColors: ['#10B981', '#6B7280'],
    homecare: [
      'จิบน้ำเกลือแร่ ORS บ่อยๆ ตลอดวันเพื่อชดเชยน้ำและเกลือแร่ที่สูญเสียไป',
      'รับประทานอาหารอ่อนๆ ย่อยง่าย เช่น โจ๊ก ข้าวต้ม งดอาหารรสจัด มัน และผลิตภัณฑ์นม',
      'หากกินผงถ่านกัมมันต์ ให้กินห่างจากยาอื่นอย่างน้อย 2 ชั่วโมงเพื่อป้องกันยาอื่นไม่ดูดซึม',
      'ล้างมือให้สะอาดหลังเข้าห้องน้ำและก่อนรับประทานอาหารทุกครั้ง',
    ],
    seeDoctor: 'ถ่ายอุจจาระมีมูกเลือดปน, ไข้สูง, ปวดท้องรุนแรงเกร็ง, ซึม ไม่มีปัสสาวะ หรือมีสัญญาณขาดน้ำรุนแรง',
    urgency: 'high',
    category: 'gi',
  },
  {
    id: 'stomach',
    icon: '🤢',
    name: 'ท้องอืด / ท้องเฟ้อ / อาหารไม่ย่อย',
    description: 'แน่นท้อง มีลมในท้องมาก เรอบ่อย ปวดมวนแสบร้อนกลางอกหลังมื้ออาหาร',
    medicineNames: ['ยาเม็ดลดกรด', 'ยาธาตุน้ำแดง', 'ยาเม็ดแก้ท้องอืด ไซเมทิโคน', 'ยาบรรเทาอาการกรดไหลย้อน (กาวิสคอน)'],
    medicineColors: ['#3B82F6', '#EF4444', '#10B981', '#3B82F6'],
    homecare: [
      'รับประทานอาหารช้าๆ เคี้ยวให้ละเอียด หลีกเลี่ยงการรับประทานอาหารปริมาณมากในครั้งเดียว',
      'งดอาหารรสเผ็ดจัด ของทอด ของมัน น้ำอัดลม ชา กาแฟ และแอลกอฮอล์',
      'หลีกเลี่ยงการนอนราบทันทีหลังรับประทานอาหาร ควรรออย่างน้อย 3 ชั่วโมง',
      'จิบน้ำอุ่นหรือดื่มน้ำขิงเพื่อช่วยขับลมตามธรรมชาติ',
    ],
    seeDoctor: 'ปวดท้องรุนแรงกะทันหัน, กลืนอาหารลำบาก, อุจจาระมีสีดำเข้มหรือมีเลือดปน, น้ำหนักลดรวดเร็วโดยไม่มีสาเหตุ',
    urgency: 'medium',
    category: 'gi',
  },
  {
    id: 'constipation',
    icon: '💩',
    name: 'ท้องผูก',
    description: 'ขับถ่ายอุจจาระยาก อุจจาระแข็งมาก ถ่ายไม่ออกติดต่อกันเกิน 3 วัน',
    medicineNames: ['ยาระบายมะขามแขก', 'ยาระบายแมกนีเซีย (Milk of Magnesia)', 'ยาสวนทวารโซเดียมคลอไรด์'],
    medicineColors: ['#🌿', '#60A5FA', '#0EA5E9'],
    homecare: [
      'เพิ่มการรับประทานอาหารที่มีใยอาหารสูง เช่น ผักใบเขียว ผลไม้ (มะละกอสุก ลูกพรุน)',
      'ดื่มน้ำสะอาดมากๆ อย่างน้อยวันละ 8-10 แก้ว โดยเฉพาะการดื่มน้ำอุ่น 1 แก้วตอนตื่นนอนเช้า',
      'ออกกำลังกายหรือเคลื่อนไหวร่างกายสม่ำเสมอเพื่อกระตุ้นการทำงานของลำไส้',
      'ฝึกขับถ่ายให้เป็นเวลาในแต่ละวัน และไม่กลั้นอุจจาระเมื่อปวด',
    ],
    seeDoctor: 'ท้องผูกเรื้อรังนานเกิน 2 สัปดาห์โดยไม่ดีขึ้น, ถ่ายอุจจาระมีเลือดปนสว่าง, ปวดเกร็งท้องรุนแรงพร้อมท้องอืดแข็ง',
    urgency: 'low',
    category: 'gi',
  },

  // --- หมวดแผลและกล้ามเนื้อ ---
  {
    id: 'wound',
    icon: '🩹',
    name: 'แผลสด / แผลถลอก',
    description: 'ผิวหนังฉีกขาด แผลถลอกตื้นๆ มีเลือดออกเล็กน้อยจากอุบัติเหตุ',
    medicineNames: ['น้ำเกลือล้างแผล', 'ยาโพวิโดน-ไอโอดีน', 'ทิงเจอร์ไอโอดีน (ทารอบแผล)'],
    medicineColors: ['#38BDF8', '#🟤', '#B45309'],
    homecare: [
      'ใช้ผ้าสะอาดกดห้ามเลือดบริเวณบาดแผล 5-10 นาทีจนเลือดหยุดไหล',
      'ล้างทำความสะอาดแผลด้วยน้ำเกลือล้างแผล (Normal Saline 0.9%) หรือน้ำสะอาดไหลผ่านจนหมดสิ่งสกปรก',
      'ใส่ยาโพวิโดน-ไอโอดีนบริเวณแผลสดเพื่อฆ่าเชื้อ (ระวังยาเสื่อมประสิทธิภาพหากแผลเปียกน้ำ)',
      'ปิดแผลด้วยพลาสเตอร์ยาหรือผ้าก๊อซสะอาดเพื่อป้องกันสิ่งสกปรกฝุ่นละออง',
    ],
    seeDoctor: 'แผลลึกกว้างเห็นกล้ามเนื้อหรือไขมัน เลือดไหลไม่หยุดหลังกด 10 นาที, แผลสกปรกมากหรือโดนเหล็กเป็นสนิมบาด, แผลจากสัตว์หรือคนกัด (เสี่ยงบาดทะยัก/พิษสุนัขบ้า)',
    urgency: 'high',
    category: 'wound_muscle',
  },
  {
    id: 'muscle_pain',
    icon: '💪',
    name: 'ปวดเมื่อยกล้ามเนื้อ',
    description: 'ปวดตึงกล้ามเนื้อ คอ บ่า ไหล่ ปวดหลัง หรือเคล็ดขัดยอกจากการทำงานหรือออกกำลังกาย',
    medicineNames: ['ยาหม่อง ชนิดขี้ผึ้ง (นวดถู)', 'พลาสเตอร์บรรเทาปวด', 'ยาพาราเซตามอล (ลดปวดระบบภายใน)'],
    medicineColors: ['#F59E0B', '#84CC16', '#EF4444'],
    homecare: [
      'ประคบเย็นใน 24-48 ชั่วโมงแรกที่มีอาการปวดเฉียบพลัน/บวม เพื่อลดอาการอักเสบ',
      'ประคบอุ่นหลังผ่าน 48 ชั่วโมงแรกเพื่อผ่อนคลายเส้นเอ็นและเพิ่มการไหลเวียนเลือด',
      'ทายานวดบรรเทาปวดเบาๆ หลีกเลี่ยงการนวดดัดดึงรุนแรงในช่วงอักเสบเฉียบพลัน',
      'พักการใช้งานกล้ามเนื้อส่วนที่ปวดและยืดเหยียดเบาๆ',
    ],
    seeDoctor: 'ปวดรุนแรงมากจนขยับข้อต่อไม่ได้เลย, ปวดร้าวลงขาพร้อมอาการชาหรืออ่อนแรงของกล้ามเนื้อปลายเท้า',
    urgency: 'low',
    category: 'wound_muscle',
  },
  {
    id: 'insect_bite',
    icon: '🦟',
    name: 'แมลงสัตว์กัดต่อย',
    description: 'มดกัด ยุงกัด ผึ้ง ต่อ แตน ต่อย มีตุ่มนูน แดง คัน แสบร้อนผิวหนัง',
    medicineNames: ['คาลาไมน์โลชั่น', 'ยาหม่อง ชนิดขี้ผึ้ง', 'ยาคลอร์เฟนิรามีน (ลดอาการคันจากสารฮิสตามีน)'],
    medicineColors: ['#F9A8D4', '#F59E0B', '#8B5CF6'],
    homecare: [
      'หากถูกผึ้งต่อต่อย ให้รีบใช้บัตรแข็งหรือคีมเขี่ยเหล็กไนออกทันที ห้ามบีบเค้นดึงเพราะจะทำให้พิษกระจาย',
      'ล้างบริเวณผิวหนังที่ถูกกัดต่อยด้วยน้ำสะอาดและสบู่อ่อน',
      'ประคบน้ำแข็งหรือถุงเจลเย็นเพื่อบรรเทาปวดบวม',
      'ทาคาลาไมน์โลชั่นเพื่อลดคัน หรือทาถูยาหม่องลดอักเสบแดง',
    ],
    seeDoctor: 'มีสัญญาณแพ้รุนแรง (Anaphylaxis) เช่น แน่นอก หายใจไม่ออก หน้าบวม ลมพิษเห่อขึ้นทั่วตัวทันที หรือแผลบวมแดงขนาดใหญ่ลามเร็วผิดปกติ',
    urgency: 'high',
    category: 'wound_muscle',
  },
  {
    id: 'burns',
    icon: '🔥',
    name: 'ไฟไหม้ / น้ำร้อนลวก',
    description: 'ผิวหนังแดง แสบร้อน เจ็บปวด หรือพุพองจากการสัมผัสความร้อน ไฟ หรือไอน้ำเดือด',
    medicineNames: ['น้ำเกลือล้างแผล (ทำความสะอาด)', 'ยาพาราเซตามอล (ลดปวด)'],
    medicineColors: ['#38BDF8', '#EF4444'],
    homecare: [
      'ล้างผ่านด้วยน้ำสะอาดอุณหภูมิปกติทันทีนาน 10-15 นาทีเพื่อระบายความร้อนสะสมในชั้นผิวหนัง',
      'ห้ามใช้น้ำแข็ง น้ำเย็นจัด หรือยาสีฟัน/น้ำปลาทาแผลเด็ดขาด เพราะจะทำให้แผลลึกติดเชื้อระคายเคืองรุนแรงขึ้น',
      'ห้ามเจาะถุงน้ำที่พองพุพองด้วยตัวเอง ปล่อยให้ยุบเองธรรมชาติเพื่อป้องกันการติดเชื้อใต้ชั้นผิว',
      'ทาเจลว่านหางจระเข้บริสุทธิ์เพื่อรักษาความชุ่มชื้นและลดอาการแสบร้อนผิว',
    ],
    seeDoctor: 'แผลไหม้ระดับ 2-3 (ผิวลอกลึกเห็นเนื้อในขาวหรือดำไหม้เกรียม), แผลกว้างใหญ่กว่า 1 ฝ่ามือ, เกิดแผลไหม้ที่บริเวณใบหน้า ดวงตา อวัยวะเพศ หรือมีสัญญาณติดเชื้อ',
    urgency: 'high',
    category: 'wound_muscle',
  },

  // --- หมวดปาก คอ และตา ---
  {
    id: 'throat_pain',
    icon: '🗣️',
    name: 'เจ็บคอ / ระคายคอ / ไอ',
    description: 'กลืนน้ำลายลำบาก คอแห้ง ระคายเคืองคอ มีอาการไอแห้งหรือไอแบบมีเสมหะรบกวน',
    medicineNames: ['ยาอมแก้เจ็บคอ', 'ยาอมชุ่มคอ', 'ยาแก้ไอน้ำดำ (Brown Mixture)', 'ยาน้ำแก้ไอขับเสมหะสำหรับเด็ก (สำหรับเด็ก)'],
    medicineColors: ['#EF4444', '#D9F99D', '#92400E', '#D97706'],
    homecare: [
      'บ้วนปากกลั้วคอด้วยน้ำเกลืออุ่นบ่อยๆ (เกลือป่นครึ่งช้อนชาละลายน้ำอุ่น 1 แก้ว) เพื่อลดแบคทีเรียและลดบวมช่องคอ',
      'ดื่มน้ำอุ่นหรือน้ำอุณหภูมิห้องปริมาณมาก งดน้ำเย็นจัดและอาหารทอด/มันที่กระตุ้นอาการไอ',
      'อมยาอมแก้เจ็บคอช้าๆ เพื่อกระจายตัวยาฆ่าเชื้อและช่วยลดบวมในลำคอ',
      'หลีกเลี่ยงการใช้เสียงดังและการอยู่ในห้องแอร์เย็นจัดหรือมีฝุ่นควัน',
    ],
    seeDoctor: 'เจ็บคอมากจนกลืนน้ำลายหรือน้ำแทบไม่ได้เลย, ต่อมทอนซิลอักเสบแดงและมีจุดหนองขาวชัดเจน, มีไข้สูงครั่นเนื้อครั่นตัวหนาวสั่น, หรือไอเรื้อรังนานเกิน 2 สัปดาห์',
    urgency: 'medium',
    category: 'mouth_throat_eye',
  },
  {
    id: 'toothache',
    icon: '🦷',
    name: 'ปวดฟัน',
    description: 'ปวดฟันฟุ เจ็บเสียวเหงือกฟันผุ ปวดเสียวเมื่อกินของร้อน/เย็นจัด ปวดตื้อๆ ตลอดเวลา',
    medicineNames: ['ยาแก้ปวดฟัน (ชนิดหยอดฟัน)', 'ยาพาราเซตามอล (ลดปวด)'],
    medicineColors: ['#78350F', '#EF4444'],
    homecare: [
      'ใช้ไม้พันสำลีสะอาดชุบยาแก้ปวดฟันกานพลู อุดลงในรูฟันที่ผุเพื่อบรรเทาอาการปวดเฉพาะจุด หลีกเลี่ยงเหงือก',
      'บ้วนปากด้วยน้ำอุ่นบ่อยๆ เพื่อล้างเศษอาหารที่ติดค้างในรูฟันผุออก',
      'งดอาหารร้อนจัด เย็นจัด หวานจัด หรืออาหารแข็งที่ต้องใช้แรงเคี้ยวมาก',
      'รับประทานยาแก้ปวดเพื่อควบคุมอาการปวดเบื้องต้นก่อนไปพบทันตแพทย์',
    ],
    seeDoctor: 'มีอาการบวมแดงที่ใบหน้า แก้ม เหงือกบวมเป่งมีหนอง, มีไข้ขึ้นสูงหนาวสั่น, ปวดฟันรุนแรงจนทนไม่ไหวและนอนไม่หลับ',
    urgency: 'medium',
    category: 'mouth_throat_eye',
  },
  {
    id: 'eye_irritation',
    icon: '👁️',
    name: 'แสบตา / ระคายเคืองตา',
    description: 'แสบตา ตาแดง คันตา น้ำตาไหลเนื่องจากมีฝุ่นละออง ควัน หรือสิ่งแปลกปลอมเข้าตา',
    medicineNames: ['ยาล้างตา', 'น้ำเกลือล้างแผล (ล้างตาได้ปลอดภัย)'],
    medicineColors: ['#06B6D4', '#38BDF8'],
    homecare: [
      'ล้างตาทำความสะอาดทันทีด้วยยาล้างตาหรือบีบน้ำเกลือล้างแผลชะล้างเบ้าตาผ่านหัวตาออกไป',
      'ห้ามขยี้ดวงตาเด็ดขาด เพราะเศษฝุ่นจะครูดกระจกตาทำให้เกิดแผลถลอกรุนแรงขึ้นได้',
      'หากสวมคอนแทคเลนส์ ให้รีบถอดคอนแทคเลนส์ออกทันทีเพื่อเช็ดล้างตา',
      'พักผ่อนสายตา หลีกเลี่ยงการสู้แสงแดดหรือจ้องคอมพิวเตอร์ชั่วคราว',
    ],
    seeDoctor: 'มีอาการตามัว มองเห็นภาพไม่ชัดเจน ปวดกระบอกตารุนแรง, สิ่งแปลกปลอมเกาะติดแน่นกระจกตาล้างไม่ออก, หรือล้างตาแล้วตาแดงอักเสบลุกลาม',
    urgency: 'high',
    category: 'mouth_throat_eye',
  },
]

const URGENCY_CONFIG = {
  low: { label: 'ไม่เร่งด่วน', color: '#16A34A', bg: '#F0FDF4', dot: '#16A34A' },
  medium: { label: 'ปานกลาง', color: '#D97706', bg: '#FFFBEB', dot: '#D97706' },
  high: { label: 'ควรระวัง', color: '#DC2626', bg: '#FEF2F2', dot: '#DC2626' },
}

export function SymptomGuide(_props: SymptomGuideProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'gi' | 'wound_muscle' | 'mouth_throat_eye'>('general')

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  const filteredSymptoms = SYMPTOMS.filter(s => s.category === selectedCategory)

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
          แนะนำการประเมินและการใช้ยาสามัญประจำบ้านสำหรับอาการทั่วไปแบ่งตามหมวดหมู่
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

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5">
        <button
          onClick={() => { setSelectedCategory('general'); setOpenId(null); }}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'general' ? 'bg-[#3B82F6] text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'
          }`}
          style={{ fontFamily: 'Kanit, sans-serif' }}
        >
          🌡️ ทั่วไป / หวัด
        </button>
        <button
          onClick={() => { setSelectedCategory('gi'); setOpenId(null); }}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'gi' ? 'bg-[#10B981] text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'
          }`}
          style={{ fontFamily: 'Kanit, sans-serif' }}
        >
          🍽️ ทางเดินอาหาร
        </button>
        <button
          onClick={() => { setSelectedCategory('wound_muscle'); setOpenId(null); }}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'wound_muscle' ? 'bg-[#C8A265] text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'
          }`}
          style={{ fontFamily: 'Kanit, sans-serif' }}
        >
          🩹 แผล / กล้ามเนื้อ
        </button>
        <button
          onClick={() => { setSelectedCategory('mouth_throat_eye'); setOpenId(null); }}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'mouth_throat_eye' ? 'bg-[#8B5CF6] text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'
          }`}
          style={{ fontFamily: 'Kanit, sans-serif' }}
        >
          👁️ ปาก / คอ / ตา
        </button>
      </div>

      {/* Symptom cards */}
      <div className="flex flex-col gap-3 min-h-[250px]">
        {filteredSymptoms.map((s) => {
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
                    <span className="font-bold text-sm md:text-base" style={{ color: '#2C1810', fontFamily: 'Kanit, sans-serif' }}>
                      {s.name}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: uc.bg, color: uc.color }}
                    >
                      {s.urgency === 'high' ? '🔴' : s.urgency === 'medium' ? '🟡' : '🟢'} {uc.label}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 truncate text-gray-400" style={{ fontFamily: 'Sarabun, sans-serif' }}>
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
                          <span className="text-sm font-semibold" style={{ color: '#4A2C17', fontFamily: 'Kanit, sans-serif' }}>💊 ยาที่แนะนำ</span>
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
                          <span className="text-xs font-semibold" style={{ color: '#16A34A', fontFamily: 'Kanit, sans-serif' }}>การดูแลตัวเองที่บ้าน</span>
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
                            <span className="text-xs font-semibold" style={{ color: uc.color, fontFamily: 'Kanit, sans-serif' }}>ควรพบแพทย์เมื่อ</span>
                            <p className="text-xs mt-1 leading-relaxed" style={{ color: uc.color }}>
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
        <p className="text-sm font-semibold mb-2" style={{ color: '#DC2626', fontFamily: 'Kanit, sans-serif' }}>
          ⚠️ หากอาการรุนแรงหรือไม่แน่ใจ
        </p>
        <p className="text-xs mb-3 text-red-800" style={{ fontFamily: 'Sarabun, sans-serif' }}>
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
