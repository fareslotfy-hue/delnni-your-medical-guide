import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  CircleUserRound,
  Clock3,
  CreditCard,
  Heart,
  History,
  Hourglass,
  Info,
  LogOut,
  MapPin,
  Phone,
  ReceiptText,
  Settings,
  Stethoscope,
  UserRoundPlus,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { doctorImages } from "@/lib/doctor-assets";
import { doctors } from "@/lib/doctor-ranking";

export const Route = createFileRoute("/patient")({
  head: () => ({
    meta: [
      { title: "حسابي وحجوزاتي | دلّني" },
      {
        name: "description",
        content: "تابع حجوزاتك القادمة والمدفوعات وأفراد العائلة من حساب المريض.",
      },
    ],
  }),
  component: PatientDashboard,
});

type DashboardSection = "bookings" | "family" | "favorites" | "profile";
type BookingFilter = "all" | "upcoming" | "awaiting_payment" | "payment_review" | "past";
type PaymentStatus =
  | "awaiting_payment"
  | "payment_review"
  | "payment_rejected"
  | "confirmed"
  | "rescheduled"
  | "doctor_cancelled"
  | "no_show"
  | "refunded"
  | "completed";

type DemoPatient = { name: string; phone: string };
type FamilyMember = { id: string; name: string; relationship: string };
type StoredBooking = {
  id: string;
  doctorId: string;
  slot: string;
  patientName: string;
  status: PaymentStatus;
  payment?: { fileName: string; submittedAt: string };
  rejectionReason?: string;
};

const statusDetails: Record<
  PaymentStatus,
  { label: string; className: string; icon: typeof Clock3; group: "upcoming" | "past" }
> = {
  awaiting_payment: {
    label: "في انتظار الدفع",
    className: "bg-chart-4/10 text-chart-4",
    icon: CreditCard,
    group: "upcoming",
  },
  payment_review: {
    label: "في انتظار مراجعة الدفع",
    className: "bg-accent/10 text-accent",
    icon: Hourglass,
    group: "upcoming",
  },
  payment_rejected: {
    label: "إثبات الدفع مرفوض",
    className: "bg-destructive/10 text-destructive",
    icon: XCircle,
    group: "upcoming",
  },
  confirmed: {
    label: "الحجز مؤكد",
    className: "bg-success/10 text-success",
    icon: CheckCircle2,
    group: "upcoming",
  },
  rescheduled: {
    label: "تم تغيير الموعد",
    className: "bg-primary/10 text-primary",
    icon: CalendarClock,
    group: "upcoming",
  },
  doctor_cancelled: {
    label: "ألغاه الطبيب",
    className: "bg-destructive/10 text-destructive",
    icon: XCircle,
    group: "past",
  },
  no_show: {
    label: "لم يحضر المريض",
    className: "bg-muted text-muted-foreground",
    icon: History,
    group: "past",
  },
  refunded: {
    label: "تم رد المبلغ",
    className: "bg-success/10 text-success",
    icon: ReceiptText,
    group: "past",
  },
  completed: {
    label: "زيارة مكتملة",
    className: "bg-secondary text-primary",
    icon: CheckCircle2,
    group: "past",
  },
};

function PatientDashboard() {
  const [patient, setPatient] = useState<DemoPatient | null | undefined>(undefined);
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [section, setSection] = useState<DashboardSection>("bookings");
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [familyError, setFamilyError] = useState("");

  useEffect(() => {
    try {
      const rawPatient = sessionStorage.getItem("delnni_demo_patient");
      const rawBookings = sessionStorage.getItem("delnni_demo_bookings");
      const rawFamily = sessionStorage.getItem("delnni_demo_family");
      setPatient(rawPatient ? (JSON.parse(rawPatient) as DemoPatient) : null);
      setBookings(rawBookings ? (JSON.parse(rawBookings) as StoredBooking[]) : []);
      setFamily(rawFamily ? (JSON.parse(rawFamily) as FamilyMember[]) : []);
    } catch {
      setPatient(null);
    }
  }, []);

  const counts = useMemo(
    () => ({
      all: bookings.length,
      upcoming: bookings.filter((item) => statusDetails[item.status].group === "upcoming").length,
      awaiting_payment: bookings.filter((item) => item.status === "awaiting_payment").length,
      payment_review: bookings.filter((item) => item.status === "payment_review").length,
      past: bookings.filter((item) => statusDetails[item.status].group === "past").length,
    }),
    [bookings],
  );

  const visibleBookings = useMemo(() => {
    if (filter === "all") return bookings;
    if (filter === "upcoming" || filter === "past") {
      return bookings.filter((item) => statusDetails[item.status].group === filter);
    }
    return bookings.filter((item) => item.status === filter);
  }, [bookings, filter]);

  const logout = () => {
    sessionStorage.removeItem("delnni_demo_patient");
    window.location.assign("/");
  };

  const addFamilyMember = () => {
    if (familyName.trim().length < 3 || !relationship) {
      setFamilyError("اكتب الاسم وحدد صلة القرابة");
      return;
    }
    const next = [...family, { id: `FM-${Date.now()}`, name: familyName.trim(), relationship }];
    setFamily(next);
    sessionStorage.setItem("delnni_demo_family", JSON.stringify(next));
    setFamilyName("");
    setRelationship("");
    setFamilyError("");
    setShowFamilyForm(false);
  };

  if (patient === undefined) {
    return <main className="min-h-screen bg-background" aria-label="جارٍ تحميل حساب المريض" />;
  }

  if (!patient) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <section className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
          <CircleUserRound className="mx-auto mb-4 size-12 text-accent" />
          <h1 className="text-2xl font-black text-primary">سجّل الدخول لعرض حسابك</h1>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            حجوزاتك وبياناتك لا تظهر إلا بعد تسجيل الدخول.
          </p>
          <Link
            to="/account"
            search={{ returnTo: "/patient" }}
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
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            aria-label="العودة للرئيسية"
            className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <ArrowRight className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-black text-primary">أهلًا، {patient.name}</h1>
            <p className="text-[10px] text-muted-foreground">
              حساب المريض — بيانات تجريبية في هذه الجلسة
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-input px-3 text-xs font-black text-destructive"
          >
            <LogOut className="size-4" />
            خروج
          </button>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[15rem_1fr] lg:items-start">
          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-3xl border border-border bg-card p-5 text-center shadow-[var(--shadow-card)]">
              <span className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CircleUserRound className="size-9" />
              </span>
              <h2 className="truncate text-sm font-black text-primary">{patient.name}</h2>
              <p className="mt-1 text-[11px] text-muted-foreground" dir="ltr">
                {patient.phone}
              </p>
            </section>
            <nav
              className="grid grid-cols-2 gap-2 rounded-3xl border border-border bg-card p-2 shadow-[var(--shadow-card)] lg:grid-cols-1"
              aria-label="أقسام حساب المريض"
            >
              {(
                [
                  ["bookings", "حجوزاتي", CalendarCheck2],
                  ["family", "أفراد العائلة", UsersRound],
                  ["favorites", "المفضلة", Heart],
                  ["profile", "بيانات الحساب", Settings],
                ] as const
              ).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSection(value)}
                  className={`flex min-h-11 items-center gap-2 rounded-2xl px-3 text-xs font-black ${section === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <div>
            {section === "bookings" && (
              <section>
                <div className="mb-5">
                  <h2 className="text-2xl font-black text-primary">حجوزاتي</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    تابع حالة الموعد والدفع، واستكمل الإجراء المطلوب.
                  </p>
                </div>
                <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
                  {(
                    [
                      ["all", "الكل"],
                      ["upcoming", "القادمة"],
                      ["awaiting_payment", "انتظار الدفع"],
                      ["payment_review", "مراجعة الدفع"],
                      ["past", "السابقة"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilter(value)}
                      className={`min-h-10 shrink-0 rounded-xl px-3 text-[11px] font-black ${filter === value ? "bg-accent text-accent-foreground" : "border border-input bg-card text-primary"}`}
                    >
                      {label} ({counts[value]})
                    </button>
                  ))}
                </div>
                {visibleBookings.length ? (
                  <div className="space-y-4">
                    {visibleBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-dashed border-input bg-card p-8 text-center">
                    <CalendarClock className="mx-auto mb-3 size-10 text-muted-foreground/40" />
                    <h3 className="font-black text-primary">لا توجد حجوزات في هذا القسم</h3>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      ابدأ بالبحث عن الطبيب المناسب واختيار الموعد.
                    </p>
                    <Link
                      to="/search"
                      className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-xs font-black text-primary-foreground"
                    >
                      ابحث عن طبيب
                    </Link>
                  </div>
                )}
              </section>
            )}

            {section === "family" && (
              <section className="rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-primary">أفراد العائلة</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      أضف الأشخاص الذين تحجز لهم بصورة متكررة.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFamilyForm((value) => !value)}
                    className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-black text-primary-foreground"
                  >
                    <UserRoundPlus className="size-4" />
                    إضافة
                  </button>
                </div>
                {showFamilyForm && (
                  <div className="mt-5 grid gap-3 rounded-2xl bg-secondary p-4 sm:grid-cols-2">
                    <input
                      value={familyName}
                      onChange={(event) => setFamilyName(event.target.value)}
                      placeholder="اسم المريض"
                      className="min-h-12 rounded-xl border border-input bg-card px-3 text-sm outline-none focus:border-accent"
                    />
                    <select
                      value={relationship}
                      onChange={(event) => setRelationship(event.target.value)}
                      className="min-h-12 rounded-xl border border-input bg-card px-3 text-sm"
                    >
                      <option value="">صلة القرابة</option>
                      <option>ابني</option>
                      <option>ابنتي</option>
                      <option>والدتي</option>
                      <option>والدي</option>
                      <option>شخص آخر</option>
                    </select>
                    {familyError && (
                      <p className="text-xs font-bold text-destructive sm:col-span-2">
                        {familyError}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={addFamilyMember}
                      className="min-h-11 rounded-xl bg-accent text-xs font-black text-accent-foreground sm:col-span-2"
                    >
                      حفظ فرد العائلة
                    </button>
                  </div>
                )}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {family.map((member) => (
                    <article
                      key={member.id}
                      className="flex items-center gap-3 rounded-2xl border border-border p-4"
                    >
                      <span className="flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <CircleUserRound className="size-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-black text-primary">{member.name}</h3>
                        <p className="text-[11px] text-muted-foreground">{member.relationship}</p>
                      </div>
                    </article>
                  ))}
                  {family.length === 0 && (
                    <p className="rounded-2xl bg-secondary p-5 text-center text-xs text-muted-foreground sm:col-span-2">
                      لم تضف أفراد عائلة بعد.
                    </p>
                  )}
                </div>
              </section>
            )}

            {section === "favorites" && (
              <EmptyPanel
                icon={Heart}
                title="المفضلة"
                description="عند تفعيل القلب في صفحة الطبيب ستظهر اختياراتك المحفوظة هنا."
              />
            )}
            {section === "profile" && (
              <section className="rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7">
                <h2 className="text-xl font-black text-primary">بيانات الحساب</h2>
                <dl className="mt-5 divide-y divide-border rounded-2xl bg-secondary px-4 text-sm">
                  <div className="flex justify-between gap-3 py-4">
                    <dt className="text-muted-foreground">الاسم</dt>
                    <dd className="font-black text-primary">{patient.name}</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-4">
                    <dt className="text-muted-foreground">رقم الهاتف</dt>
                    <dd className="font-black text-primary" dir="ltr">
                      {patient.phone}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 py-4">
                    <dt className="text-muted-foreground">المنطقة</dt>
                    <dd className="font-black text-primary">الشرقية — كفر صقر</dd>
                  </div>
                </dl>
                <p className="mt-4 flex gap-2 text-[11px] leading-6 text-muted-foreground">
                  <Info className="mt-1 size-4 shrink-0 text-accent" />
                  تعديل البيانات الرئيسية وكلمة المرور سيتفعّل مع ربط الحساب بقاعدة البيانات.
                </p>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function BookingCard({ booking }: { booking: StoredBooking }) {
  const doctor = doctors.find((item) => item.id === booking.doctorId);
  if (!doctor) return null;
  const status = statusDetails[booking.status];
  const StatusIcon = status.icon;
  const needsPayment =
    booking.status === "awaiting_payment" || booking.status === "payment_rejected";

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="p-4 sm:p-5">
        <div className="flex gap-4">
          <img
            src={doctorImages[doctor.image]}
            alt={`صورة ${doctor.name}`}
            className="h-24 w-20 rounded-2xl object-cover object-top"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-black text-primary">{doctor.name}</h3>
                <p className="mt-1 text-[11px] font-bold text-accent">{doctor.specialty}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${status.className}`}
              >
                <StatusIcon className="size-3.5" />
                {status.label}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock3 className="size-3.5 text-accent" />
                {booking.slot}
              </span>
              <span className="flex items-center gap-1">
                <CircleUserRound className="size-3.5 text-accent" />
                {booking.patientName}
              </span>
              <span dir="ltr">{booking.id}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border bg-secondary/40 p-3 sm:px-5">
        {needsPayment && (
          <Link
            to="/payment/$bookingId"
            params={{ bookingId: booking.id }}
            className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-black text-primary-foreground"
          >
            <CreditCard className="size-4" />
            {booking.status === "payment_rejected" ? "رفع إثبات جديد" : "استكمال الدفع"}
          </Link>
        )}
        {booking.status === "confirmed" && (
          <>
            <button
              type="button"
              disabled
              className="flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-input px-4 text-xs font-black text-muted-foreground"
            >
              <CalendarClock className="size-4" />
              تغيير الموعد مرة واحدة
            </button>
            <button
              type="button"
              disabled
              className="flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-success/10 px-4 text-xs font-black text-success"
            >
              <Phone className="size-4" />
              واتساب العيادة
            </button>
          </>
        )}
        {booking.status === "payment_review" && (
          <p className="flex min-h-10 flex-1 items-center gap-2 text-[11px] font-bold text-accent">
            <Hourglass className="size-4" />
            الإدارة تراجع إثبات التحويل الآن.
          </p>
        )}
      </div>
    </article>
  );
}

function EmptyPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Heart;
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-[2rem] border border-dashed border-input bg-card p-8 text-center">
      <Icon className="mx-auto mb-3 size-10 text-muted-foreground/40" />
      <h2 className="text-xl font-black text-primary">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-muted-foreground">{description}</p>
    </section>
  );
}
