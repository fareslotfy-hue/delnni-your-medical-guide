import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Banknote,
  Check,
  Clock3,
  Copy,
  FileImage,
  Info,
  LockKeyhole,
  Phone,
  ReceiptText,
  ShieldCheck,
  UploadCloud,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { doctorImages } from "@/lib/doctor-assets";
import { doctorProfiles } from "@/lib/doctor-profiles";
import { doctors } from "@/lib/doctor-ranking";

export const Route = createFileRoute("/payment/$bookingId")({
  head: () => ({
    meta: [
      { title: "إثبات دفع الحجز | دلّني" },
      {
        name: "description",
        content: "ارفع إثبات دفع مقدم الحجز وانتظر مراجعة إدارة دلّني.",
      },
    ],
  }),
  component: PaymentProofPage,
});

type PaymentStatus = "awaiting_payment" | "payment_review" | "payment_rejected" | "confirmed";

type StoredBooking = {
  id: string;
  doctorId: string;
  slot: string;
  patientName: string;
  status: PaymentStatus;
  payment?: {
    method: "vodafone_cash" | "instapay";
    senderPhone: string;
    reference: string;
    fileName: string;
    submittedAt: string;
  };
  rejectionReason?: string | undefined;
};

const egyptianPhonePattern = /^01[0125]\d{8}$/;
const maxFileSize = 5 * 1024 * 1024;
const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];

function PaymentProofPage() {
  const { bookingId } = Route.useParams();
  const [booking, setBooking] = useState<StoredBooking | null | undefined>(undefined);
  const [authenticated, setAuthenticated] = useState<boolean | undefined>(undefined);
  const [method, setMethod] = useState<"vodafone_cash" | "instapay">("vodafone_cash");
  const [senderPhone, setSenderPhone] = useState("");
  const [reference, setReference] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setAuthenticated(Boolean(sessionStorage.getItem("delnni_demo_patient")));
    try {
      const raw = sessionStorage.getItem("delnni_demo_bookings");
      const bookings = raw ? (JSON.parse(raw) as StoredBooking[]) : [];
      setBooking(bookings.find((item) => item.id === bookingId) ?? null);
    } catch {
      setBooking(null);
    }
  }, [bookingId]);

  useEffect(() => {
    if (!proof) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(proof);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [proof]);

  const doctor = doctors.find((item) => item.id === booking?.doctorId);
  const profile = booking ? doctorProfiles[booking.doctorId] : undefined;
  const deposit = useMemo(() => (doctor ? doctor.price / 2 : 0), [doctor]);
  const remaining = deposit;
  const paymentTarget = method === "vodafone_cash" ? "0100 000 0000" : "delnni@instapay";

  const chooseProof = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");
    if (!file) return;
    if (!acceptedImageTypes.includes(file.type)) {
      setError("ارفع صورة JPG أو PNG أو WebP فقط");
      event.target.value = "";
      return;
    }
    if (file.size > maxFileSize) {
      setError("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      event.target.value = "";
      return;
    }
    setProof(file);
  };

  const copyTarget = async () => {
    try {
      await navigator.clipboard.writeText(paymentTarget.replaceAll(" ", ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("تعذر النسخ تلقائيًا؛ انسخ البيانات يدويًا");
    }
  };

  const submitProof = (event: FormEvent) => {
    event.preventDefault();
    if (!egyptianPhonePattern.test(senderPhone)) {
      setError("اكتب رقم الهاتف الذي تم التحويل منه بصورة صحيحة");
      return;
    }
    if (!proof) {
      setError("ارفع صورة إثبات التحويل");
      return;
    }
    if (!accepted) {
      setError("أكد صحة بيانات التحويل قبل الإرسال");
      return;
    }
    const raw = sessionStorage.getItem("delnni_demo_bookings");
    const bookings = raw ? (JSON.parse(raw) as StoredBooking[]) : [];
    const nextBookings = bookings.map((item) =>
      item.id === bookingId
        ? {
            ...item,
            status: "payment_review" as const,
            payment: {
              method,
              senderPhone,
              reference: reference.trim(),
              fileName: proof.name,
              submittedAt: new Date().toISOString(),
            },
            rejectionReason: undefined,
          }
        : item,
    );
    sessionStorage.setItem("delnni_demo_bookings", JSON.stringify(nextBookings));
    setBooking(nextBookings.find((item) => item.id === bookingId) ?? null);
    setError("");
  };

  if (authenticated === undefined || booking === undefined) {
    return <main className="min-h-screen bg-background" aria-label="جارٍ تحميل بيانات الدفع" />;
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4 text-center">
        <section className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <LockKeyhole className="mx-auto mb-4 size-10 text-accent" />
          <h1 className="text-xl font-black text-primary">سجّل الدخول لعرض الحجز</h1>
          <Link
            to="/account"
            search={{ returnTo: `/payment/${bookingId}` }}
            className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground"
          >
            تسجيل الدخول
          </Link>
        </section>
      </main>
    );
  }

  if (!booking || !doctor || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4 text-center">
        <section className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <ReceiptText className="mx-auto mb-4 size-10 text-muted-foreground" />
          <h1 className="font-black text-primary">طلب الحجز غير موجود</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            قد تكون فتحت الرابط في متصفح أو جلسة مختلفة.
          </p>
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

  if (booking.status === "payment_review" || booking.status === "confirmed") {
    const confirmed = booking.status === "confirmed";
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <section className="w-full max-w-lg rounded-[2rem] border border-border bg-card p-7 text-center shadow-[var(--shadow-card)] sm:p-9">
          <span
            className={`mx-auto mb-5 flex size-20 items-center justify-center rounded-full ${confirmed ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}
          >
            {confirmed ? <Check className="size-10" /> : <Clock3 className="size-10" />}
          </span>
          <h1 className="text-2xl font-black text-primary">
            {confirmed ? "تم تأكيد الحجز" : "تم استلام إثبات الدفع"}
          </h1>
          <p className="mt-3 text-xs leading-7 text-muted-foreground">
            {confirmed
              ? "راجعت الإدارة عملية الدفع وأكدت الحجز."
              : "الحجز غير مؤكد حتى تراجع إدارة دلّني عملية الدفع."}
          </p>
          <div className="mt-5 rounded-2xl bg-secondary p-4 text-right text-xs leading-7">
            <p>
              <b className="text-primary">رقم الطلب:</b> <span dir="ltr">{booking.id}</span>
            </p>
            <p>
              <b className="text-primary">الطبيب:</b> {doctor.name}
            </p>
            <p>
              <b className="text-primary">الموعد:</b> {booking.slot}
            </p>
            <p>
              <b className="text-primary">المقدم:</b> {deposit} جنيه
            </p>
          </div>
          {!confirmed && (
            <p className="mt-4 flex justify-center gap-2 text-[11px] font-black text-accent">
              <Clock3 className="size-4" />
              الحالة: في انتظار مراجعة الدفع
            </p>
          )}
          <Link
            to="/"
            className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground"
          >
            العودة للرئيسية
          </Link>
        </section>
      </main>
    );
  }

  const rejected = booking.status === "payment_rejected";

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
            <h1 className="truncate font-black text-primary">دفع مقدم الحجز</h1>
            <p className="text-[10px] text-muted-foreground">
              طلب رقم <span dir="ltr">{booking.id}</span>
            </p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-[10px] font-black text-success sm:flex">
            <ShieldCheck className="size-4" />
            اتصال آمن
          </span>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_19rem] lg:items-start">
          <form
            onSubmit={submitProof}
            className="rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-8"
          >
            {rejected && (
              <div className="mb-6 rounded-2xl bg-destructive/10 p-4 text-xs leading-6 text-destructive">
                <b>تم رفض الإثبات السابق:</b>{" "}
                {booking.rejectionReason ?? "بيانات التحويل غير واضحة"}. يمكنك رفع صورة جديدة.
              </div>
            )}
            <h2 className="flex items-center gap-2 text-xl font-black text-primary">
              <WalletCards className="size-6 text-accent" />
              اختر طريقة التحويل
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMethod("vodafone_cash")}
                className={`rounded-2xl border p-4 text-right ${method === "vodafone_cash" ? "border-accent bg-accent/10" : "border-input"}`}
              >
                <Phone className="mb-3 size-6 text-accent" />
                <b className="block text-sm text-primary">Vodafone Cash</b>
                <span className="text-[10px] text-muted-foreground">تحويل محفظة إلكترونية</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("instapay")}
                className={`rounded-2xl border p-4 text-right ${method === "instapay" ? "border-accent bg-accent/10" : "border-input"}`}
              >
                <Banknote className="mb-3 size-6 text-accent" />
                <b className="block text-sm text-primary">InstaPay</b>
                <span className="text-[10px] text-muted-foreground">تحويل لحظي</span>
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 p-4">
              <p className="text-[11px] font-bold text-muted-foreground">حوّل المبلغ إلى</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <b className="text-lg text-primary" dir="ltr">
                  {paymentTarget}
                </b>
                <button
                  type="button"
                  onClick={copyTarget}
                  className="flex min-h-10 items-center gap-1.5 rounded-xl bg-card px-3 text-xs font-black text-accent"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "تم النسخ" : "نسخ"}
                </button>
              </div>
              <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
                بيانات تحويل تجريبية تحددها الإدارة قبل الإطلاق.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-black text-primary">
                رقم الهاتف المُحوِّل منه
                <input
                  value={senderPhone}
                  onChange={(event) =>
                    setSenderPhone(event.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  inputMode="tel"
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                  className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-left text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="text-xs font-black text-primary">
                رقم العملية / Reference{" "}
                <span className="font-normal text-muted-foreground">(اختياري)</span>
                <input
                  value={reference}
                  onChange={(event) => setReference(event.target.value.slice(0, 40))}
                  dir="ltr"
                  className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-left text-sm outline-none focus:border-accent"
                />
              </label>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-black text-primary">صورة إثبات التحويل</p>
              {!proof ? (
                <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-input bg-background p-5 text-center transition hover:border-accent/50">
                  <UploadCloud className="mb-3 size-9 text-accent" />
                  <b className="text-xs text-primary">اضغط لرفع Screenshot</b>
                  <span className="mt-2 text-[10px] text-muted-foreground">
                    JPG أو PNG أو WebP — بحد أقصى 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={chooseProof}
                    className="sr-only"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-3">
                  <img
                    src={previewUrl}
                    alt="معاينة إثبات التحويل"
                    className="mx-auto max-h-72 rounded-xl object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setProof(null)}
                    aria-label="حذف الصورة"
                    className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-full bg-card text-destructive shadow"
                  >
                    <X className="size-4" />
                  </button>
                  <p className="mt-2 truncate text-center text-[10px] text-muted-foreground">
                    <FileImage className="ml-1 inline size-3.5" />
                    {proof.name}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-xs font-bold text-destructive">
                {error}
              </p>
            )}
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-[11px] leading-6 text-muted-foreground">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                className="mt-1 size-4 accent-[var(--color-accent)]"
              />
              <span>أؤكد أن بيانات التحويل صحيحة، وأفهم أن الحجز لن يتأكد قبل مراجعة الإدارة.</span>
            </label>
            <button
              type="submit"
              className="mt-5 min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
            >
              إرسال إثبات الدفع للمراجعة
            </button>
          </form>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex gap-3">
                <img
                  src={doctorImages[doctor.image]}
                  alt={`صورة ${doctor.name}`}
                  className="h-20 w-16 rounded-xl object-cover object-top"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-black text-primary">{doctor.name}</h2>
                  <p className="mt-1 text-[11px] font-bold text-accent">{profile.subspecialty}</p>
                  <p className="mt-2 text-[10px] text-muted-foreground">{booking.slot}</p>
                </div>
              </div>
              <dl className="mt-4 divide-y divide-border border-t border-border text-xs">
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">سعر الكشف</dt>
                  <dd className="font-black text-primary">{doctor.price} جنيه</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">المقدم المطلوب</dt>
                  <dd className="font-black text-accent">{deposit} جنيه</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">المتبقي بالعيادة</dt>
                  <dd className="font-black text-primary">{remaining} جنيه</dd>
                </div>
              </dl>
            </section>
            <section className="flex gap-2 rounded-3xl bg-secondary p-4 text-[10px] leading-5 text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>لا تشارك كلمة المرور أو كود OTP مع أي شخص. المنصة تطلب صورة التحويل فقط.</span>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
