import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  Camera,
  Check,
  ChevronLeft,
  CircleDollarSign,
  FileCheck2,
  ImagePlus,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  UploadCloud,
  UsersRound,
} from "lucide-react";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

export const Route = createFileRoute("/join-doctor")({
  head: () => ({
    meta: [
      { title: "انضم إلى دلّني كطبيب" },
      {
        name: "description",
        content: "سجّل بياناتك المهنية وانضم إلى شبكة أطباء دلّني في كفر صقر.",
      },
    ],
  }),
  component: JoinDoctorPage,
});

type DoctorForm = {
  name: string;
  phone: string;
  password: string;
  specialty: string;
  subspecialty: string;
  degree: string;
  experience: string;
  price: string;
  address: string;
  landmark: string;
  workDays: string;
  startTime: string;
  endTime: string;
  appointmentDuration: string;
  whatsapp: string;
};

const initialForm: DoctorForm = {
  name: "",
  phone: "",
  password: "",
  specialty: "",
  subspecialty: "",
  degree: "",
  experience: "",
  price: "",
  address: "",
  landmark: "",
  workDays: "",
  startTime: "",
  endTime: "",
  appointmentDuration: "20",
  whatsapp: "",
};

const specialties = ["باطنة", "عظام", "أطفال", "جلدية", "أنف وأذن", "أسنان"];
const egyptianPhone = /^01[0125]\d{8}$/;
const acceptedFiles = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const benefits = [
  {
    icon: UsersRound,
    title: "وصول لمرضى مناسبين",
    text: "ظهور عضوي يعتمد على التخصص والتقييم وجودة الخدمة.",
  },
  { icon: CalendarCheck2, title: "تنظيم المواعيد", text: "تابع الحجوزات والـSlots من لوحة واحدة." },
  {
    icon: CircleDollarSign,
    title: "حساب مالي واضح",
    text: "عمولة دلّني 5% من سعر الكشف الكامل بعد الحجز.",
  },
  {
    icon: LayoutDashboard,
    title: "لوحة طبيب احترافية",
    text: "الحجوزات والإيرادات والتقييمات وإعدادات العيادة.",
  },
];

function JoinDoctorPage() {
  const [form, setForm] = useState(initialForm);
  const [photoMode, setPhotoMode] = useState<"upload" | "help">("upload");
  const [photo, setPhoto] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof DoctorForm, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const hasRequiredData = useMemo(
    () =>
      form.name.trim().length >= 3 &&
      egyptianPhone.test(form.phone) &&
      form.password.length >= 8 &&
      form.specialty &&
      form.subspecialty.trim() &&
      form.degree.trim() &&
      Number(form.experience) >= 0 &&
      Number(form.price) > 0 &&
      form.address.trim() &&
      form.workDays.trim() &&
      form.startTime &&
      form.endTime &&
      egyptianPhone.test(form.whatsapp),
    [form],
  );

  const selectDocuments = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.some((file) => !acceptedFiles.includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setError("المستندات يجب أن تكون PDF أو صورًا، وبحد أقصى 5MB للملف");
      event.target.value = "";
      return;
    }
    setDocuments(files.slice(0, 4));
    setError("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!hasRequiredData) {
      setError("راجع كل البيانات المطلوبة وأرقام الهاتف وكلمة المرور");
      return;
    }
    if (photoMode === "upload" && !photo) {
      setError("ارفع صورة شخصية احترافية أو اختر طلب المساعدة");
      return;
    }
    if (documents.length < 3) {
      setError("ارفع بطاقة الهوية وكارنيه النقابة وترخيص مزاولة المهنة");
      return;
    }
    if (!accepted) {
      setError("يلزم تأكيد صحة البيانات والموافقة على المراجعة");
      return;
    }
    const safeProfile = {
      name: form.name.trim(),
      phone: form.phone,
      specialty: form.specialty,
      subspecialty: form.subspecialty.trim(),
      degree: form.degree.trim(),
      experience: Number(form.experience),
      price: Number(form.price),
      address: form.address.trim(),
      landmark: form.landmark.trim(),
      workDays: form.workDays.trim(),
      startTime: form.startTime,
      endTime: form.endTime,
      appointmentDuration: Number(form.appointmentDuration),
      whatsapp: form.whatsapp,
      photoFileName: photo?.name ?? "needs-assistance",
      documentNames: documents.map((file) => file.name),
      status: "pending_review",
    };
    sessionStorage.setItem("delnni_demo_doctor", JSON.stringify(safeProfile));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <section className="w-full max-w-lg rounded-[2rem] border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
          <span className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-accent/10 text-accent">
            <FileCheck2 className="size-10" />
          </span>
          <h1 className="text-2xl font-black text-primary">تم استلام طلب الانضمام</h1>
          <p className="mt-3 text-xs leading-7 text-muted-foreground">
            الحساب في انتظار مراجعة الإدارة للمعلومات والمستندات. لن تظهر صفحتك للمرضى قبل الموافقة
            والتوثيق.
          </p>
          <Link
            to="/doctor-dashboard"
            className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground"
          >
            فتح لوحة الطبيب
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <ArrowRight className="size-5" />
          </Link>
          <div>
            <h1 className="font-black text-primary">انضم إلى دلّني كطبيب</h1>
            <p className="text-[10px] text-muted-foreground">
              ابدأ في كفر صقر — فرع واحد في الإصدار الأول
            </p>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-primary px-4 py-12 text-primary-foreground sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-card/10 px-3 py-1.5 text-xs font-black">
                <BadgeCheck className="size-4 text-accent" />
                انضم بعد مراجعة وتوثيق الحساب
              </span>
              <h2 className="text-4xl font-black leading-tight sm:text-5xl">
                نظّم عيادتك ووصل للمرضى المناسبين
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-primary-foreground/70">
                دلّني يساعد المرضى في الوصول للتخصص المناسب، ويمنح الطبيب حضورًا مهنيًا وحجوزات
                منظمة بتجربة واضحة.
              </p>
              <a
                href="#doctor-registration"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent px-6 text-sm font-black text-accent-foreground"
              >
                ابدأ التسجيل <ChevronLeft className="size-4" />
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl bg-card/10 p-4">
                  <Icon className="mb-3 size-6 text-accent" />
                  <h3 className="text-sm font-black">{title}</h3>
                  <p className="mt-2 text-[11px] leading-6 text-primary-foreground/65">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="doctor-registration" className="scroll-mt-6 px-4 py-10 sm:px-6 sm:py-14">
          <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
            <div>
              <h2 className="text-3xl font-black text-primary">بيانات تسجيل الطبيب</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                كل البيانات والمستندات الحالية تجريبية ولا تُرفع لخادم دائم.
              </p>
            </div>
            <FormSection title="بيانات الحساب" icon={Stethoscope}>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="الاسم الكامل"
                  value={form.name}
                  onChange={(v) => update("name", v)}
                />
                <TextField
                  label="رقم الهاتف"
                  value={form.phone}
                  onChange={(v) => update("phone", v.replace(/\D/g, "").slice(0, 11))}
                  dir="ltr"
                />
                <TextField
                  label="كلمة المرور"
                  value={form.password}
                  onChange={(v) => update("password", v)}
                  type="password"
                />
                <TextField
                  label="WhatsApp العيادة"
                  value={form.whatsapp}
                  onChange={(v) => update("whatsapp", v.replace(/\D/g, "").slice(0, 11))}
                  dir="ltr"
                />
              </div>
            </FormSection>
            <FormSection title="البيانات المهنية" icon={BadgeCheck}>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="التخصص الرئيسي"
                  value={form.specialty}
                  onChange={(v) => update("specialty", v)}
                  options={specialties}
                />
                <TextField
                  label="التخصص الدقيق"
                  value={form.subspecialty}
                  onChange={(v) => update("subspecialty", v)}
                />
                <TextField
                  label="الدرجة العلمية"
                  value={form.degree}
                  onChange={(v) => update("degree", v)}
                />
                <TextField
                  label="سنوات الخبرة"
                  value={form.experience}
                  onChange={(v) => update("experience", v.replace(/\D/g, "").slice(0, 2))}
                  inputMode="numeric"
                />
                <TextField
                  label="سعر الكشف بالجنيه"
                  value={form.price}
                  onChange={(v) => update("price", v.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                />
              </div>
            </FormSection>
            <FormSection title="العيادة والمواعيد" icon={MapPin}>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="عنوان العيادة في كفر صقر"
                  value={form.address}
                  onChange={(v) => update("address", v)}
                />
                <TextField
                  label="علامة مميزة"
                  value={form.landmark}
                  onChange={(v) => update("landmark", v)}
                />
                <TextField
                  label="أيام العمل"
                  value={form.workDays}
                  onChange={(v) => update("workDays", v)}
                  placeholder="مثال: السبت إلى الأربعاء"
                />
                <TextField
                  label="وقت البداية"
                  value={form.startTime}
                  onChange={(v) => update("startTime", v)}
                  type="time"
                />
                <TextField
                  label="وقت النهاية"
                  value={form.endTime}
                  onChange={(v) => update("endTime", v)}
                  type="time"
                />
                <SelectField
                  label="مدة الكشف"
                  value={form.appointmentDuration}
                  onChange={(v) => update("appointmentDuration", v)}
                  options={["15", "20", "30", "45", "60"]}
                  suffix=" دقيقة"
                />
              </div>
              <p className="mt-4 rounded-xl bg-secondary p-3 text-[11px] leading-5 text-muted-foreground">
                الإصدار الأول يسمح بفرع واحد داخل كفر صقر. تحديد الموقع الدقيق على الخريطة سيُربط
                لاحقًا.
              </p>
            </FormSection>
            <FormSection title="الصورة والمستندات" icon={ShieldCheck}>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPhotoMode("upload")}
                  className={`rounded-2xl border p-4 text-right ${photoMode === "upload" ? "border-accent bg-accent/10" : "border-input"}`}
                >
                  <Camera className="mb-2 size-6 text-accent" />
                  <b className="block text-sm text-primary">لدي صورة احترافية</b>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode("help")}
                  className={`rounded-2xl border p-4 text-right ${photoMode === "help" ? "border-accent bg-accent/10" : "border-input"}`}
                >
                  <MessageCircle className="mb-2 size-6 text-accent" />
                  <b className="block text-sm text-primary">أحتاج مساعدة في الصورة</b>
                </button>
              </div>
              {photoMode === "upload" ? (
                <label className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-input bg-background">
                  <ImagePlus className="mb-2 size-7 text-accent" />
                  <span className="text-xs font-black text-primary">
                    {photo?.name ?? "ارفع صورة شخصية واضحة"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                </label>
              ) : (
                <a
                  href="https://wa.me/201000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-whatsapp text-xs font-black text-white"
                >
                  تواصل مع دلّني عبر واتساب
                </a>
              )}
              <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-input bg-background p-4 text-center">
                <UploadCloud className="mb-2 size-7 text-accent" />
                <span className="text-xs font-black text-primary">
                  بطاقة الهوية + كارنيه النقابة + ترخيص المزاولة
                </span>
                <span className="mt-1 text-[10px] text-muted-foreground">
                  {documents.length
                    ? `${documents.length} ملفات مختارة`
                    : "PDF أو صور — 5MB لكل ملف"}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={selectDocuments}
                  className="sr-only"
                />
              </label>
              <p className="mt-3 text-[10px] leading-5 text-muted-foreground">
                المستندات خاصة بالإدارة ولا تظهر للمرضى أو في صفحة الطبيب.
              </p>
            </FormSection>
            {error && (
              <p className="rounded-2xl bg-destructive/10 p-4 text-xs font-bold text-destructive">
                {error}
              </p>
            )}
            <label className="flex items-start gap-3 text-[11px] leading-6 text-muted-foreground">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 size-4 accent-[var(--color-accent)]"
              />
              <span>
                أؤكد صحة البيانات وأوافق على مراجعة الإدارة للمستندات، وأفهم أن الحساب لن يظهر قبل
                الموافقة.
              </span>
            </label>
            <button
              type="submit"
              className="min-h-14 w-full rounded-xl bg-primary px-6 text-sm font-black text-primary-foreground"
            >
              إرسال طلب الانضمام
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

function FormSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Stethoscope;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7">
      <legend className="px-2">
        <span className="flex items-center gap-2 text-lg font-black text-primary">
          <Icon className="size-5 text-accent" />
          {title}
        </span>
      </legend>
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}
function TextField({
  label,
  value,
  onChange,
  type = "text",
  dir,
  inputMode,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  dir?: "ltr";
  inputMode?: "numeric";
  placeholder?: string;
}) {
  return (
    <label className="text-xs font-black text-primary">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        dir={dir}
        inputMode={inputMode}
        placeholder={placeholder}
        className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
      />
    </label>
  );
}
function SelectField({
  label,
  value,
  onChange,
  options,
  suffix = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  suffix?: string;
}) {
  return (
    <label className="text-xs font-black text-primary">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-accent"
      >
        <option value="">اختر</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
            {suffix}
          </option>
        ))}
      </select>
    </label>
  );
}
