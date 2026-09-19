import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Show wordmark text next to the mark */
  withWordmark?: boolean;
  /** Invert for dark backgrounds */
  inverted?: boolean;
  /** Pixel size of the mark */
  size?: number;
  /** Optional compact mode (mark only) */
  markOnly?: boolean;
};

/**
 * Official TAE brand mark.
 * Uses the company logo (head + neural network + circular wordmark).
 */
export function BrandLogo({
  className,
  withWordmark = true,
  inverted = false,
  size = 44,
  markOnly = false,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-white",
          inverted && "ring-1 ring-white/15",
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/tae-logo.svg"
          alt="TurnAround Experts"
          width={size * 2}
          height={size * 2}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      {!markOnly && withWordmark ? (
        <span className="leading-none">
          <span
            className={cn(
              "block text-[15px] font-semibold tracking-tight",
              inverted ? "text-paper" : "text-navy-900",
            )}
          >
            TurnAround Experts
          </span>
          <span
            className={cn(
              "mt-1 block text-[11px] uppercase tracking-[0.18em]",
              inverted ? "text-ink-300/80" : "text-ink-500",
            )}
          >
            TAE · Palanpur
          </span>
        </span>
      ) : null}
    </span>
  );
}

/** Inline SVG version for places where next/image is inconvenient (emails, etc.) */
export function BrandMarkSvg({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/tae-logo.svg"
      alt="TurnAround Experts"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}
