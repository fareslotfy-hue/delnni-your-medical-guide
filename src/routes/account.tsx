import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  CircleUserRound,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  MapPin,
  MessageCircleMore,
  Phone,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

export const Route = createFileRoute("/account")({
  validateSearch: (search: Record<string, unknown>) => ({
    returnTo: typeof search["returnTo"] === "string" ? search["returnTo"] : "",
  }),
  head: () => ({
    meta: [
      { title: "حساب المريض | دلّني" },
      {
        name: "description",
        content: "أنشئ حسابك على دلّني أو سجّل الدخول باستخدام رقم هاتفك.",
      },
    ],
  }),
  component: PatientAccountPage,
});

type AccountMode = "register" | "login" | "forgot";
type RegistrationStep = 1 | 2 | 3;

type RegistrationData = {
  name: string;
  phone: string;
  password: string;
  birthDate: string;
  gender: string;
  governorate: string;
  city: string;
};

const initialRegistration: RegistrationData = {
  name: "",
  phone: "",
  password: "",
  birthDate: "",
  gender: "",
  governorate: "الشرقية",
  city: "كفر صقر",
};

const egyptianPhonePattern = /^01[0125]\d{8}$/;

function FieldError({ children }: { children: string | undefined }) {
  return children ? (
    <p className="mt-1.5 text-[11px] font-bold text-destructive">{children}</p>
  ) : null;
}

function PasswordField({
  value,
  onChange,
  label = "كلمة المرور",
  autoComplete = "current-password",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block text-xs font-black text-primary">
      {label}
      <span className="relative mt-2 block">
        <LockKeyhole className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder="8 أحرف على الأقل"
          className="min-h-12 w-full rounded-xl border border-input bg-background pr-10 pl-11 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center text-muted-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </span>
    </label>
  );
}

function AccountHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 text-center">
      <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground shadow-[var(--shadow-card)]">
        د
      </span>
      <h1 className="text-2xl font-black text-primary sm:text-3xl">{title}</h1>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function PatientAccountPage() {
  const { returnTo } = Route.useSearch();
  const [mode, setMode] = useState<AccountMode>("register");

  const authenticate = (profile: { name: string; phone: string }) => {
    sessionStorage.setItem("delnni_demo_patient", JSON.stringify(profile));
    if (returnTo.startsWith("/")) window.location.assign(returnTo);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex min-h-10 items-center gap-2 rounded-xl bg-card px-3 text-xs font-bold text-primary shadow-[var(--shadow-card)]"
          >
            <ArrowRight className="size-4" />
            الرئيسية
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-[10px] font-black text-success">
            <ShieldCheck className="size-4" />
            خصوصيتك أولويتنا
          </span>
        </div>

        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-8">
          {mode !== "forgot" && (
            <div className="mb-7 grid grid-cols-2 rounded-2xl bg-secondary p-1">
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`min-h-11 rounded-xl text-xs font-black transition ${mode === "register" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
              >
                إنشاء حساب
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`min-h-11 rounded-xl text-xs font-black transition ${mode === "login" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
              >
                تسجيل الدخول
              </button>
            </div>
          )}

          {mode === "register" && (
            <RegisterFlow onLogin={() => setMode("login")} onAuthenticated={authenticate} />
          )}
          {mode === "login" && (
            <LoginForm onForgot={() => setMode("forgot")} onAuthenticated={authenticate} />
          )}
          {mode === "forgot" && <ForgotPassword onBack={() => setMode("login")} />}
        </section>

        <p className="mt-4 text-center text-[10px] leading-5 text-muted-foreground">
          المرحلة الثامنة — واجهة حساب تجريبية. التفعيل الحقيقي سيتم بعد ربط قاعدة البيانات ومزوّد
          التحقق.
        </p>
      </div>
    </main>
  );
}

function RegisterFlow({
  onLogin,
  onAuthenticated,
}: {
  onLogin: () => void;
  onAuthenticated: (profile: { name: string; phone: string }) => void;
}) {
  const [step, setStep] = useState<RegistrationStep>(1);
  const [data, setData] = useState(initialRegistration);
  const [accepted, setAccepted] = useState(false);
  const [otp, setOtp] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordScore = useMemo(() => {
    return [
      data.password.length >= 8,
      /[A-Za-z]/.test(data.password),
      /\d/.test(data.password),
    ].filter(Boolean).length;
  }, [data.password]);

  const update = (field: keyof RegistrationData, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateFirstStep = () => {
    const nextErrors: Record<string, string> = {};
    if (data.name.trim().length < 3) nextErrors["name"] = "اكتب الاسم الثلاثي بصورة صحيحة";
    if (!egyptianPhonePattern.test(data.phone))
      nextErrors["phone"] = "اكتب رقم موبايل مصري صحيح من 11 رقمًا";
    if (passwordScore < 3) nextErrors["password"] = "استخدم 8 أحرف على الأقل تشمل حروفًا وأرقامًا";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep(2);
  };

  const validateSecondStep = () => {
    const nextErrors: Record<string, string> = {};
    if (!data.birthDate) nextErrors["birthDate"] = "اختر تاريخ الميلاد";
    if (!data.gender) nextErrors["gender"] = "اختر النوع";
    if (!accepted) nextErrors["accepted"] = "يلزم الموافقة على الشروط وسياسة الخصوصية";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep(3);
  };

  const confirmOtp = (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: "أدخل كود التحقق المكوّن من 6 أرقام" });
      return;
    }
    setSubmitted(true);
    onAuthenticated({ name: data.name, phone: data.phone });
  };

  if (submitted) {
    return (
      <div className="py-5 text-center">
        <span className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-10" />
        </span>
        <h1 className="text-2xl font-black text-primary">بيانات الحساب جاهزة</h1>
        <p className="mx-auto mt-3 max-w-sm text-xs leading-7 text-muted-foreground">
          اكتملت تجربة التسجيل بنجاح. لم تُحفظ كلمة المرور أو تُنشأ هوية حقيقية في النسخة التجريبية.
        </p>
        <button
          type="button"
          onClick={onLogin}
          className="mt-6 min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
        >
          الانتقال لتسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div>
      <AccountHeader
        title="أنشئ حساب المريض"
        subtitle="بيانات بسيطة تساعدنا نجهّز تجربة الحجز والمتابعة الخاصة بك."
      />

      <ol className="mb-7 flex items-center" aria-label="خطوات إنشاء الحساب">
        {[1, 2, 3].map((item, index) => (
          <li key={item} className={`flex items-center ${index < 2 ? "flex-1" : ""}`}>
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${step >= item ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              {step > item ? <Check className="size-4" /> : item}
            </span>
            {index < 2 && (
              <span className={`h-0.5 flex-1 ${step > item ? "bg-accent" : "bg-border"}`} />
            )}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-xs font-black text-primary">
            الاسم الثلاثي
            <span className="relative mt-2 block">
              <CircleUserRound className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={data.name}
                onChange={(event) => update("name", event.target.value)}
                autoComplete="name"
                placeholder="مثال: محمد أحمد علي"
                className="min-h-12 w-full rounded-xl border border-input bg-background pr-10 pl-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
              />
            </span>
            <FieldError>{errors["name"]}</FieldError>
          </label>

          <label className="block text-xs font-black text-primary">
            رقم الموبايل
            <span className="relative mt-2 block" dir="ltr">
              <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={data.phone}
                onChange={(event) =>
                  update("phone", event.target.value.replace(/\D/g, "").slice(0, 11))
                }
                inputMode="tel"
                autoComplete="tel"
                placeholder="01xxxxxxxxx"
                className="min-h-12 w-full rounded-xl border border-input bg-background pr-3 pl-10 text-left text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
              />
            </span>
            <FieldError>{errors["phone"]}</FieldError>
          </label>

          <PasswordField
            value={data.password}
            onChange={(value) => update("password", value)}
            autoComplete="new-password"
          />
          <div
            className="grid grid-cols-3 gap-1.5"
            aria-label={`قوة كلمة المرور ${passwordScore} من 3`}
          >
            {[1, 2, 3].map((item) => (
              <span
                key={item}
                className={`h-1.5 rounded-full ${passwordScore >= item ? "bg-success" : "bg-border"}`}
              />
            ))}
          </div>
          <FieldError>{errors["password"]}</FieldError>

          <button
            type="button"
            onClick={validateFirstStep}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
          >
            التالي: بيانات المريض
            <ChevronLeft className="size-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-black text-primary">
              تاريخ الميلاد
              <input
                value={data.birthDate}
                onChange={(event) => update("birthDate", event.target.value)}
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-accent"
              />
              <FieldError>{errors["birthDate"]}</FieldError>
            </label>
            <label className="block text-xs font-black text-primary">
              النوع
              <select
                value={data.gender}
                onChange={(event) => update("gender", event.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-accent"
              >
                <option value="">اختر النوع</option>
                <option>ذكر</option>
                <option>أنثى</option>
              </select>
              <FieldError>{errors["gender"]}</FieldError>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-black text-primary">
              المحافظة
              <select
                value={data.governorate}
                onChange={(event) => update("governorate", event.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-accent"
              >
                <option>الشرقية</option>
              </select>
            </label>
            <label className="block text-xs font-black text-primary">
              المركز / المدينة
              <select
                value={data.city}
                onChange={(event) => update("city", event.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-accent"
              >
                <option>كفر صقر</option>
              </select>
            </label>
          </div>

          <div className="flex gap-2 rounded-2xl bg-secondary/70 p-3 text-[11px] leading-5 text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
            الإصدار الأول متاح في كفر صقر، والبنية جاهزة لإضافة محافظات ومراكز جديدة لاحقًا.
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-[11px] leading-6 text-muted-foreground">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => {
                setAccepted(event.target.checked);
                setErrors((current) => ({ ...current, accepted: "" }));
              }}
              className="mt-1 size-4 accent-[var(--color-accent)]"
            />
            <span>
              أوافق على شروط الاستخدام وسياسة الخصوصية، وأفهم أن دلّني لا يقدم تشخيصًا طبيًا.
            </span>
          </label>
          <FieldError>{errors["accepted"]}</FieldError>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-12 rounded-xl border border-input px-5 text-xs font-black text-primary"
            >
              السابق
            </button>
            <button
              type="button"
              onClick={validateSecondStep}
              className="min-h-12 flex-1 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
            >
              تأكيد رقم الهاتف
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={confirmOtp} className="space-y-5 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <MessageCircleMore className="size-8" />
          </span>
          <div>
            <h2 className="text-lg font-black text-primary">تأكيد رقم الموبايل</h2>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              أدخل كود التحقق المكوّن من 6 أرقام المرسل إلى <b dir="ltr">{data.phone}</b>
            </p>
          </div>
          <input
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
              setErrors({});
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••••"
            aria-label="كود التحقق"
            dir="ltr"
            className="min-h-14 w-full rounded-2xl border border-input bg-background px-4 text-center text-2xl font-black tracking-[0.6em] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
          />
          <FieldError>{errors["otp"]}</FieldError>
          <div className="rounded-2xl border border-accent/15 bg-accent/5 p-3 text-right text-[10px] leading-5 text-muted-foreground">
            <b className="text-primary">نسخة تجريبية:</b> لن يتم إرسال رسالة حقيقية الآن. الربط
            سيكون مع مزود OTP رسمي بعد اعتماده.
          </div>
          <button
            type="submit"
            className="min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
          >
            تحقق وأنشئ الحساب
          </button>
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center gap-1.5 text-xs font-bold text-muted-foreground opacity-70"
          >
            <RotateCcw className="size-3.5" />
            إعادة إرسال الكود
          </button>
        </form>
      )}
    </div>
  );
}

function LoginForm({
  onForgot,
  onAuthenticated,
}: {
  onForgot: () => void;
  onAuthenticated: (profile: { name: string; phone: string }) => void;
}) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!egyptianPhonePattern.test(phone) || password.length < 8) {
      setMessage("راجع رقم الهاتف وكلمة المرور");
      return;
    }
    setMessage("تم تسجيل الدخول للنسخة التجريبية. لم تُرسل كلمة المرور أو تُخزن.");
    onAuthenticated({ name: "المريض", phone });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <AccountHeader title="أهلًا بعودتك" subtitle="سجّل الدخول لمتابعة حجوزاتك والمفضلة لاحقًا." />
      <label className="block text-xs font-black text-primary">
        رقم الموبايل
        <span className="relative mt-2 block" dir="ltr">
          <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))}
            inputMode="tel"
            autoComplete="tel"
            placeholder="01xxxxxxxxx"
            className="min-h-12 w-full rounded-xl border border-input bg-background pr-3 pl-10 text-left text-sm outline-none focus:border-accent"
          />
        </span>
      </label>
      <PasswordField value={password} onChange={setPassword} />
      <button type="button" onClick={onForgot} className="text-xs font-black text-accent">
        نسيت كلمة المرور؟
      </button>
      {message && (
        <p className="rounded-xl bg-secondary p-3 text-[11px] leading-5 text-muted-foreground">
          {message}
        </p>
      )}
      <button
        type="submit"
        className="min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
      >
        تسجيل الدخول
      </button>
    </form>
  );
}

function ForgotPassword({ onBack }: { onBack: () => void }) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(
          egyptianPhonePattern.test(phone)
            ? "الواجهة جاهزة. إرسال كود الاسترجاع سيتفعّل بعد ربط مزود OTP."
            : "اكتب رقم موبايل مصري صحيح من 11 رقمًا",
        );
      }}
      className="space-y-4"
    >
      <AccountHeader
        title="استرجاع الحساب"
        subtitle="سنستخدم رقم الهاتف المرتبط بالحساب للتحقق من هويتك."
      />
      <span className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
        <KeyRound className="size-7" />
      </span>
      <label className="block text-xs font-black text-primary">
        رقم الموبايل
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))}
          inputMode="tel"
          placeholder="01xxxxxxxxx"
          dir="ltr"
          className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-left text-sm outline-none focus:border-accent"
        />
      </label>
      {message && (
        <p className="rounded-xl bg-secondary p-3 text-[11px] leading-5 text-muted-foreground">
          {message}
        </p>
      )}
      <button
        type="submit"
        className="min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground"
      >
        إرسال كود الاسترجاع
      </button>
      <button
        type="button"
        onClick={onBack}
        className="flex min-h-11 w-full items-center justify-center gap-2 text-xs font-black text-accent"
      >
        <ArrowRight className="size-4" />
        العودة لتسجيل الدخول
      </button>
    </form>
  );
}
