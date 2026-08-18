import doctorDentistry from "@/assets/doctor-dentistry.webp";
import doctorDermatology from "@/assets/doctor-dermatology.webp";
import doctorEnt from "@/assets/doctor-ent.webp";
import doctorInternal from "@/assets/doctor-internal.webp";
import doctorOrthopedics from "@/assets/doctor-orthopedics.webp";
import doctorPediatrics from "@/assets/doctor-pediatrics.webp";

export const doctorImages = {
  internal: doctorInternal,
  pediatrics: doctorPediatrics,
  orthopedics: doctorOrthopedics,
  dermatology: doctorDermatology,
  ent: doctorEnt,
  dentistry: doctorDentistry,
} as const;
