import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck2,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  User,
} from "lucide-react";

import body3d from "@/assets/body-3d.png";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دلّني | مش عارف تروح لدكتور إيه؟" },
      {
        name: "description",
        content:
          "دلّني منصة تساعدك على اختيار التخصص الطبي المناسب وحجز أفضل الأطباء في كفر صقر بالشرقية.",
      },
      { property: "og:title", content: "دلّني | مش عارف تروح لدكتور إيه؟" },
      {
        property: "og:description",
        content: "اختر التخصص المناسب لأعراضك واحجز مع طبيب موثّق في كفر صقر.",
      },
    ],
  }),
  component: Index,
});

const specialties = [
  { name: "باطنة", emoji: "🩺" },
  { name: "عظام", emoji: "🦴" },
  { name: "أطفال", emoji: "👶" },
  { name: "جلدية", emoji: "🧴" },
  { name: "أنف وأذن", emoji: "👂" },
  { name: "أسنان", emoji: "🦷" },
];

const doctors = [
  {
    name: "د. أحمد محمد علي",
    title: "استشاري جراحة العظام والمفاصل",
    rating: "4.9",
    reviews: 126,
    price: 400,
    photo: doctor1,
  },
  {
    name: "د. سارة إبراهيم",
    title: "أخصائي الأمراض الجلدية",
    rating: "4.8",
    reviews: 98,
    price: 350,
    photo: doctor2,
  },
];

const steps = [
  {
    icon: Search,
    title: "اختار طريقتك",
    description: "ابحث مباشرة أو استخدم الدليل البصري لمساعدتك.",
  },
  {
    icon: Stethoscope,
    title: "اعرف التخصص المناسب",
    description: "نقترح تخصصًا فقط بناءً على اختياراتك، بدون تشخيص.",
  },
  {
    icon: CalendarCheck2,
    title: "اختار الطبيب واحجز",
    description: "قارن المعلومات الأساسية واختر الموعد المناسب لك.",
  },
];

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2" aria-label="دلّني - الصفحة الرئيسية">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-lg font-black text-primary-foreground shadow-[var(--shadow-card)]">
              د
            </span>
            <span className="text-2xl font-black tracking-tight text-primary">دلّني</span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="حسابي - قريبًا"
              title="قريبًا"
              className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary transition-colors hover:bg-muted"
            >
              <User className="size-5" />
            </button>
            <a
              href="#join-doctor"
              className="rounded-xl bg-accent px-3 py-2 text-xs font-bold text-accent-foreground transition-transform hover:-translate-y-0.5 sm:px-4 sm:text-sm"
            >
              انضم كطبيب
            </a>
          </div>
        </div>
      </nav>

      <main id="top">
        <header className="relative isolate overflow-hidden bg-gradient-to-b from-card via-card to-background px-4 pt-10 pb-14 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8">
          <div className="pointer-events-none absolute -top-32 -right-24 -z-10 size-80 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/10 px-4 py-2 text-xs font-bold text-accent">
                <MapPin className="size-4" />
                الآن في الشرقية — كفر صقر
              </span>
              <h1 className="mb-5 text-4xl leading-tight font-black text-primary sm:text-5xl lg:text-6xl">
                مش عارف تروح لدكتور إيه؟
              </h1>
              <p className="mx-auto mb-9 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                دلّني يساعدك توصل للتخصص والطبيب المناسب بناءً على اختياراتك، بكل سهولة وأمان—من غير
                تشخيص طبي.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="#top-doctors"
                className="group flex items-center gap-4 rounded-3xl border border-border bg-card p-5 text-right shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-cta)] md:flex-col md:items-start"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                  <Search className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 block font-bold text-primary">ابحث عن دكتور</span>
                  <span className="block text-xs leading-5 text-muted-foreground">
                    بالاسم أو التخصص أو المنطقة
                  </span>
                </span>
                <ArrowLeft className="size-5 text-accent transition-transform group-hover:-translate-x-1" />
              </a>
              <a
                href="#visual-guide"
                className="group flex items-center gap-4 rounded-3xl bg-primary p-5 text-right text-primary-foreground shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-1 md:flex-col md:items-start"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-card/10">
                  <Stethoscope className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 block font-bold">ساعدني أختار التخصص</span>
                  <span className="block text-xs leading-5 text-primary-foreground/65">
                    حدد مكان المشكلة والأعراض
                  </span>
                </span>
                <ArrowLeft className="size-5 text-accent transition-transform group-hover:-translate-x-1" />
              </a>
              <a
                href="#visual-guide"
                className="group flex items-center gap-4 rounded-3xl border border-border bg-card p-5 text-right shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-cta)] md:flex-col md:items-start"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success transition-transform group-hover:scale-110">
                  <Sparkles className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 block font-bold text-primary">استكشف الجسم 3D</span>
                  <span className="block text-xs leading-5 text-muted-foreground">
                    تجربة بصرية سريعة وسهلة
                  </span>
                </span>
                <ArrowLeft className="size-5 text-accent transition-transform group-hover:-translate-x-1" />
              </a>
            </div>
          </div>
        </header>

        <section id="visual-guide" className="scroll-mt-24 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-card)] md:min-h-96 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <span className="mb-4 w-fit rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                نموذج أولي
              </span>
              <h2 className="mb-4 text-3xl font-black text-primary sm:text-4xl">
                استكشف مكان المشكلة بصريًا
              </h2>
              <p className="mb-7 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                اختر مكان المشكلة، ثم الأعراض، وسنساعدك في الوصول إلى التخصص الذي قد يكون الأنسب. لا
                يقدم دلّني تشخيصًا طبيًا.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground opacity-70"
                >
                  بدء الفحص البصري
                </button>
                <span className="text-xs font-semibold text-muted-foreground">
                  يتفعّل في المرحلة الرابعة
                </span>
              </div>
            </div>
            <div className="relative min-h-72 overflow-hidden bg-gradient-to-t from-accent/10 to-transparent md:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent)_1px,transparent_1px)] bg-[size:22px_22px] opacity-10" />
              <img
                src={body3d}
                alt="نموذج توضيحي للجسم البشري"
                loading="lazy"
                width={512}
                height={800}
                className="absolute inset-x-0 bottom-[-5rem] mx-auto h-[25rem] w-auto object-contain opacity-80 md:bottom-[-7rem] md:h-[34rem]"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <span className="mb-2 block text-xs font-bold text-accent">اختيار سريع</span>
                <h2 className="text-2xl font-black text-primary sm:text-3xl">التخصصات الشائعة</h2>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">الإصدار الأول</span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
              {specialties.map((specialty) => (
                <div
                  key={specialty.name}
                  className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-3 text-center shadow-[var(--shadow-card)]"
                >
                  <span className="text-3xl" aria-hidden="true">
                    {specialty.emoji}
                  </span>
                  <span className="text-xs font-bold text-primary sm:text-sm">
                    {specialty.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="mb-2 block text-xs font-bold text-accent">بسيط وواضح</span>
              <h2 className="mb-3 text-3xl font-black text-primary">كيف يعمل دلّني؟</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                ثلاث خطوات تساعدك على اتخاذ الخطوة التالية بدون تعقيد أو ادعاء تشخيص.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article
                    key={step.title}
                    className="relative rounded-3xl border border-border bg-background p-6"
                  >
                    <span className="absolute top-5 left-5 text-4xl font-black text-primary/5">
                      0{index + 1}
                    </span>
                    <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mb-2 font-bold text-primary">{step.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="top-doctors" className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <span className="mb-2 block text-xs font-bold text-accent">اختيارات تجريبية</span>
                <h2 className="text-2xl font-black text-primary sm:text-3xl">
                  الأطباء الأعلى تقييمًا
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                الأسماء والتقييمات بيانات تجريبية لأغراض العرض فقط.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {doctors.map((doctor) => (
                <article
                  key={doctor.name}
                  className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5"
                >
                  <div className="mb-5 flex gap-4">
                    <img
                      src={doctor.photo}
                      alt={`صورة تجريبية لـ ${doctor.name}`}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="size-24 shrink-0 rounded-2xl object-cover sm:size-28"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-primary">{doctor.name}</h3>
                        <span className="flex items-center gap-1 text-xs font-bold text-success">
                          <ShieldCheck className="size-4" />
                          موثّق
                        </span>
                      </div>
                      <p className="mb-3 text-xs leading-5 text-muted-foreground">{doctor.title}</p>
                      <div className="mb-2 flex items-center gap-2">
                        <Star className="size-4 fill-chart-4 text-chart-4" />
                        <span className="text-xs font-bold text-primary">{doctor.rating}</span>
                        <span className="text-[11px] text-muted-foreground">
                          ({doctor.reviews} تقييم)
                        </span>
                      </div>
                      <div className="text-sm font-bold text-accent">كشف: {doctor.price} جنيه</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled
                      className="flex-1 cursor-not-allowed rounded-xl bg-accent py-3 text-sm font-bold text-accent-foreground opacity-75"
                    >
                      الحجز قريبًا
                    </button>
                    <button
                      type="button"
                      disabled
                      aria-label="إضافة إلى المفضلة - قريبًا"
                      className="cursor-not-allowed rounded-xl border border-border bg-secondary px-4 py-3 text-primary opacity-75"
                    >
                      <Heart className="size-5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="join-doctor" className="scroll-mt-24 px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
          <div className="relative mx-auto overflow-hidden rounded-[2rem] bg-primary px-6 py-10 text-primary-foreground sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14">
            <div className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative mb-7 max-w-2xl lg:mb-0">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-card/10 px-3 py-1.5 text-xs font-bold">
                <BadgeCheck className="size-4 text-accent" />
                للأطباء والعيادات
              </span>
              <h2 className="mb-3 text-3xl font-black">انضم إلى دلّني كطبيب</h2>
              <p className="text-sm leading-7 text-primary-foreground/70">
                أنشئ حضورًا مهنيًا موثّقًا، نظّم مواعيدك، ووصل إلى المرضى الباحثين عن تخصصك في كفر
                صقر.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="relative w-full cursor-not-allowed rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground opacity-80 lg:w-auto"
            >
              التسجيل يفتح قريبًا
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 text-xl font-black text-primary">دلّني</div>
              <p className="max-w-xl text-xs leading-6 text-muted-foreground">
                تنبيه طبي: «دلّني» أداة مساعدة لاختيار التخصص وحجز الأطباء فقط. المنصة لا تقدم
                تشخيصًا أو علاجًا ولا تغني عن استشارة الطبيب المختص.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span title="تُضاف في مرحلة الصفحات القانونية">سياسة الخصوصية</span>
              <span title="تُضاف في مرحلة الصفحات القانونية">الشروط والأحكام</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">© دلّني — نموذج أولي قيد التطوير.</p>
        </div>
      </footer>

      <div className="fixed bottom-5 left-5 z-50">
        <button
          type="button"
          disabled
          aria-label="التواصل عبر واتساب - قريبًا"
          title="يُفعّل بعد إضافة رقم التواصل"
          className="flex size-14 cursor-not-allowed items-center justify-center rounded-full bg-whatsapp text-accent-foreground opacity-80 shadow-[var(--shadow-cta)]"
        >
          <MessageCircle className="size-7" />
        </button>
      </div>
    </div>
  );
}
