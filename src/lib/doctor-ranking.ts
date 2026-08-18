export type Doctor = {
  id: string;
  name: string;
  specialty: "باطنة" | "عظام" | "أطفال" | "جلدية" | "أنف وأذن" | "أسنان";
  rating: number;
  reviewCount: number;
  bookingCount: number;
  price: number;
  distanceKm: number;
  nextSlotOrder: number;
  nextSlot: string;
  address: string;
  image: "doctor-1" | "doctor-2";
};

export const doctors: Doctor[] = [
  {
    id: "ahmed-mansour",
    name: "د. أحمد منصور",
    specialty: "باطنة",
    rating: 4.9,
    reviewCount: 203,
    bookingCount: 486,
    price: 350,
    distanceKm: 1.2,
    nextSlotOrder: 2,
    nextSlot: "اليوم، 6:00 م",
    address: "شارع المركز، كفر صقر",
    image: "doctor-1",
  },
  {
    id: "mariam-adel",
    name: "د. مريم عادل",
    specialty: "أطفال",
    rating: 4.8,
    reviewCount: 171,
    bookingCount: 392,
    price: 300,
    distanceKm: 2.1,
    nextSlotOrder: 1,
    nextSlot: "اليوم، 5:30 م",
    address: "ميدان المحطة، كفر صقر",
    image: "doctor-2",
  },
  {
    id: "khaled-hassan",
    name: "د. خالد حسن",
    specialty: "عظام",
    rating: 4.9,
    reviewCount: 126,
    bookingCount: 344,
    price: 400,
    distanceKm: 3.4,
    nextSlotOrder: 4,
    nextSlot: "غدًا، 4:00 م",
    address: "شارع الجمهورية، كفر صقر",
    image: "doctor-1",
  },
  {
    id: "salma-fouad",
    name: "د. سلمى فؤاد",
    specialty: "جلدية",
    rating: 5,
    reviewCount: 8,
    bookingCount: 21,
    price: 450,
    distanceKm: 4.6,
    nextSlotOrder: 3,
    nextSlot: "اليوم، 8:00 م",
    address: "شارع المدارس، كفر صقر",
    image: "doctor-2",
  },
  {
    id: "omar-samy",
    name: "د. عمر سامي",
    specialty: "أنف وأذن",
    rating: 4.7,
    reviewCount: 94,
    bookingCount: 218,
    price: 325,
    distanceKm: 5.8,
    nextSlotOrder: 5,
    nextSlot: "غدًا، 6:30 م",
    address: "طريق أبو كبير، كفر صقر",
    image: "doctor-1",
  },
  {
    id: "nour-ibrahim",
    name: "د. نور إبراهيم",
    specialty: "أسنان",
    rating: 4.6,
    reviewCount: 68,
    bookingCount: 147,
    price: 250,
    distanceKm: 7.2,
    nextSlotOrder: 6,
    nextSlot: "السبت، 3:00 م",
    address: "شارع النصر، كفر صقر",
    image: "doctor-2",
  },
];

const PRIOR_REVIEW_WEIGHT = 20;
const PLATFORM_BASELINE = 4;

export function weightedRating(doctor: Doctor) {
  const reviews = doctor.reviewCount;
  return (
    (reviews / (reviews + PRIOR_REVIEW_WEIGHT)) * doctor.rating +
    (PRIOR_REVIEW_WEIGHT / (reviews + PRIOR_REVIEW_WEIGHT)) * PLATFORM_BASELINE
  );
}

export function rankDoctors(items: Doctor[], nearestAppointment = false) {
  return [...items].sort((a, b) => {
    if (nearestAppointment && a.nextSlotOrder !== b.nextSlotOrder) {
      return a.nextSlotOrder - b.nextSlotOrder;
    }

    const scoreDifference = weightedRating(b) - weightedRating(a);
    if (Math.abs(scoreDifference) > 0.0001) return scoreDifference;
    if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount;
    return b.bookingCount - a.bookingCount;
  });
}
