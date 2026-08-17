export type Specialty = "باطنة" | "عظام" | "أطفال" | "جلدية" | "أنف وأذن" | "أسنان";

export type Symptom = {
  id: string;
  label: string;
  specialty: Specialty;
};

export type RegionMapping = {
  id: string;
  label: string;
  symptoms: Symptom[];
};

export const regionMappings: Record<string, RegionMapping> = {
  head: {
    id: "head",
    label: "الرأس",
    symptoms: [
      { id: "headache", label: "صداع غير مفاجئ", specialty: "باطنة" },
      { id: "dizziness", label: "دوخة متكررة", specialty: "باطنة" },
      { id: "face-pressure", label: "ضغط أو ألم بالوجه", specialty: "أنف وأذن" },
      { id: "scalp-rash", label: "حكة أو طفح بفروة الرأس", specialty: "جلدية" },
    ],
  },
  ear: {
    id: "ear",
    label: "الأذن",
    symptoms: [
      { id: "ear-pain", label: "ألم بالأذن", specialty: "أنف وأذن" },
      { id: "tinnitus", label: "طنين", specialty: "أنف وأذن" },
      { id: "hearing", label: "ضعف سمع", specialty: "أنف وأذن" },
      { id: "ear-discharge", label: "إفرازات من الأذن", specialty: "أنف وأذن" },
    ],
  },
  chest: {
    id: "chest",
    label: "الصدر",
    symptoms: [
      { id: "cough", label: "كحة غير شديدة", specialty: "باطنة" },
      { id: "heartburn", label: "حموضة أو حرقة", specialty: "باطنة" },
      { id: "chest-wall", label: "ألم مع الحركة أو اللمس", specialty: "عظام" },
      { id: "chest-rash", label: "طفح أو حكة بالجلد", specialty: "جلدية" },
    ],
  },
  abdomen: {
    id: "abdomen",
    label: "البطن",
    symptoms: [
      { id: "abdominal-pain", label: "ألم غير شديد", specialty: "باطنة" },
      { id: "bloating", label: "انتفاخ", specialty: "باطنة" },
      { id: "nausea", label: "غثيان", specialty: "باطنة" },
      { id: "digestion", label: "تغيرات في الهضم", specialty: "باطنة" },
    ],
  },
  arm: {
    id: "arm",
    label: "الذراع",
    symptoms: [
      { id: "arm-pain", label: "ألم مع الحركة", specialty: "عظام" },
      { id: "arm-injury", label: "إصابة أو كدمة", specialty: "عظام" },
      { id: "arm-swelling", label: "تورم بعد مجهود أو إصابة", specialty: "عظام" },
      { id: "arm-rash", label: "طفح أو حكة", specialty: "جلدية" },
    ],
  },
  knee: {
    id: "knee",
    label: "الركبة",
    symptoms: [
      { id: "knee-pain", label: "ألم", specialty: "عظام" },
      { id: "knee-swelling", label: "تورم", specialty: "عظام" },
      { id: "knee-injury", label: "إصابة", specialty: "عظام" },
      { id: "knee-motion", label: "صعوبة حركة", specialty: "عظام" },
    ],
  },
  skin: {
    id: "skin",
    label: "الجلد",
    symptoms: [
      { id: "skin-rash", label: "طفح جلدي", specialty: "جلدية" },
      { id: "skin-itch", label: "حكة", specialty: "جلدية" },
      { id: "skin-color", label: "تغير لون موضعي", specialty: "جلدية" },
      { id: "skin-hair", label: "مشكلة بالشعر أو الأظافر", specialty: "جلدية" },
    ],
  },
  teeth: {
    id: "teeth",
    label: "الفم والأسنان",
    symptoms: [
      { id: "tooth-pain", label: "ألم أسنان", specialty: "أسنان" },
      { id: "gum", label: "ألم أو نزيف لثة بسيط", specialty: "أسنان" },
      { id: "broken-tooth", label: "سن مكسور", specialty: "أسنان" },
      { id: "sensitivity", label: "حساسية الأسنان", specialty: "أسنان" },
    ],
  },
  child: {
    id: "child",
    label: "أعراض طفل",
    symptoms: [
      { id: "child-fever", label: "حرارة غير طارئة", specialty: "أطفال" },
      { id: "child-cough", label: "كحة غير شديدة", specialty: "أطفال" },
      { id: "child-digestion", label: "قيء أو إسهال بسيط", specialty: "أطفال" },
      { id: "child-followup", label: "متابعة نمو أو تغذية", specialty: "أطفال" },
    ],
  },
};

export const urgentSymptoms = [
  { id: "severe-chest-pain", label: "ألم شديد أو مفاجئ بالصدر" },
  { id: "breathing", label: "صعوبة شديدة في التنفس" },
  { id: "unconscious", label: "فقدان الوعي أو عدم الاستجابة" },
  { id: "severe-bleeding", label: "نزيف شديد لا يتوقف" },
  { id: "seizure", label: "تشنج أو نوبة" },
  { id: "stroke", label: "ضعف مفاجئ بالوجه أو الذراع أو اضطراب الكلام" },
] as const;

export function recommendSpecialty(regionId: string, selectedSymptomIds: string[]) {
  const region = regionMappings[regionId];
  if (!region || selectedSymptomIds.length === 0) return null;

  const scores = new Map<Specialty, number>();
  for (const symptom of region.symptoms) {
    if (!selectedSymptomIds.includes(symptom.id)) continue;
    scores.set(symptom.specialty, (scores.get(symptom.specialty) ?? 0) + 1);
  }

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) return null;
  if (ranked.length > 1 && ranked[0]?.[1] === ranked[1]?.[1]) return null;
  return ranked[0]?.[0] ?? null;
}
