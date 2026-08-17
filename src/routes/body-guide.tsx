import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accessibility,
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

import body3d from "@/assets/body-3d.png";

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

const bodyRegions = [
  { id: "head", label: "الرأس", top: "15%", right: "50%" },
  { id: "ear", label: "الأذن", top: "20%", right: "39%" },
  { id: "chest", label: "الصدر", top: "34%", right: "50%" },
  { id: "abdomen", label: "البطن", top: "46%", right: "50%" },
  { id: "arm", label: "الذراع", top: "43%", right: "25%" },
  { id: "knee", label: "الركبة", top: "70%", right: "39%" },
] as const;

type Gender = "male" | "female";

function BodyGuidePrototype() {
  const [gender, setGender] = useState<Gender>("male");
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; rotation: number } | null>(null);

  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const isFrontVisible = normalizedRotation <= 70 || normalizedRotation >= 290;
  const viewLabel = useMemo(() => {
    if (normalizedRotation <= 45 || normalizedRotation >= 315) return "واجهة أمامية";
    if (normalizedRotation < 135) return "الجانب الأيسر";
    if (normalizedRotation <= 225) return "واجهة خلفية تجريبية";
    return "الجانب الأيمن";
  }, [normalizedRotation]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX, rotation };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const delta = event.clientX - dragStart.current.x;
    setRotation(dragStart.current.rotation + delta * 0.7);
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const resetView = () => {
    setRotation(0);
    setZoom(1);
    setSelectedRegion(null);
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
            <p className="text-[11px] text-muted-foreground">Prototype — المرحلة الرابعة</p>
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
              اسحب يمينًا أو يسارًا للدوران، واستخدم التكبير لرؤية المنطقة بوضوح. اختيار الأعراض
              والتخصص سيُضاف في المرحلة الخامسة.
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
                      onClick={() => setGender(option)}
                      className={`min-h-10 rounded-lg px-4 text-xs font-bold transition ${gender === option ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
                    >
                      {option === "male" ? "رجل" : "امرأة"}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Rotate3D className="size-4 text-accent" />
                  {viewLabel}
                </div>
              </div>

              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerEnd}
                onPointerCancel={() => (dragStart.current = null)}
                className="relative flex min-h-[34rem] touch-none select-none items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/60 to-background p-4 active:cursor-grabbing sm:min-h-[42rem]"
                aria-label="اسحب لتدوير نموذج الجسم"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent)_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.08]" />
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-card/90 px-3 py-2 text-[10px] font-bold text-muted-foreground shadow-sm">
                  <MousePointer2 className="size-3.5 text-accent" />
                  اسحب للدوران
                </div>

                <div
                  className="relative h-[31rem] aspect-[16/25] sm:h-[38rem]"
                  style={{
                    transform: `scale(${zoom})`,
                    transition: dragStart.current ? "none" : "transform 180ms ease",
                  }}
                >
                  <img
                    src={body3d}
                    alt={`نموذج جسم ${gender === "male" ? "رجل" : "امرأة"} تجريبي`}
                    draggable={false}
                    width={512}
                    height={800}
                    className={`pointer-events-none h-full w-full rounded-[3rem] object-cover mix-blend-multiply transition-[filter] duration-300 ${gender === "female" ? "contrast-[0.96] hue-rotate-[8deg]" : ""}`}
                    style={{
                      transform: `perspective(900px) rotateY(${rotation}deg) scaleX(${gender === "female" ? 0.94 : 1})`,
                      transition: dragStart.current ? "none" : "transform 180ms ease",
                    }}
                  />

                  {isFrontVisible &&
                    bodyRegions.map((region) => (
                      <button
                        key={region.id}
                        type="button"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={() => setSelectedRegion(region.label)}
                        aria-label={`اختيار منطقة ${region.label}`}
                        className={`absolute z-10 flex size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-lg transition hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 ${selectedRegion === region.label ? "border-card bg-accent text-accent-foreground" : "border-accent bg-card/90 text-accent"}`}
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
                <label className="block">
                  <span className="sr-only">درجة دوران النموذج</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={Math.round(normalizedRotation)}
                    onChange={(event) => setRotation(Number(event.target.value))}
                    className="w-full accent-[var(--color-accent)]"
                  />
                </label>
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
                  المنطقة المحددة
                </h3>
                {selectedRegion ? (
                  <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
                    <span className="mb-2 flex items-center gap-2 text-sm font-bold text-success">
                      <Check className="size-4" />
                      تم اختيار {selectedRegion}
                    </span>
                    <p className="text-xs leading-6 text-muted-foreground">
                      في المرحلة التالية ستظهر الأعراض المرتبطة بهذه المنطقة لاختيار التخصص المناسب
                      فقط.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-input bg-background p-4 text-center">
                    <UserRound className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                    <p className="text-xs leading-6 text-muted-foreground">
                      أعد النموذج للواجهة الأمامية واضغط على إحدى النقاط.
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-accent/15 bg-accent/5 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
                  <Info className="size-4 text-accent" />
                  حدود النموذج الأولي
                </h3>
                <ul className="space-y-2 text-xs leading-5 text-muted-foreground">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                    الدوران والتكبير واختيار المناطق تعمل.
                  </li>
                  <li className="flex gap-2">
                    <VenusAndMars className="mt-0.5 size-3.5 shrink-0 text-accent" />
                    تبديل نموذج رجل/امرأة متاح كتجربة واجهة.
                  </li>
                  <li className="flex gap-2">
                    <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    الصورة الحالية أصل بصري تجريبي وليست نموذجًا تشريحيًا كاملًا.
                  </li>
                </ul>
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
