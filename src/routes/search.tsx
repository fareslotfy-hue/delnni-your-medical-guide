import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronDown,
  LocateFixed,
  MapPin,
  Search as SearchIcon,
  SlidersHorizontal,
  Star,
  Stethoscope,
} from "lucide-react";
import { type FormEvent, useState } from "react";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "ابحث عن طبيب | دلّني" },
      {
        name: "description",
        content: "ابحث عن طبيب في كفر صقر بالاسم أو التخصص وحدد الفلاتر المناسبة لك.",
      },
    ],
  }),
  component: DoctorSearch,
});

const specialties = ["كل التخصصات", "باطنة", "عظام", "أطفال", "جلدية", "أنف وأذن", "أسنان"];
const distances = ["الكل", "2 كم", "5 كم", "10 كم"];
const ratings = ["الكل", "4+", "4.5+"];

type LocationStatus = "idle" | "loading" | "granted" | "denied" | "unavailable";

function DoctorSearch() {
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [submitted, setSubmitted] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("unavailable");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      () => setLocationStatus("granted"),
      () => setLocationStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            aria-label="العودة إلى الصفحة الرئيسية"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <ArrowRight className="size-5" />
          </Link>
          <div>
            <h1 className="font-black text-primary sm:text-lg">ابحث عن طبيب</h1>
            <p className="text-[11px] text-muted-foreground">كفر صقر، الشرقية</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent">
              <SearchIcon className="size-4" />
              تجربة البحث
            </span>
            <h2 className="mb-3 text-3xl font-black text-primary sm:text-4xl">
              وصّل للطبيب المناسب بسهولة
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              اكتب اسم الطبيب أو اختار التخصص، ثم استخدم الفلاتر للوصول إلى اختيارات أقرب لاحتياجك.
            </p>
          </div>

          <form
            onSubmit={submitSearch}
            className="grid gap-5 lg:grid-cols-[1fr_19rem] lg:items-start"
          >
            <div className="space-y-5">
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7">
                <h3 className="mb-5 flex items-center gap-2 font-bold text-primary">
                  <SearchIcon className="size-5 text-accent" />
                  بيانات البحث الأساسية
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-bold text-primary">اسم الطبيب</span>
                    <div className="relative">
                      <SearchIcon className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        name="doctorName"
                        type="search"
                        placeholder="مثال: د. أحمد"
                        className="min-h-12 w-full rounded-xl border border-input bg-background pr-12 pl-4 text-sm text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-primary">التخصص</span>
                    <div className="relative">
                      <Stethoscope className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted-foreground" />
                      <select
                        name="specialty"
                        defaultValue="كل التخصصات"
                        className="min-h-12 w-full appearance-none rounded-xl border border-input bg-background pr-12 pl-10 text-sm text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                      >
                        {specialties.map((specialty) => (
                          <option key={specialty}>{specialty}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-primary">
                      المركز / المدينة
                    </span>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted-foreground" />
                      <select
                        name="city"
                        defaultValue="كفر صقر"
                        className="min-h-12 w-full appearance-none rounded-xl border border-input bg-background pr-12 pl-10 text-sm text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                      >
                        <option>كفر صقر</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </label>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 font-bold text-primary">
                    <LocateFixed className="size-5 text-accent" />
                    موقعك والمسافة
                  </h3>
                  {locationStatus === "granted" && (
                    <span className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
                      <Check className="size-3.5" />
                      تم تحديد الموقع
                    </span>
                  )}
                </div>

                <p className="mb-4 text-xs leading-6 text-muted-foreground">
                  لن نطلب موقعك إلا عند الضغط على الزر، ويُستخدم لترتيب الأطباء الأقرب فقط.
                </p>
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={locationStatus === "loading" || locationStatus === "granted"}
                  className="mb-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 text-sm font-bold text-accent transition hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LocateFixed className="size-5" />
                  {locationStatus === "loading"
                    ? "جارٍ تحديد موقعك..."
                    : locationStatus === "granted"
                      ? "تم استخدام موقعك الحالي"
                      : "استخدم موقعي الحالي"}
                </button>

                {(locationStatus === "denied" || locationStatus === "unavailable") && (
                  <p
                    role="status"
                    className="mb-5 rounded-xl bg-destructive/5 px-4 py-3 text-xs leading-5 text-destructive"
                  >
                    {locationStatus === "denied"
                      ? "لم يتم السماح بالوصول للموقع. يمكنك استكمال البحث باختيار كفر صقر يدويًا."
                      : "تحديد الموقع غير متاح على هذا الجهاز. يمكنك استكمال البحث يدويًا."}
                  </p>
                )}

                <fieldset>
                  <legend className="mb-3 text-sm font-bold text-primary">المسافة القصوى</legend>
                  <div className="grid grid-cols-4 gap-2">
                    {distances.map((distance) => (
                      <label key={distance} className="cursor-pointer">
                        <input
                          type="radio"
                          name="distance"
                          value={distance}
                          defaultChecked={distance === "الكل"}
                          className="peer sr-only"
                        />
                        <span className="flex min-h-11 items-center justify-center rounded-xl border border-input bg-background px-2 text-xs font-bold text-muted-foreground transition peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                          {distance}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </section>
            </div>

            <aside className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
              <h3 className="mb-5 flex items-center gap-2 font-bold text-primary">
                <SlidersHorizontal className="size-5 text-accent" />
                فلاتر إضافية
              </h3>

              <label className="mb-5 block">
                <span className="mb-2 flex items-center justify-between text-sm font-bold text-primary">
                  سعر الكشف حتى
                  <span className="text-xs text-accent">{maxPrice} جنيه</span>
                </span>
                <input
                  name="maxPrice"
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                  className="w-full accent-[var(--color-accent)]"
                />
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>100 جنيه</span>
                  <span>1000 جنيه</span>
                </div>
              </label>

              <fieldset className="mb-5">
                <legend className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
                  <Star className="size-4 fill-chart-4 text-chart-4" />
                  التقييم
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {ratings.map((rating) => (
                    <label key={rating} className="cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        defaultChecked={rating === "الكل"}
                        className="peer sr-only"
                      />
                      <span className="flex min-h-11 items-center justify-center rounded-xl border border-input bg-background text-xs font-bold text-muted-foreground peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                        {rating}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="mb-6 flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-background p-3">
                <input
                  type="checkbox"
                  name="nearestAppointment"
                  className="size-4 accent-[var(--color-accent)]"
                />
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-sm font-bold text-primary">
                    <CalendarClock className="size-4 text-accent" />
                    أقرب موعد
                  </span>
                  <span className="mt-1 block text-[10px] text-muted-foreground">
                    رتّب حسب أول موعد متاح
                  </span>
                </span>
              </label>

              <button
                type="submit"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-cta)] transition-transform active:scale-[0.98]"
              >
                <SearchIcon className="size-5" />
                ابحث عن طبيب
              </button>
            </aside>
          </form>

          {submitted && (
            <section
              role="status"
              className="mt-6 rounded-3xl border border-success/20 bg-success/5 p-5 sm:p-6"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-5" />
                </span>
                <div>
                  <h3 className="mb-1 font-bold text-primary">تم تجهيز اختيارات البحث</h3>
                  <p className="text-xs leading-6 text-muted-foreground">
                    واجهة النتائج الكاملة وبطاقات الأطباء ستُضاف في المرحلة السادسة وفق خطة المشروع.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
