"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  function go(i: number) {
    const next = (i + images.length) % images.length;
    setIndex(next);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  // Touch swipe support
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let startX = 0;
    let isDown = false;
    function down(e: TouchEvent) {
      isDown = true;
      startX = e.touches[0].clientX;
    }
    function up(e: TouchEvent) {
      if (!isDown) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) go(index + 1);
        else go(index - 1);
      }
      isDown = false;
    }
    el.addEventListener("touchstart", down, { passive: true });
    el.addEventListener("touchend", up, { passive: true });
    return () => {
      el.removeEventListener("touchstart", down);
      el.removeEventListener("touchend", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  if (images.length === 0) {
    return (
      <div className="grid aspect-[16/10] w-full place-items-center rounded-2xl border border-ink-900/5 bg-paper-deep text-ink-500">
        No preview images yet.
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="relative overflow-hidden rounded-2xl border border-ink-900/5 bg-paper-deep"
      >
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative aspect-[16/10] w-full shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} preview ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(index - 1)}
              className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-paper/30 bg-paper/90 text-navy-900 backdrop-blur transition hover:bg-paper"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(index + 1)}
              className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-paper/30 bg-paper/90 text-navy-900 backdrop-blur transition hover:bg-paper"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => go(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index
                      ? "w-6 bg-paper"
                      : "w-1.5 bg-paper/40 hover:bg-paper/70",
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
          {images.slice(0, 8).map((src, i) => (
            <button
              key={`thumb-${src}-${i}`}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "aspect-[16/10] overflow-hidden rounded-lg border transition",
                i === index
                  ? "border-navy-900"
                  : "border-ink-900/10 hover:border-navy-900/40",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
