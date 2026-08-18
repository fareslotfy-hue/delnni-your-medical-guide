import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleUserRound,
  Clock3,
  Info,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { doctorImages } from "@/lib/doctor-assets";
import { doctorProfiles } from "@/lib/doctor-profiles";
import { doctors } from "@/lib/doctor-ranking";

export const Route = createFileRoute("/booking/$doctorId")({
  head: () => ({
    meta: [
      { title: "حجز موعد | دلّني" },
      { name: "description", content: "اختر موعدك وراجع بيانات حجز الطبيب على دلّني." },
    ],
  }),
  component: BookingPage,
});

type DemoPatient = { name: string; phone: string };
type BookingStep = 1 | 2 | 3 | 4;

type StoredBooking = {
  id: string;
  doctorId: string;
  slot: string;
  patientName: string;
  status: "awaiting_payment";
};

function BookingPage() {
  const { doctorId } = Route.useParams();
  const doctor = doctors.find((item) => item.id === doctorId);
  const profile = doctorProfiles[doctorId];
  const [patient, setPatient] = useState<DemoPatient | null | undefined>(undefined);
  const [step, setStep] = useState<BookingStep>(1);
  const [slot, setSlot] = useState("");
  const [patientChoice, setPatientChoice] = useState<"self" | "other">("self");
  const [otherName, setOtherName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    const rawPatient = sessionStorage.getItem("delnni_demo_patient");
    const rawBookings = sessionStorage.getItem("delnni_demo_bookings");
    try {
      setPatient(rawPatient ? (JSON.parse(rawPatient) as DemoPatient) : null);
      const bookings = rawBookings ? (JSON.parse(rawBookings) as StoredBooking[]) : [];
      setBookedSlots(
        bookings.filter((booking) => booking.doctorId === doctorId).map((booking) => booking.slot),
      );
    } catch {
      setPatient(null);
    }
  }, [doctorId]);

  const patientName = patientChoice === "self" ? (patient?.name ?? "المريض") : otherName.trim();
  const deposit = useMemo(() => (doctor ? doctor.price / 2 : 0), [doctor]);
  const commission = useMemo(() => (doctor ? doctor.price * 0.05 : 0), [doctor]);

  if (!doctor || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
        <section className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <Stethoscope className="mx-auto mb-3 size-10 text-muted-foreground" />
          <h1 className="font-black text-primary">تعذر العثور على الطبيب</h1>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-xs font-black text-primary-foreground"
          >
            العودة للرئيسية
          </Link>
        </section>
      </main>
    );
  }

  if (patient === undefined) {
    return <main className="min-h-screen bg-background" aria-label="جارٍ تحميل بيانات الحساب" />;
  }

  if (patient === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <section className="w-full max-w-md rounded-[2rem] border border-border bg-card p-7 text-center shadow-[var(--shadow-card)] sm:p-9">
          <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <LockKeyhole className="size-8" />
          </span>
          <h1 className="text-2xl font-black text-primary">سجّل الدخول لإتمام الحجز</h1>
          <p className="mt-3 text-xs leading-7 text-muted-foreground">
            تقدر تبحث وتشوف الأطباء بدون حساب. نطلب تسجيل الدخول فقط عند بدء الحجز لحفظ الموعد
            وبيانات المريض.
          </p>
          <Link
            to="/account"
            search={{ returnTo: `/booking/${doctorId}` }}
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
          >
            تسجيل الدخول أو إنشاء حساب
          </Link>
          <button
            type="button"
            onClick={() => history.back()}
            className="mt-3 min-h-11 text-xs font-black text-accent"
          >
            الرجوع إلى الطبيب
          </button>
        </section>
      </main>
    );
  }

  const goToPatient = () => {
    if (!slot) {
      setError("اختر موعدًا متاحًا أولًا");
      return;
    }
    setError("");
    setStep(2);
  };

  const goToReview = () => {
    if (patientChoice === "other" && (!otherName.trim() || !relationship)) {
      setError("اكتب اسم المريض وحدد صلة القرابة");
      return;
    }
    setError("");
    setStep(3);
  };

  const confirmBooking = () => {
    const raw = sessionStorage.getItem("delnni_demo_bookings");
    const bookings = raw ? (JSON.parse(raw) as StoredBooking[]) : [];
    if (bookings.some((booking) => booking.doctorId === doctorId && booking.slot === slot)) {
      setBookedSlots((current) => [...new Set([...current, slot])]);
      setError("هذا الموعد حُجز بالفعل في هذه الجلسة. اختر موعدًا آخر.");
      setStep(1);
      return;
    }
    const id = `DL-${Date.now().toString().slice(-7)}`;
    bookings.push({ id, doctorId, slot, patientName, status: "awaiting_payment" });
    sessionStorage.setItem("delnni_demo_bookings", JSON.stringify(bookings));
    setBookingId(id);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => history.back()}
            aria-label="العودة"
            className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <ArrowRight className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-black text-primary">حجز موعد مع {doctor.name}</h1>
            <p className="text-[10px] text-muted-foreground">نظام حجز تجريبي — المرحلة التاسعة</p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-[10px] font-black text-success sm:flex">
            <ShieldCheck className="size-4" />
            حساب مسجّل
          </span>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_18rem] lg:items-start">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-8">
            <ol className="mb-8 flex items-center" aria-label="خطوات الحجز">
              {[1, 2, 3, 4].map((item, index) => (
                <li key={item} className={`flex items-center ${index < 3 ? "flex-1" : ""}`}>
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${step >= item ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}
                  >
                    {step > item ? <Check className="size-4" /> : item}
                  </span>
                  {index < 3 && (
                    <span className={`h-0.5 flex-1 ${step > item ? "bg-accent" : "bg-border"}`} />
                  )}
                </li>
              ))}
            </ol>

            {step === 1 && (
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black text-primary">
                  <CalendarDays className="size-6 text-accent" />
                  اختر الموعد المناسب
                </h2>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  مدة الموعد التجريبية 20 دقيقة. المواعيد المحجوزة غير قابلة للاختيار.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {profile.availableSlots.map((item) => {
                    const booked = bookedSlots.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        disabled={booked}
                        onClick={() => {
                          setSlot(item);
                          setError("");
                        }}
                        className={`min-h-14 rounded-2xl border px-4 text-right text-xs font-black transition ${booked ? "cursor-not-allowed border-border bg-secondary text-muted-foreground line-through" : slot === item ? "border-accent bg-accent/10 text-accent ring-2 ring-accent/10" : "border-input bg-background text-primary hover:border-accent/40"}`}
                      >
                        <Clock3 className="ml-2 inline size-4" />
                        {item} {booked && "— محجوز"}
                      </button>
                    );
                  })}
                </div>
                {error && (
                  <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-xs font-bold text-destructive">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={goToPatient}
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
                >
                  التالي: اختيار المريض <ChevronLeft className="size-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black text-primary">
                  <UsersRound className="size-6 text-accent" />
                  الحجز لمَن؟
                </h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPatientChoice("self")}
                    className={`rounded-2xl border p-4 text-right ${patientChoice === "self" ? "border-accent bg-accent/10" : "border-input"}`}
                  >
                    <CircleUserRound className="mb-3 size-6 text-accent" />
                    <b className="block text-sm text-primary">لنفسي</b>
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {patient.name}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientChoice("other")}
                    className={`rounded-2xl border p-4 text-right ${patientChoice === "other" ? "border-accent bg-accent/10" : "border-input"}`}
                  >
                    <UsersRound className="mb-3 size-6 text-accent" />
                    <b className="block text-sm text-primary">فرد من العائلة</b>
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      طفل أو شخص آخر
                    </span>
                  </button>
                </div>
                {patientChoice === "other" && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-black text-primary">
                      اسم المريض
                      <input
                        value={otherName}
                        onChange={(event) => setOtherName(event.target.value)}
                        className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="text-xs font-black text-primary">
                      صلة القرابة
                      <select
                        value={relationship}
                        onChange={(event) => setRelationship(event.target.value)}
                        className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-accent"
                      >
                        <option value="">اختر</option>
                        <option>ابني</option>
                        <option>ابنتي</option>
                        <option>والدتي</option>
                        <option>والدي</option>
                        <option>شخص آخر</option>
                      </select>
                    </label>
                  </div>
                )}
                {error && (
                  <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-xs font-bold text-destructive">
                    {error}
                  </p>
                )}
                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="min-h-12 rounded-xl border border-input px-5 text-xs font-black text-primary"
                  >
                    السابق
                  </button>
                  <button
                    type="button"
                    onClick={goToReview}
                    className="min-h-12 flex-1 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
                  >
                    مراجعة الحجز
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-black text-primary">راجع بيانات الحجز</h2>
                <dl className="mt-5 divide-y divide-border rounded-2xl border border-border bg-background px-4 text-sm">
                  <div className="flex justify-between gap-3 py-4">
                    <dt className="text-muted-foreground">الطبيب</dt>
                    <dd className="text-left font-black text-primary">{doctor.name}</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-4">
                    <dt className="text-muted-foreground">المريض</dt>
                    <dd className="text-left font-black text-primary">{patientName}</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-4">
                    <dt className="text-muted-foreground">الموعد</dt>
                    <dd className="text-left font-black text-primary">{slot}</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-4">
                    <dt className="text-muted-foreground">سعر الكشف</dt>
                    <dd className="font-black text-primary">{doctor.price} جنيه</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-4">
                    <dt className="text-muted-foreground">المقدم 50%</dt>
                    <dd className="font-black text-accent">{deposit} جنيه</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-4">
                    <dt className="text-muted-foreground">المتبقي في العيادة</dt>
                    <dd className="font-black text-primary">{deposit} جنيه</dd>
                  </div>
                </dl>
                <div className="mt-4 flex gap-2 rounded-2xl bg-secondary p-4 text-[11px] leading-6 text-muted-foreground">
                  <Info className="mt-1 size-4 shrink-0 text-accent" />
                  <span>
                    لا يمكن للمريض إلغاء الحجز في الإصدار الأول. يمكن تغيير الموعد مرة واحدة قبل
                    الموعد الأصلي بـ12 ساعة على الأقل. عمولة دلّني {commission} جنيه ولا تُضاف على
                    سعر الكشف.
                  </span>
                </div>
                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="min-h-12 rounded-xl border border-input px-5 text-xs font-black text-primary"
                  >
                    السابق
                  </button>
                  <button
                    type="button"
                    onClick={confirmBooking}
                    className="min-h-12 flex-1 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
                  >
                    تأكيد طلب الحجز
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="py-4 text-center">
                <span className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 className="size-10" />
                </span>
                <h2 className="text-2xl font-black text-primary">تم إنشاء طلب الحجز</h2>
                <p className="mt-2 text-xs font-bold text-accent">الحالة: في انتظار الدفع</p>
                <p className="mx-auto mt-3 max-w-md text-xs leading-7 text-muted-foreground">
                  رقم الطلب: <b dir="ltr">{bookingId}</b>. الموعد ليس مؤكدًا بعد؛ في المرحلة العاشرة
                  سترفع إثبات دفع المقدم وتنتظر مراجعة الإدارة.
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-6 min-h-12 w-full cursor-not-allowed rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground opacity-70"
                >
                  متابعة دفع {deposit} جنيه — المرحلة العاشرة
                </button>
                <Link
                  to="/"
                  className="mt-3 inline-flex min-h-11 items-center text-xs font-black text-accent"
                >
                  العودة للرئيسية
                </Link>
              </div>
            )}
          </section>

          <aside className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
            <div className="flex gap-3">
              <img
                src={doctorImages[doctor.image]}
                alt={`صورة ${doctor.name}`}
                width={72}
                height={84}
                className="h-20 w-16 rounded-xl object-cover object-top"
              />
              <div className="min-w-0">
                <h2 className="truncate text-sm font-black text-primary">{doctor.name}</h2>
                <p className="mt-1 text-[11px] font-bold text-accent">{profile.subspecialty}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-[11px] leading-5 text-muted-foreground">
              <p className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                {doctor.address}
              </p>
              <p className="flex gap-2">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-accent" />
                مدة الموعد: 20 دقيقة
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
