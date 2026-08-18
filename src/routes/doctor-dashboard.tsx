import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  CalendarClock,
  CircleDollarSign,
  Clock3,
  FileClock,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  Star,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/doctor-dashboard")({
  head: () => ({ meta: [{ title: "لوحة الطبيب | دلّني" }] }),
  component: DoctorDashboard,
});
type DoctorProfile = {
  name: string;
  phone: string;
  specialty: string;
  subspecialty: string;
  degree: string;
  experience: number;
  price: number;
  address: string;
  workDays: string;
  startTime: string;
  endTime: string;
  appointmentDuration: number;
  whatsapp: string;
  status: "pending_review" | "approved" | "rejected";
};

function DoctorDashboard() {
  const [doctor, setDoctor] = useState<DoctorProfile | null | undefined>(undefined);
  const [requestedPrice, setRequestedPrice] = useState("");
  const [priceMessage, setPriceMessage] = useState("");
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("delnni_demo_doctor");
      setDoctor(raw ? (JSON.parse(raw) as DoctorProfile) : null);
    } catch {
      setDoctor(null);
    }
  }, []);
  if (doctor === undefined) return <main className="min-h-screen bg-background" />;
  if (!doctor)
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <section className="max-w-md rounded-[2rem] border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
          <LayoutDashboard className="mx-auto mb-4 size-11 text-accent" />
          <h1 className="text-xl font-black text-primary">لا يوجد حساب طبيب في هذه الجلسة</h1>
          <Link
            to="/join-doctor"
            className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground"
          >
            ابدأ التسجيل
          </Link>
        </section>
      </main>
    );
  const logout = () => {
    sessionStorage.removeItem("delnni_demo_doctor");
    window.location.assign("/");
  };
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <ArrowRight className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-black text-primary">لوحة د. {doctor.name}</h1>
            <p className="text-[10px] text-muted-foreground">
              {doctor.specialty} — {doctor.subspecialty}
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
      <main className="px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          {doctor.status === "pending_review" && (
            <section className="mb-6 flex gap-3 rounded-3xl border border-accent/20 bg-accent/5 p-5">
              <FileClock className="size-6 shrink-0 text-accent" />
              <div>
                <h2 className="font-black text-primary">الحساب في انتظار مراجعة الإدارة</h2>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  لن تظهر صفحتك للمرضى أو تستقبل حجوزات حتى مراجعة المستندات والموافقة على الحساب.
                </p>
              </div>
            </section>
          )}
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric icon={CalendarCheck2} label="حجوزات اليوم" value="0" />
            <Metric icon={UsersRound} label="إجمالي المرضى" value="0" />
            <Metric icon={CircleDollarSign} label="قيمة الحجوزات" value="0 جنيه" />
            <Metric icon={Star} label="التقييم" value="—" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_19rem] lg:items-start">
            <div className="space-y-6">
              <section className="rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-primary">حجوزات اليوم</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      ستظهر المواعيد بعد اعتماد الحساب وبدء استقبال الحجوزات.
                    </p>
                  </div>
                  <CalendarClock className="size-7 text-accent" />
                </div>
                <div className="mt-5 rounded-2xl border border-dashed border-input p-7 text-center">
                  <Clock3 className="mx-auto mb-2 size-9 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">لا توجد حجوزات اليوم.</p>
                </div>
              </section>
              <section className="rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h2 className="text-xl font-black text-primary">الملخص المالي</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Finance label="المقدمات" value="0 جنيه" />
                  <Finance label="عمولة دلّني" value="0 جنيه" />
                  <Finance label="مستحقات الطبيب" value="0 جنيه" />
                </div>
              </section>
              <section className="rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h2 className="text-xl font-black text-primary">طلب تعديل سعر الكشف</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  السعر الحالي {doctor.price} جنيه. لا يتغير إلا بعد موافقة الإدارة.
                </p>
                <div className="mt-4 flex gap-2">
                  <input
                    value={requestedPrice}
                    onChange={(e) =>
                      setRequestedPrice(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    inputMode="numeric"
                    placeholder="السعر الجديد"
                    className="min-h-12 flex-1 rounded-xl border border-input bg-background px-3 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPriceMessage(
                        Number(requestedPrice) > 0
                          ? "تم إرسال الطلب للمراجعة التجريبية."
                          : "اكتب سعرًا صحيحًا.",
                      )
                    }
                    className="rounded-xl bg-primary px-4 text-xs font-black text-primary-foreground"
                  >
                    إرسال الطلب
                  </button>
                </div>
                {priceMessage && (
                  <p className="mt-2 text-[11px] font-bold text-accent">{priceMessage}</p>
                )}
              </section>
            </div>
            <aside className="space-y-4 lg:sticky lg:top-24">
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-[10px] font-black text-accent">
                  <BadgeCheck className="size-4" />
                  بانتظار التوثيق
                </span>
                <h2 className="font-black text-primary">د. {doctor.name}</h2>
                <p className="mt-1 text-xs text-accent">{doctor.degree}</p>
                <dl className="mt-4 space-y-3 text-[11px]">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">الخبرة</dt>
                    <dd className="font-bold text-primary">{doctor.experience} سنة</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">أيام العمل</dt>
                    <dd className="text-left font-bold text-primary">{doctor.workDays}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">ساعات العمل</dt>
                    <dd className="font-bold text-primary" dir="ltr">
                      {doctor.startTime}–{doctor.endTime}
                    </dd>
                  </div>
                </dl>
              </section>
              <div className="grid gap-2">
                <button
                  disabled
                  className="flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-input bg-card px-4 text-xs font-black text-muted-foreground"
                >
                  <UserRoundCheck className="size-4" />
                  مشاهدة صفحتي
                </button>
                <button
                  disabled
                  className="flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-input bg-card px-4 text-xs font-black text-muted-foreground"
                >
                  <CalendarClock className="size-4" />
                  إدارة المواعيد
                </button>
                <button
                  disabled
                  className="flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-input bg-card px-4 text-xs font-black text-muted-foreground"
                >
                  <Settings className="size-4" />
                  تعديل البيانات
                </button>
                <button
                  disabled
                  className="flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-input bg-card px-4 text-xs font-black text-muted-foreground"
                >
                  <MessageCircle className="size-4" />
                  إعدادات WhatsApp
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarCheck2;
  label: string;
  value: string;
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
function Finance({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary p-4">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1 font-black text-primary">{value}</p>
    </div>
  );
}
