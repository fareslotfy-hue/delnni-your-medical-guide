import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accessibility,
  AlertTriangle,
  ArrowRight,
  Check,
  Info,
  Minus,
  MousePointer2,
  Plus,
  Rotate3D,
  ScanSearch,
  UserRound,
  VenusAndMars,
} from "lucide-react";
import { useMemo, useRef, useState, type PointerEvent } from "react";

import bodyFemaleBack from "@/assets/body-female-back.webp";
import bodyFemaleFront from "@/assets/body-female-front.webp";
import bodyMaleBack from "@/assets/body-male-back.webp";
import bodyMaleFront from "@/assets/body-male-front.webp";
import { recommendSpecialty, regionMappings, urgentSymptoms } from "@/lib/symptom-mapping";

export const Route = createFileRoute("/body-guide")({
  head: () => ({
    meta: [
      { title: "الدليل البصري للجسم | دلّني" },
      {
        name: "description",
        content: "نموذج أولي تفاعلي لاختيار مكان المشكلة قبل تحديد الأعراض والتخصص المناسب.",
      },
    ],
  }),
  component: BodyGuidePrototype,
});

const bodyRegions = {
  front: [
    { id: "head", label: "الرأس", top: "11%", right: "50%" },
    { id: "ear", label: "الأذن", top: "15%", right: "39%" },
    { id: "chest", label: "الصدر", top: "31%", right: "50%" },
    { id: "abdomen", label: "البطن", top: "43%", right: "50%" },
    { id: "arm", label: "الذراع", top: "39%", right: "25%" },
    { id: "knee", label: "الركبة", top: "68%", right: "40%" },
  ],
  back: [
    { id: "head", label: "خلف الرأس", top: "11%", right: "50%" },
    { id: "upper-back", label: "أعلى الظهر والكتفين", top: "31%", right: "50%" },
    { id: "lower-back", label: "أسفل الظهر", top: "44%", right: "50%" },
    { id: "arm", label: "خلف الذراع", top: "39%", right: "25%" },
    { id: "knee", label: "خلف الركبة", top: "68%", right: "40%" },
  ],
} as const;

const bodyAssets = {
  male: { front: bodyMaleFront, back: bodyMaleBack },
  female: { front: bodyFemaleFront, back: bodyFemaleBack },
} as const;

type Gender = "male" | "female";
type BodyView = "front" | "back";

function BodyGuidePrototype() {
  const [gender, setGender] = useState<Gender>("male");
  const [view, setView] = useState<BodyView>("front");
  const [zoom, setZoom] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [urgentSelected, setUrgentSelected] = useState<string | null>(null);
  const [resultRequested, setResultRequested] = useState(false);
  const dragStart = useRef<{ x: number; view: BodyView } | null>(null);
  const selectedMapping = selectedRegion ? regionMappings[selectedRegion] : null;
  const recommendation =
    resultRequested && selectedRegion && !urgentSelected
      ? recommendSpecialty(selectedRegion, selectedSymptoms)
      : null;
  const activeRegions = useMemo(() => bodyRegions[view], [view]);
  const viewLabel = view === "front" ? "واجهة أمامية" : "واجهة خلفية";

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX, view };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const delta = event.clientX - dragStart.current.x;
    if (Math.abs(delta) >= 45) {
      setView(dragStart.current.view === "front" ? "back" : "front");
    }
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const resetView = () => {
    setView("front");
    setZoom(1);
    setSelectedRegion(null);
    setSelectedSymptoms([]);
    setUrgentSelected(null);
    setResultRequested(false);
  };

  const chooseRegion = (regionId: string) => {
    setSelectedRegion(regionId);
    setSelectedSymptoms([]);
    setUrgentSelected(null);
    setResultRequested(false);
  };

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((current) =>
      current.includes(symptomId)
        ? current.filter((item) => item !== symptomId)
        : [...current, symptomId],
    );
    setUrgentSelected(null);
    setResultRequested(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            aria-label="العودة إلى الصفحة الرئيسية"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <ArrowRight className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-black text-primary sm:text-lg">الدليل البصري للجسم</h1>
            <p className="text-[11px] text-muted-foreground">
              نموذج الجسم المحسّن — مراجعة المرحلة الرابعة
            </p>
          </div>
          <span className="rounded-full bg-success/10 px-3 py-1 text-[10px] font-bold text-success">
            خفيف للموبايل
          </span>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent">
              <ScanSearch className="size-4" />
              اختر مكان المشكلة
            </span>
            <h2 className="mb-3 text-3xl font-black text-primary sm:text-4xl">
              حرّك النموذج واضغط على المنطقة
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              اختر رجلًا أو امرأة، ثم بدّل بوضوح بين الأمام والخلف واضغط على مكان الألم. لكل اتجاه
              صورة مستقلة ونقاط اختيار تناسب المناطق الظاهرة فيه.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
            <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
                <div
                  className="flex rounded-xl bg-secondary p-1"
                  role="group"
                  aria-label="اختيار نموذج الجسم"
                >
                  {(["male", "female"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setGender(option);
                        setSelectedRegion(null);
                        setSelectedSymptoms([]);
                        setResultRequested(false);
                      }}
                      className={`min-h-10 rounded-lg px-4 text-xs font-bold transition ${gender === option ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
                    >
                      {option === "male" ? "رجل" : "امرأة"}
                    </button>
                  ))}
                </div>
                <div
                  className="flex rounded-xl bg-secondary p-1"
                  role="group"
                  aria-label="اتجاه الجسم"
                >
                  {(["front", "back"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setView(option);
                        setSelectedRegion(null);
                        setSelectedSymptoms([]);
                        setResultRequested(false);
                      }}
                      className={`min-h-10 rounded-lg px-4 text-xs font-bold transition ${view === option ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
                    >
                      {option === "front" ? "الأمام" : "الخلف"}
                    </button>
                  ))}
                </div>
              </div>

              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerEnd}
                onPointerCancel={() => (dragStart.current = null)}
                className="relative flex min-h-[34rem] touch-none select-none items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/60 to-background p-4 active:cursor-grabbing sm:min-h-[42rem]"
                aria-label={`نموذج ${gender === "male" ? "رجل" : "امرأة"} من ${view === "front" ? "الأمام" : "الخلف"}. اسحب لتغيير الاتجاه`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent)_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.08]" />
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-card/90 px-3 py-2 text-[10px] font-bold text-muted-foreground shadow-sm">
                  <MousePointer2 className="size-3.5 text-accent" />
                  اسحب لتبديل {view === "front" ? "الخلف" : "الأمام"}
                </div>

                <div
                  className="relative h-[31rem] aspect-[16/25] sm:h-[38rem]"
                  style={{
                    transform: `scale(${zoom})`,
                    transition: dragStart.current ? "none" : "transform 180ms ease",
                  }}
                >
                  <img
                    src={bodyAssets[gender][view]}
                    alt={`نموذج جسم ${gender === "male" ? "رجل" : "امرأة"} من ${view === "front" ? "الأمام" : "الخلف"}`}
                    draggable={false}
                    decoding="async"
                    width={512}
                    height={800}
                    className="pointer-events-none h-full w-full rounded-[2rem] object-contain transition-opacity duration-300"
                  />

                  {activeRegions.map((region) => (
                    <button
                      key={region.id}
                      type="button"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => chooseRegion(region.id)}
                      aria-label={`اختيار منطقة ${region.label}`}
                      className={`absolute z-10 flex size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-lg transition hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 ${selectedRegion === region.id ? "border-card bg-accent text-accent-foreground" : "border-accent bg-card/90 text-accent"}`}
                      style={{ top: region.top, right: region.right }}
                    >
                      <span className="size-2 rounded-full bg-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-border px-4 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.max(0.85, value - 0.1))}
                  aria-label="تصغير النموذج"
                  className="flex size-11 items-center justify-center rounded-xl border border-input bg-background text-primary"
                >
                  <Minus className="size-5" />
                </button>
                <div className="flex items-center justify-center gap-2 text-xs font-black text-primary">
                  <Rotate3D className="size-4 text-accent" />
                  {viewLabel} حقيقية
                </div>
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.min(1.35, value + 0.1))}
                  aria-label="تكبير النموذج"
                  className="flex size-11 items-center justify-center rounded-xl border border-input bg-background text-primary"
                >
                  <Plus className="size-5" />
                </button>
              </div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-primary">
                  <Accessibility className="size-5 text-accent" />
                  ١. اختر المنطقة
                </h3>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {(["skin", "teeth", "child"] as const).map((regionId) => (
                    <button
                      key={regionId}
                      type="button"
                      onClick={() => chooseRegion(regionId)}
                      className={`min-h-11 rounded-xl border px-2 text-xs font-bold transition ${selectedRegion === regionId ? "border-accent bg-accent text-accent-foreground" : "border-input bg-background text-primary"}`}
                    >
                      {regionMappings[regionId]!.label}
                    </button>
                  ))}
                </div>
                {selectedMapping ? (
                  <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
                    <span className="mb-2 flex items-center gap-2 text-sm font-bold text-success">
                      <Check className="size-4" />
                      تم اختيار {selectedMapping.label}
                    </span>
                    <p className="text-xs leading-6 text-muted-foreground">
                      اختر من الأعراض التالية ما ينطبق عليك.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-input bg-background p-4 text-center">
                    <UserRound className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                    <p className="text-xs leading-6 text-muted-foreground">
                      اختر الأمام أو الخلف واضغط على إحدى النقاط الظاهرة على الجسم.
                    </p>
                  </div>
                )}
              </section>

              {selectedMapping && (
                <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                  <h3 className="mb-4 font-bold text-primary">٢. حدّد الأعراض</h3>
                  <div className="grid gap-2">
                    {selectedMapping.symptoms.map((symptom) => {
                      const selected = selectedSymptoms.includes(symptom.id);
                      return (
                        <button
                          key={symptom.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleSymptom(symptom.id)}
                          className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 text-right text-xs font-bold transition ${selected ? "border-accent bg-accent/10 text-primary" : "border-input bg-background text-muted-foreground"}`}
                        >
                          <span
                            className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${selected ? "border-accent bg-accent text-accent-foreground" : "border-input"}`}
                          >
                            {selected && <Check className="size-3.5" />}
                          </span>
                          {symptom.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
                    <h4 className="mb-2 flex items-center gap-2 text-xs font-black text-destructive">
                      <AlertTriangle className="size-4" />
                      هل يوجد عرض طارئ؟
                    </h4>
                    <div className="space-y-1.5">
                      {urgentSymptoms.map((symptom) => (
                        <button
                          key={symptom.id}
                          type="button"
                          onClick={() => {
                            setUrgentSelected(symptom.id);
                            setSelectedSymptoms([]);
                            setResultRequested(false);
                          }}
                          className={`w-full rounded-lg border px-3 py-2 text-right text-[11px] font-bold ${urgentSelected === symptom.id ? "border-destructive bg-destructive text-destructive-foreground" : "border-destructive/20 bg-card text-destructive"}`}
                        >
                          {symptom.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {urgentSelected ? (
                    <div
                      role="alert"
                      className="mt-4 rounded-2xl bg-destructive p-4 text-destructive-foreground"
                    >
                      <p className="mb-1 flex items-center gap-2 text-sm font-black">
                        <AlertTriangle className="size-5" />
                        قد تكون هذه حالة طارئة
                      </p>
                      <p className="text-xs leading-6">
                        اطلب المساعدة الطبية العاجلة الآن أو اتصل برقم الطوارئ المحلي. لا تنتظر
                        اقتراح تخصص من الموقع.
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={selectedSymptoms.length === 0}
                      onClick={() => setResultRequested(true)}
                      className="mt-4 min-h-12 w-full rounded-xl bg-accent px-4 text-sm font-black text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      اعرض التخصص المقترح
                    </button>
                  )}

                  {resultRequested && !urgentSelected && (
                    <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 p-4">
                      {recommendation ? (
                        <>
                          <p className="text-xs text-muted-foreground">التخصص المقترح</p>
                          <p className="my-1 text-xl font-black text-primary">{recommendation}</p>
                          <p className="text-xs leading-6 text-muted-foreground">
                            هذا اقتراح للتخصص فقط، وليس تشخيصًا أو علاجًا.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-black text-primary">النتيجة غير حاسمة</p>
                          <p className="mt-1 text-xs leading-6 text-muted-foreground">
                            لم نتمكن من تحديد التخصص المناسب من الخيارات المتاحة. تواصل معنا عبر
                            واتساب وسنساعدك.
                          </p>
                          <button
                            type="button"
                            disabled
                            title="سيتم تفعيل الرقم عند إضافته من لوحة الإدارة"
                            className="mt-3 min-h-10 w-full rounded-lg border border-input bg-card text-xs font-bold text-muted-foreground opacity-60"
                          >
                            واتساب — الرقم غير مضاف بعد
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </section>
              )}

              <section className="rounded-3xl border border-accent/15 bg-accent/5 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
                  <Info className="size-4 text-accent" />
                  إرشاد آمن
                </h3>
                <p className="text-xs leading-6 text-muted-foreground">
                  الاقتراح مبني على اختيارات ثابتة لتوجيهك إلى تخصص فقط. لا يستخدم الذكاء الاصطناعي
                  ولا يقدّم تشخيصًا. النماذج رسومات إرشادية لتحديد المنطقة وليست صورًا تشريحية
                  للتشخيص.
                </p>
                <p className="mt-2 flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                  <VenusAndMars className="size-3.5 text-accent" />
                  نموذج الرجل والمرأة، والأمام والخلف، صور مستقلة فعلًا.
                </p>
              </section>

              <button
                type="button"
                onClick={resetView}
                className="min-h-12 w-full rounded-xl border border-input bg-card px-5 text-sm font-bold text-primary"
              >
                إعادة ضبط العرض
              </button>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
