import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  Heart,
  Info,
  ListFilter,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";

import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import { doctors, rankDoctors, type Doctor } from "@/lib/doctor-ranking";

type DoctorSearch = {
  doctorName: string;
  specialty: string;
  city: string;
  distance: string;
  maxPrice: number;
  rating: string;
  nearestAppointment: boolean;
};

export const Route = createFileRoute("/doctors")({
  validateSearch: (search: Record<string, unknown>): DoctorSearch => ({
    doctorName: typeof search["doctorName"] === "string" ? search["doctorName"] : "",
    specialty: typeof search["specialty"] === "string" ? search["specialty"] : "كل التخصصات",
    city: typeof search["city"] === "string" ? search["city"] : "كفر صقر",
    distance: typeof search["distance"] === "string" ? search["distance"] : "الكل",
    maxPrice: Number.isFinite(Number(search["maxPrice"])) ? Number(search["maxPrice"]) : 1000,
    rating: typeof search["rating"] === "string" ? search["rating"] : "الكل",
    nearestAppointment:
      search["nearestAppointment"] === true || search["nearestAppointment"] === "on",
  }),
  head: () => ({
    meta: [
      { title: "نتائج الأطباء | دلّني" },
      {
        name: "description",
        content: "نتائج أطباء مرتبة بتقييم موزون مع فلاتر السعر والتخصص والمسافة.",
      },
    ],
  }),
  component: DoctorResults,
});

const imageById = { "doctor-1": doctor1, "doctor-2": doctor2 } as const;

function DoctorCard({ doctor, rank }: { doctor: Doctor; rank?: number | undefined }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
      {rank && (
        <span className="absolute top-4 left-4 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-black text-accent">
          #{rank} من الأفضل
        </span>
      )}
      <div className="flex gap-4">
        <img
          src={imageById[doctor.image]}
          alt={`صورة ${doctor.name}`}
          width={96}
          height={112}
          loading="lazy"
          className="h-28 w-24 shrink-0 rounded-2xl object-cover object-top"
        />
        <div className="min-w-0 flex-1 pt-1">
          <h3 className="truncate text-base font-black text-primary">{doctor.name}</h3>
          <p className="mt-1 text-xs font-bold text-accent">{doctor.specialty}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="flex items-center gap-1 font-black text-primary">
              <Star className="size-4 fill-chart-4 text-chart-4" />
              {doctor.rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({doctor.reviewCount} تقييمًا)</span>
          </div>
          <p className="mt-3 text-sm font-black text-primary">{doctor.price} جنيه</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2 border-t border-border pt-4">
        <button
          type="button"
          disabled
          title="المفضلة ستتاح بعد إنشاء حساب المريض"
          aria-label={`إضافة ${doctor.name} إلى المفضلة — تتطلب تسجيل الدخول`}
          className="flex size-12 shrink-0 cursor-not-allowed items-center justify-center rounded-xl border border-input text-muted-foreground opacity-60"
        >
          <Heart className="size-5" />
        </button>
        <button
          type="button"
          disabled
          title="الحجز سيتاح في المرحلة التاسعة"
          className="min-h-12 flex-1 cursor-not-allowed rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground opacity-80"
        >
          احجز الآن
        </button>
      </div>
    </article>
  );
}

function DoctorResults() {
  const search = Route.useSearch();
  const [showAll, setShowAll] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const maxDistance =
      search.distance === "الكل" ? Infinity : Number(search.distance?.split(" ")[0]);
    const minRating = search.rating === "4.5+" ? 4.5 : search.rating === "4+" ? 4 : 0;
    const doctorName = search.doctorName?.trim().toLocaleLowerCase("ar") ?? "";

    const filtered = doctors.filter(
      (doctor) =>
        (!doctorName || doctor.name.toLocaleLowerCase("ar").includes(doctorName)) &&
        (search.specialty === "كل التخصصات" || doctor.specialty === search.specialty) &&
        doctor.price <= (search.maxPrice ?? 1000) &&
        doctor.rating >= minRating &&
        doctor.distanceKm <= maxDistance,
    );

    return rankDoctors(filtered, search.nearestAppointment);
  }, [search]);

  const bestDoctors = results.slice(0, 3);
  const visibleDoctors = showAll ? results : bestDoctors;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/search"
            aria-label="العودة إلى البحث"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <ArrowRight className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="font-black text-primary sm:text-lg">نتائج الأطباء</h1>
            <p className="truncate text-[11px] text-muted-foreground">
              {search.specialty ?? "كل التخصصات"} — {search.city ?? "كفر صقر"}
            </p>
          </div>
          <Link
            to="/search"
            className="flex min-h-10 items-center gap-2 rounded-xl border border-input px-3 text-xs font-bold text-primary"
          >
            <Search className="size-4 text-accent" />
            بحث جديد
          </Link>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent">
                <ListFilter className="size-4" />
                بيانات تجريبية
              </span>
              <h2 className="text-2xl font-black text-primary sm:text-3xl">
                {results.length > 0 ? `${results.length} أطباء مناسبين` : "لا توجد نتائج مطابقة"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((value) => !value)}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-input bg-card px-4 text-xs font-bold text-primary lg:hidden"
            >
              <SlidersHorizontal className="size-4 text-accent" />
              ملخص الفلاتر
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_19rem] lg:items-start">
            <div>
              {results.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-black text-primary">
                      {showAll ? "جميع الأطباء" : "أفضل 3 أطباء"}
                    </h2>
                    <span className="text-[11px] text-muted-foreground">ترتيب عضوي موزون</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {visibleDoctors.map((doctor, index) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        rank={!showAll ? index + 1 : undefined}
                      />
                    ))}
                  </div>
                  {results.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAll((value) => !value)}
                      className="mt-5 min-h-12 w-full rounded-xl border border-accent/30 bg-accent/5 text-sm font-black text-accent"
                    >
                      {showAll ? "عرض أفضل 3 فقط" : `عرض جميع الأطباء (${results.length})`}
                    </button>
                  )}
                </>
              ) : (
                <section className="rounded-3xl border border-dashed border-input bg-card p-8 text-center">
                  <Search className="mx-auto mb-3 size-10 text-muted-foreground/40" />
                  <h2 className="font-black text-primary">جرّب توسيع نطاق البحث</h2>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    ارفع السعر الأقصى أو اختر كل التخصصات والمسافات لعرض اختيارات أكثر.
                  </p>
                  <Link
                    to="/search"
                    className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-xs font-black text-primary-foreground"
                  >
                    تعديل البحث
                  </Link>
                </section>
              )}
            </div>

            <aside
              className={`${mobileFiltersOpen ? "block" : "hidden"} space-y-4 lg:sticky lg:top-24 lg:block`}
            >
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h2 className="mb-4 flex items-center gap-2 font-black text-primary">
                  <SlidersHorizontal className="size-5 text-accent" />
                  الفلاتر المستخدمة
                </h2>
                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">التخصص</dt>
                    <dd className="font-bold text-primary">{search.specialty}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">السعر حتى</dt>
                    <dd className="font-bold text-primary">{search.maxPrice} جنيه</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">المسافة</dt>
                    <dd className="font-bold text-primary">{search.distance}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">التقييم</dt>
                    <dd className="font-bold text-primary">{search.rating}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">الترتيب</dt>
                    <dd className="font-bold text-primary">
                      {search.nearestAppointment ? "أقرب موعد" : "الأفضل تقييمًا"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="relative min-h-56 overflow-hidden rounded-3xl border border-border bg-secondary p-5">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_23px,var(--color-border)_24px,transparent_25px),linear-gradient(transparent_23px,var(--color-border)_24px,transparent_25px)] bg-[size:48px_48px] opacity-50" />
                <div className="relative">
                  <h2 className="flex items-center gap-2 font-black text-primary">
                    <MapPin className="size-5 text-accent" />
                    خريطة العيادات
                  </h2>
                  <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                    مواضع تجريبية. سيتم تفعيل Google Maps عند إضافة مفتاح الخرائط ومواقع العيادات.
                  </p>
                  {bestDoctors.map((doctor, index) => (
                    <span
                      key={doctor.id}
                      title={`${doctor.name} — ${doctor.address}`}
                      className="absolute flex size-8 items-center justify-center rounded-full bg-accent text-xs font-black text-accent-foreground shadow-lg"
                      style={{ top: `${90 + index * 38}px`, right: `${25 + index * 55}px` }}
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-accent/15 bg-accent/5 p-4">
                <p className="flex gap-2 text-[11px] leading-5 text-muted-foreground">
                  <Info className="mt-0.5 size-4 shrink-0 text-accent" />
                  الترتيب يوازن التقييم مع عدد التقييمات، ثم يستخدم عدد التقييمات والحجوزات لكسر
                  التعادل.
                </p>
                {bestDoctors[0] && (
                  <p className="mt-3 flex items-center gap-2 text-[11px] font-bold text-primary">
                    <CalendarClock className="size-4 text-success" />
                    أقرب موعد ظاهر: {bestDoctors[0].nextSlot}
                  </p>
                )}
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
