import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Clock3,
  GraduationCap,
  Heart,
  Info,
  LockKeyhole,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  UserRoundCheck,
} from "lucide-react";

import { doctorImages } from "@/lib/doctor-assets";
import { doctorProfiles } from "@/lib/doctor-profiles";
import { doctors } from "@/lib/doctor-ranking";

export const Route = createFileRoute("/doctors/$doctorId")({
  head: () => ({
    meta: [
      { title: "صفحة الطبيب | دلّني" },
      {
        name: "description",
        content: "ملف الطبيب ومعلومات العيادة والمواعيد والتقييمات على دلّني.",
      },
    ],
  }),
  component: DoctorProfilePage,
});

function DoctorProfilePage() {
  const { doctorId } = Route.useParams();
  const doctor = doctors.find((item) => item.id === doctorId);
  const profile = doctorProfiles[doctorId];

  if (!doctor || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <section className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
          <Stethoscope className="mx-auto mb-3 size-10 text-muted-foreground/40" />
          <h1 className="text-xl font-black text-primary">ملف الطبيب غير موجود</h1>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            قد يكون الرابط غير صحيح أو تم تغيير بيانات الطبيب.
          </p>
          <Link
            to="/doctors"
            search={{
              doctorName: "",
              specialty: "كل التخصصات",
              city: "كفر صقر",
              distance: "الكل",
              maxPrice: 1000,
              rating: "الكل",
              nearestAppointment: false,
            }}
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-xs font-black text-primary-foreground"
          >
            العودة إلى الأطباء
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => history.back()}
            aria-label="العودة إلى النتائج"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <ArrowRight className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-black text-primary">{doctor.name}</h1>
            <p className="text-[11px] text-muted-foreground">ملف طبيب تجريبي — المرحلة السابعة</p>
          </div>
          <button
            type="button"
            disabled
            title="المفضلة ستتاح بعد إنشاء حساب المريض"
            className="flex size-10 cursor-not-allowed items-center justify-center rounded-full border border-input text-muted-foreground opacity-60"
          >
            <Heart className="size-5" />
          </button>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <section className="mb-6 overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="grid md:grid-cols-[17rem_1fr]">
              <img
                src={doctorImages[doctor.image]}
                alt={`صورة ${doctor.name}`}
                width={512}
                height={768}
                className="h-80 w-full object-cover object-top md:h-full"
              />
              <div className="p-5 sm:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1.5 text-xs font-black text-success">
                      <BadgeCheck className="size-4" />
                      طبيب موثّق
                    </span>
                  )}
                  <span className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent">
                    بيانات تجريبية
                  </span>
                </div>
                <h2 className="text-3xl font-black text-primary sm:text-4xl">{doctor.name}</h2>
                <p className="mt-2 font-bold text-accent">{profile.subspecialty}</p>

                <div className="mt-5 flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 font-black text-primary">
                    <Star className="size-4 fill-chart-4 text-chart-4" />
                    {doctor.rating.toFixed(1)} ({doctor.reviewCount} تقييمًا)
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 font-bold text-primary">
                    <UserRoundCheck className="size-4 text-accent" />
                    خبرة {profile.experienceYears} سنة
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <span className="mb-1 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <GraduationCap className="size-4 text-accent" />
                      الدرجة العلمية
                    </span>
                    <p className="text-sm font-black text-primary">{profile.degree}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <span className="mb-1 text-xs font-bold text-muted-foreground">سعر الكشف</span>
                    <p className="text-xl font-black text-primary">{doctor.price} جنيه</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
            <div className="space-y-6">
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7">
                <h2 className="mb-3 text-lg font-black text-primary">نبذة عن الطبيب</h2>
                <p className="text-sm leading-8 text-muted-foreground">{profile.bio}</p>
              </section>

              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-primary">
                  <Clock3 className="size-5 text-accent" />
                  مواعيد العمل
                </h2>
                <div className="divide-y divide-border">
                  {profile.clinicHours.map((item) => (
                    <div
                      key={item.days}
                      className="flex flex-wrap justify-between gap-2 py-3 text-sm"
                    >
                      <span className="font-bold text-primary">{item.days}</span>
                      <span className="text-muted-foreground">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-lg font-black text-primary">
                    <Star className="size-5 fill-chart-4 text-chart-4" />
                    تقييمات المرضى
                  </h2>
                  <span className="text-xs font-bold text-muted-foreground">
                    {doctor.reviewCount} تقييمًا
                  </span>
                </div>
                <div className="space-y-3">
                  {profile.reviews.map((review) => (
                    <article key={review.id} className="rounded-2xl bg-secondary/60 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-black text-primary">{review.patientName}</h3>
                          <p className="text-[10px] text-muted-foreground">{review.date}</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-black text-primary">
                          <Star className="size-3.5 fill-chart-4 text-chart-4" />
                          {review.rating}.0
                        </span>
                      </div>
                      <p className="text-xs leading-6 text-muted-foreground">{review.comment}</p>
                    </article>
                  ))}
                </div>
                <p className="mt-4 flex gap-2 text-[11px] leading-5 text-muted-foreground">
                  <Info className="mt-0.5 size-4 shrink-0 text-accent" />
                  التقييمات الحالية تجريبية. النشر الفعلي سيكون بعد حجز سابق ومراجعة الإدارة.
                </p>
              </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h2 className="mb-4 flex items-center gap-2 font-black text-primary">
                  <CalendarClock className="size-5 text-accent" />
                  المواعيد المتاحة
                </h2>
                <div className="grid gap-2">
                  {profile.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      disabled
                      title="اختيار الموعد سيتاح مع نظام الحجز في المرحلة التاسعة"
                      className="min-h-11 cursor-not-allowed rounded-xl border border-input bg-background px-3 text-xs font-bold text-primary opacity-70"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled
                  className="mt-4 min-h-12 w-full cursor-not-allowed rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground opacity-80"
                >
                  احجز الآن
                </button>
                <p className="mt-2 text-center text-[10px] text-muted-foreground">
                  الحجز سيتاح في المرحلة التاسعة
                </p>
              </section>

              <section className="relative min-h-60 overflow-hidden rounded-3xl border border-border bg-secondary p-5">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_23px,var(--color-border)_24px,transparent_25px),linear-gradient(transparent_23px,var(--color-border)_24px,transparent_25px)] bg-[size:48px_48px] opacity-50" />
                <div className="relative">
                  <h2 className="flex items-center gap-2 font-black text-primary">
                    <MapPin className="size-5 text-accent" />
                    موقع العيادة
                  </h2>
                  <p className="mt-3 text-xs font-bold leading-6 text-primary">{doctor.address}</p>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    {profile.landmark}
                  </p>
                  <span className="absolute top-32 right-24 flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
                    <MapPin className="size-5" />
                  </span>
                </div>
                <p className="absolute right-5 bottom-4 left-5 text-[10px] text-muted-foreground">
                  خريطة تجريبية — Google Maps بعد إضافة المفتاح والإحداثيات.
                </p>
              </section>

              <section className="rounded-3xl border border-input bg-card p-4">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-black text-primary">
                  <Phone className="size-4 text-accent" />
                  رقم العيادة
                </h2>
                <p className="flex items-center gap-2 text-xs leading-6 text-muted-foreground">
                  <LockKeyhole className="size-4 shrink-0" />
                  يظهر رقم الهاتف بعد إتمام الحجز فقط.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
