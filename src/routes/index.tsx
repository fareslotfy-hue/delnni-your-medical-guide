import { createFileRoute } from "@tanstack/react-router";
import { Search, Stethoscope, User, MessageCircle, Star, ShieldCheck, Heart } from "lucide-react";

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

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* شريط علوي */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card/80 px-6 py-4 backdrop-blur-md">
        <span className="text-2xl font-black tracking-tight text-primary">دلّني</span>
        <div className="flex items-center gap-3">
          <button
            aria-label="حسابي"
            className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <User className="size-5" />
          </button>
          <button className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-accent-foreground">
            انضم كطبيب
          </button>
        </div>
      </nav>

      {/* الواجهة الرئيسية */}
      <header className="bg-gradient-to-b from-card to-background px-6 pt-10 pb-16">
        <div className="mx-auto max-w-xl text-center">
          <span className="mb-6 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold tracking-wide text-accent">
            الآن في الشرقية - كفر صقر
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-primary">
            مش عارف تروح لدكتور إيه؟
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            دلّني يساعدك توصل للتخصص والطبيب المناسب بناءً على أعراضك، بكل سهولة وأمان.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <button className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:border-accent">
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                <Search className="size-6" />
              </span>
              <span className="text-right">
                <span className="block font-bold text-primary">ابحث عن طبيب</span>
                <span className="block text-xs text-muted-foreground">
                  بالاسم، التخصص، أو المنطقة
                </span>
              </span>
            </button>

            <button className="flex w-full items-center gap-4 rounded-2xl bg-primary p-5 text-primary-foreground shadow-[var(--shadow-cta)] transition-all active:scale-[0.98]">
              <span className="flex size-12 items-center justify-center rounded-xl bg-card/10">
                <Stethoscope className="size-6" />
              </span>
              <span className="text-right">
                <span className="block font-bold">ساعدني أختار التخصص</span>
                <span className="block text-xs text-primary-foreground/60">
                  حدد مكان الألم والأعراض
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* الجسم 3D */}
      <section className="px-6 py-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8">
          <div className="relative z-10 max-w-sm">
            <h2 className="mb-3 text-2xl font-bold text-primary">استكشف جسمك 3D</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              اضغط على مكان الألم وسنقوم بتوجيهك للتخصص الصحيح فوراً.
            </p>
            <button className="rounded-xl border border-input bg-background px-6 py-3 text-sm font-bold text-primary">
              بدء الفحص البصري
            </button>
          </div>

          <div className="pointer-events-none absolute -bottom-10 -left-10 aspect-[3/4] w-64 opacity-20 lg:opacity-100">
            <img
              src={body3d}
              alt="نموذج الجسم البشري التفاعلي"
              loading="lazy"
              width={512}
              height={800}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* التخصصات */}
      <section className="px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-primary">التخصصات الشائعة</h3>
          <button className="text-sm font-bold text-accent">الكل</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {specialties.map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-3">
              <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-2xl shadow-[var(--shadow-card)]">
                {s.emoji}
              </div>
              <span className="text-xs font-bold text-primary">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* الأطباء */}
      <section className="px-6 py-8 pb-24">
        <h3 className="mb-6 text-xl font-bold text-primary">الأطباء الأعلى تقييماً</h3>
        <p className="mb-4 text-[11px] text-muted-foreground">بيانات تجريبية لأغراض العرض فقط.</p>

        {doctors.map((d) => (
          <div
            key={d.name}
            className="mb-4 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="mb-4 flex gap-4">
              <img
                src={d.photo}
                alt={`صورة ${d.name}`}
                loading="lazy"
                width={512}
                height={512}
                className="size-24 shrink-0 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <h4 className="font-bold text-primary">{d.name}</h4>
                  <span className="flex items-center gap-1 text-xs font-bold text-success">
                    <ShieldCheck className="size-4" />
                    موثّق
                  </span>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">{d.title}</p>
                <div className="mb-2 flex items-center gap-2">
                  <Star className="size-4 fill-chart-4 text-chart-4" />
                  <span className="text-xs font-bold text-primary">{d.rating}</span>
                  <span className="text-[10px] text-muted-foreground">({d.reviews} تقييم)</span>
                </div>
                <div className="text-sm font-bold text-accent">كشف: {d.price} جنيه</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 rounded-xl bg-accent py-3 text-sm font-bold text-accent-foreground shadow-[var(--shadow-card)]">
                احجز الآن
              </button>
              <button
                aria-label="أضف إلى المفضلة"
                className="rounded-xl border border-border bg-secondary px-4 py-3 text-primary"
              >
                <Heart className="size-5" />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* تنبيه طبي */}
      <footer className="border-t border-border bg-card px-6 py-8 text-center">
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          تنبيه طبي: منصة «دلّني» هي أداة مساعدة لاختيار التخصص وحجز الأطباء فقط. المنصة لا تقدم
          تشخيصاً طبياً ولا تغني عن استشارة الطبيب المختص.
        </p>
        <div className="mt-6 flex justify-center gap-6">
          <a href="#" className="text-xs text-muted-foreground underline">
            سياسة الخصوصية
          </a>
          <a href="#" className="text-xs text-muted-foreground underline">
            الشروط والأحكام
          </a>
        </div>
      </footer>

      {/* واتساب */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          aria-label="تواصل معنا عبر واتساب"
          className="flex size-14 items-center justify-center rounded-full bg-whatsapp text-accent-foreground shadow-[var(--shadow-cta)]"
        >
          <MessageCircle className="size-7" />
        </button>
      </div>
    </div>
  );
}
