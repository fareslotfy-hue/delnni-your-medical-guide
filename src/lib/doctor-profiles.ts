export type PatientReview = {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
};

export type DoctorProfileDetails = {
  subspecialty: string;
  degree: string;
  experienceYears: number;
  bio: string;
  landmark: string;
  verified: boolean;
  clinicHours: { days: string; hours: string }[];
  availableSlots: string[];
  reviews: PatientReview[];
};

export const doctorProfiles: Record<string, DoctorProfileDetails> = {
  "ahmed-mansour": {
    subspecialty: "باطنة عامة وسكر وضغط",
    degree: "ماجستير الأمراض الباطنة",
    experienceYears: 14,
    bio: "يهتم بمتابعة الحالات المزمنة والفحص الشامل للبالغين، مع شرح الخطة الطبية للمريض بصورة واضحة.",
    landmark: "بجوار بنك مصر — أعلى صيدلية الشفاء",
    verified: true,
    clinicHours: [
      { days: "السبت — الاثنين", hours: "4:00 م — 9:00 م" },
      { days: "الأربعاء — الخميس", hours: "5:00 م — 10:00 م" },
    ],
    availableSlots: ["اليوم 6:00 م", "اليوم 7:30 م", "غدًا 5:00 م"],
    reviews: [
      {
        id: "a1",
        patientName: "محمد السيد",
        rating: 5,
        date: "منذ أسبوعين",
        comment: "شرح الحالة بهدوء والانتظار كان قصيرًا.",
      },
      {
        id: "a2",
        patientName: "أسماء علي",
        rating: 5,
        date: "منذ شهر",
        comment: "متابعة جيدة وتعامل محترم داخل العيادة.",
      },
    ],
  },
  "mariam-adel": {
    subspecialty: "طب الأطفال وحديثي الولادة",
    degree: "ماجستير طب الأطفال",
    experienceYears: 11,
    bio: "متخصصة في متابعة نمو الأطفال والتغذية والحالات الشائعة، وتهتم بتبسيط الإرشادات للأهل.",
    landmark: "أمام محطة القطار — بجوار معمل المختبر",
    verified: true,
    clinicHours: [
      { days: "الأحد — الثلاثاء", hours: "3:00 م — 8:00 م" },
      { days: "الخميس", hours: "4:00 م — 9:00 م" },
    ],
    availableSlots: ["اليوم 5:30 م", "اليوم 7:00 م", "غدًا 4:30 م"],
    reviews: [
      {
        id: "m1",
        patientName: "نهى محمود",
        rating: 5,
        date: "منذ 10 أيام",
        comment: "صبورة جدًا مع الطفل وشرحت لنا كل التفاصيل.",
      },
      {
        id: "m2",
        patientName: "أحمد ربيع",
        rating: 4,
        date: "منذ شهر",
        comment: "الكشف منظم والطبيبة متعاونة.",
      },
    ],
  },
  "khaled-hassan": {
    subspecialty: "جراحة العظام وإصابات الملاعب",
    degree: "دكتوراه جراحة العظام",
    experienceYears: 18,
    bio: "خبرة في آلام المفاصل وإصابات الملاعب ومتابعة التأهيل، مع الاهتمام بالعلاج التحفظي عند ملاءمته.",
    landmark: "أمام مجلس المدينة — الدور الثاني",
    verified: true,
    clinicHours: [
      { days: "السبت — الاثنين", hours: "5:00 م — 10:00 م" },
      { days: "الأربعاء", hours: "6:00 م — 10:00 م" },
    ],
    availableSlots: ["غدًا 4:00 م", "غدًا 6:00 م", "الأربعاء 5:30 م"],
    reviews: [
      {
        id: "k1",
        patientName: "محمود فتحي",
        rating: 5,
        date: "منذ 3 أسابيع",
        comment: "فحص دقيق وشرح الأشعة بطريقة مفهومة.",
      },
      {
        id: "k2",
        patientName: "سارة عادل",
        rating: 5,
        date: "منذ شهرين",
        comment: "التزم بالموعد وخطة المتابعة واضحة.",
      },
    ],
  },
  "salma-fouad": {
    subspecialty: "الأمراض الجلدية والشعر",
    degree: "ماجستير الأمراض الجلدية",
    experienceYears: 9,
    bio: "تهتم بعلاج الأمراض الجلدية ومشكلات الشعر والأظافر بخطط متابعة واضحة تناسب كل حالة.",
    landmark: "خلف مدرسة الثانوية بنات — أعلى صيدلية النور",
    verified: true,
    clinicHours: [
      { days: "الأحد — الثلاثاء", hours: "4:00 م — 9:00 م" },
      { days: "الخميس", hours: "5:00 م — 9:00 م" },
    ],
    availableSlots: ["اليوم 8:00 م", "غدًا 5:00 م", "غدًا 7:00 م"],
    reviews: [
      {
        id: "s1",
        patientName: "ريم حسن",
        rating: 5,
        date: "منذ أسبوع",
        comment: "التعامل ممتاز والخطوات مكتوبة بوضوح.",
      },
      {
        id: "s2",
        patientName: "منى إبراهيم",
        rating: 5,
        date: "منذ 3 أسابيع",
        comment: "استمعت لكل التفاصيل وحددت موعد متابعة.",
      },
    ],
  },
  "omar-samy": {
    subspecialty: "أنف وأذن وحنجرة ومناظير",
    degree: "ماجستير الأنف والأذن والحنجرة",
    experienceYears: 12,
    bio: "متخصص في مشكلات الأذن والجيوب الأنفية والحلق، ويهتم بالفحص الدقيق وشرح خيارات المتابعة.",
    landmark: "بعد موقف أبو كبير بـ100 متر",
    verified: true,
    clinicHours: [
      { days: "السبت — الثلاثاء", hours: "5:00 م — 9:00 م" },
      { days: "الخميس", hours: "6:00 م — 10:00 م" },
    ],
    availableSlots: ["غدًا 6:30 م", "غدًا 8:00 م", "الخميس 6:00 م"],
    reviews: [
      {
        id: "o1",
        patientName: "خالد صبري",
        rating: 5,
        date: "منذ أسبوعين",
        comment: "كشف منظم وشرح سبب الأعراض ببساطة.",
      },
      {
        id: "o2",
        patientName: "دينا أشرف",
        rating: 4,
        date: "منذ شهر",
        comment: "العيادة نظيفة والاستقبال متعاون.",
      },
    ],
  },
  "nour-ibrahim": {
    subspecialty: "علاج وتجميل الأسنان",
    degree: "بكالوريوس طب وجراحة الفم والأسنان",
    experienceYears: 8,
    bio: "تهتم بعلاج الأسنان التحفظي وتنظيف الأسنان وخطط العناية اليومية، مع تجربة مريحة للمريض.",
    landmark: "بجوار سنترال كفر صقر — الدور الأول",
    verified: true,
    clinicHours: [
      { days: "السبت — الأربعاء", hours: "3:00 م — 9:00 م" },
      { days: "الخميس", hours: "4:00 م — 8:00 م" },
    ],
    availableSlots: ["السبت 3:00 م", "السبت 5:00 م", "الأحد 4:30 م"],
    reviews: [
      {
        id: "n1",
        patientName: "آية محمد",
        rating: 5,
        date: "منذ 5 أيام",
        comment: "هادئة وشرحت كل خطوة قبل البدء.",
      },
      {
        id: "n2",
        patientName: "عمر حسين",
        rating: 4,
        date: "منذ شهر",
        comment: "موعد منظم وتعامل جيد.",
      },
    ],
  },
};
