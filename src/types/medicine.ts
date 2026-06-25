// types/medicine.ts

export interface Dosage {
  adult: string
  child: string
  maxPerDay: string
}

export type MedicineCategory = "internal" | "external"
export type Subcategory =
  | "stomach"
  | "pain_fever"
  | "allergy"
  | "dizziness"
  | "motion_sickness"
  | "wound"
  | "skin"
  | "external_pain"
  | "eye"
  | "mouth_throat"
  | "cough"
  | "tonic"

export interface Medicine {
  id: string
  name: string
  genericName: string
  category: MedicineCategory
  subcategory: Subcategory
  icon: string
  color: string
  indications: string
  dosage: Dosage
  warnings: string[]
  contraindications: string
  storage: string
  isEmergencyKit: boolean
  labelCheck: string
  shelfLife: string
  isMOPHRecommended?: boolean
}

export type InteractionLevel = "safe" | "warning" | "danger"

export interface InteractionRule {
  drugs: string[]
  level: InteractionLevel
  message: string
}

export interface CheckResult {
  level: InteractionLevel
  message: string
  details: string[]
}

export interface ExpireEntry {
  id: string
  medicineId: string
  medicineName: string
  purchaseDate: string
  expiryDate: string
  daysLeft: number
}
