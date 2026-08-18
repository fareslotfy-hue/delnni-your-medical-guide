import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  Check,
  CircleUserRound,
  ClipboardPenLine,
  Frown,
  HeartPulse,
  Info,
  Meh,
  MessageSquareText,
  ShieldCheck,
  Smile,
  Stethoscope,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { doctorImages } from "@/lib/doctor-assets";
import { doctors } from "@/lib/doctor-ranking";

export const Route = createFileRoute("/health-journey")({
  head: () => ({
    meta: [
      { title: "رحلتي الصحية | دلّني" },
      {
        name: "description",
        content: "سجل مبسط لزياراتك السابقة وملاحظاتك الشخصية بعد الزيارة.",
      },
    ],
  }),
  component: HealthJourneyPage,
});

type DemoPatient = { name: string; phone: string };
type Outcome = "better" | "same" | "worse";
type StoredBooking = {
  id: string;
  doctorId: string;
  slot: string;
  patientName: string;
  status: string;
  followUpDate?: string;
};
type JourneyEntry = {
  bookingId: string;
  outcome: Outcome;
  note: string;
  updatedAt: string;
};

const outcomes = [
  {
    value: "better" as const,
    label: "أفضل",
    icon: Smile,
    className: "border-success bg-success/10 text-success",
  },
  {
    value: "same" as const,
    label: "كما أنا",
    icon: Meh,
    className: "border-chart-4 bg-chart-4/10 text-chart-4",
  },
  {
    value: "worse" as const,
    label: "أسوأ",
    icon: Frown,
    className: "border-destructive bg-destructive/10 text-destructive",
  },
];

function HealthJourneyPage() {
  const [patient, setPatient] = useState<DemoPatient | null | undefined>(undefined);
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [entries, setEntries] = useState<JourneyEntry[]>([]);

  useEffect(() => {
    try {
      const rawPatient = sessionStorage.getItem("delnni_demo_patient");
      const rawBookings = sessionStorage.getItem("delnni_demo_bookings");
      const rawEntries = sessionStorage.getItem("delnni_demo_health_journey");
      setPatient(rawPatient ? (JSON.parse(rawPatient) as DemoPatient) : null);
      setBookings(rawBookings ? (JSON.parse(rawBookings) as StoredBooking[]) : []);
      setEntries(rawEntries ? (JSON.parse(rawEntries) as JourneyEntry[]) : []);
    } catch {
      setPatient(null);
    }
  }, []);

  const completedVisits = useMemo(
    () => bookings.filter((booking) => booking.status === "completed"),
    [bookings],
  );

  const saveEntry = (entry: JourneyEntry) => {
    const next = [...entries.filter((item) => item.bookingId !== entry.bookingId), entry];
    setEntries(next);
    sessionStorage.setItem("delnni_demo_health_journey", JSON.stringify(next));
  };

  if (patient === undefined) {
    return <main className="min-h-screen bg-background" aria-label="جارٍ تحميل الرحلة الصحية" />;
  }

  if (!patient) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <section className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
          <HeartPulse className="mx-auto mb-4 size-12 text-accent" />
          <h1 className="text-2xl font-black text-primary">سجّل الدخول لعرض رحلتك الصحية</h1>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            الزيارات والملاحظات الشخصية مرتبطة بحساب المريض ولا تظهر للعامة.
          </p>
          <Link
            to="/account"
            search={{ returnTo: "/health-journey" }}
            className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground"
          >
            تسجيل الدخول أو إنشاء حساب
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/patient"
            aria-label="العودة إلى حساب المريض"
            className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <ArrowRight className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-black text-primary">رحلتي الصحية</h1>
            <p className="text-[10px] text-muted-foreground">
              متابعة شخصية مبسطة — ليست سجلًا طبيًا
            </p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-[10px] font-black text-success sm:flex">
            <ShieldCheck className="size-4" />
            خاصة بحسابك
          </span>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground shadow-[var(--shadow-cta)] sm:p-8">
            <HeartPulse className="absolute -bottom-8 -left-6 size-36 text-primary-foreground/5" />
            <div className="relative max-w-2xl">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-card/10 px-3 py-1.5 text-[10px] font-black">
                <CircleUserRound className="size-4" />
                {patient.name}
              </span>
              <h2 className="text-2xl font-black sm:text-3xl">تابع إحساسك بعد الزيارة ببساطة</h2>
              <p className="mt-3 text-xs leading-7 text-primary-foreground/70">
                سجل ملاحظة شخصية تساعدك تتذكر تطور حالتك عند زيارتك القادمة. لا نستخدمها لتشخيصك أو
                اقتراح علاج.
              </p>
            </div>
          </section>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={CalendarCheck2}
              label="الزيارات السابقة"
              value={completedVisits.length}
            />
            <StatCard icon={ClipboardPenLine} label="المتابعات المسجلة" value={entries.length} />
            <StatCard
              icon={CalendarClock}
              label="مواعيد متابعة"
              value={completedVisits.filter((item) => item.followUpDate).length}
            />
          </div>

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-black text-primary">الزيارات السابقة</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                تظهر الزيارة هنا تلقائيًا بعد انتهاء الموعد وتأكيد اكتمالها.
              </p>
            </div>

            {completedVisits.length ? (
              <div className="space-y-4">
                {completedVisits.map((booking) => (
                  <VisitCard
                    key={booking.id}
                    booking={booking}
                    entry={entries.find((item) => item.bookingId === booking.id)}
                    onSave={saveEntry}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-input bg-card p-8 text-center">
                <Stethoscope className="mx-auto mb-3 size-11 text-muted-foreground/40" />
                <h3 className="font-black text-primary">لا توجد زيارات مكتملة بعد</h3>
                <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-muted-foreground">
                  الحجوزات المدفوعة لا تُضاف للرحلة الصحية إلا بعد انتهاء الزيارة، حتى تظل البيانات
                  دقيقة.
                </p>
                <Link
                  to="/patient"
                  className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-xs font-black text-primary-foreground"
                >
                  عرض حجوزاتي
                </Link>
              </div>
            )}
          </section>

          <div className="mt-6 flex gap-2 rounded-3xl border border-accent/15 bg-accent/5 p-4 text-[11px] leading-6 text-muted-foreground">
            <Info className="mt-1 size-4 shrink-0 text-accent" />
            <p>
              «رحلتي الصحية» ليست ملفًا طبيًا إلكترونيًا، ولا تقدم تشخيصًا أو علاجًا، ولا تغني عن
              مراجعة الطبيب. عند تدهور حالتك تواصل مع طبيب أو جهة طوارئ مناسبة.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof HeartPulse;
  label: string;
  value: number;
}) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xl font-black text-primary">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </article>
  );
}

function VisitCard({
  booking,
  entry,
  onSave,
}: {
  booking: StoredBooking;
  entry: JourneyEntry | undefined;
  onSave: (entry: JourneyEntry) => void;
}) {
  const doctor = doctors.find((item) => item.id === booking.doctorId);
  const [outcome, setOutcome] = useState<Outcome | "">(entry?.outcome ?? "");
  const [note, setNote] = useState(entry?.note ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  if (!doctor) return null;

  const submit = () => {
    if (!outcome) {
      setError("اختر حالتك بعد الزيارة أولًا");
      return;
    }
    onSave({
      bookingId: booking.id,
      outcome,
      note: note.trim().slice(0, 500),
      updatedAt: new Date().toISOString(),
    });
    setError("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="p-4 sm:p-6">
        <div className="flex gap-4">
          <img
            src={doctorImages[doctor.image]}
            alt={`صورة ${doctor.name}`}
            className="h-24 w-20 rounded-2xl object-cover object-top"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-primary">{doctor.name}</h3>
            <p className="mt-1 text-[11px] font-bold text-accent">{doctor.specialty}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarCheck2 className="size-3.5 text-accent" />
                {booking.slot}
              </span>
              <span className="flex items-center gap-1">
                <CircleUserRound className="size-3.5 text-accent" />
                {booking.patientName}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              موعد المتابعة: {booking.followUpDate || "لم يحدد"}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <h4 className="text-sm font-black text-primary">كيف تشعر مقارنةً بقبل الزيارة؟</h4>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {outcomes.map((item) => {
              const Icon = item.icon;
              const selected = outcome === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setOutcome(item.value);
                    setError("");
                  }}
                  aria-pressed={selected}
                  className={`flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border text-xs font-black transition ${selected ? item.className : "border-input bg-background text-muted-foreground"}`}
                >
                  <Icon className="size-6" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <label className="mt-4 block text-xs font-black text-primary">
            ملاحظة شخصية <span className="font-normal text-muted-foreground">(اختيارية)</span>
            <span className="relative mt-2 block">
              <MessageSquareText className="absolute top-3 right-3 size-4 text-muted-foreground" />
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value.slice(0, 500))}
                rows={3}
                placeholder="مثال: الألم أخف وأقدر أتحرك بصورة أفضل..."
                className="w-full resize-none rounded-2xl border border-input bg-background py-3 pr-10 pl-3 text-sm leading-6 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
              />
            </span>
            <span
              className="mt-1 block text-left text-[9px] font-normal text-muted-foreground"
              dir="ltr"
            >
              {note.length}/500
            </span>
          </label>
          {error && <p className="mt-2 text-xs font-bold text-destructive">{error}</p>}
          <button
            type="button"
            onClick={submit}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-black text-primary-foreground"
          >
            {saved ? <Check className="size-4" /> : <ClipboardPenLine className="size-4" />}
            {saved ? "تم حفظ المتابعة" : entry ? "تحديث المتابعة" : "حفظ المتابعة"}
          </button>
        </div>
      </div>
    </article>
  );
}
