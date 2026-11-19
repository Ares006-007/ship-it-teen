"use client";

import Image from "next/image";
import partners from "@/data/partners";

/**
 * Partner Logo Banner
 * Section directly below Hero ticker and above 01 // THE MANIFESTO.
 * 
 * - Infinite horizontal right-to-left marquee (CSS translateX keyframe only)
 * - 40s desktop, 28s mobile, pause on hover (desktop only)
 * - Mask-image edge fade
 * - Logos kept in full original color (no grayscale)
 * - First set accessible (real alt, focusable); all duplicates aria-hidden & tabIndex -1
 * - prefers-reduced-motion renders static wrapping row with no animation
 */
export function PartnerBanner() {
  // 8 logos repeated 3 times = 24 logos per block (fills > 2x viewport width across all screens)
  const REPEATS = 3;
  const logoSet = Array.from({ length: REPEATS }, () => partners).flat();

  return (
    <section
      className="relative py-10 md:py-14 bg-white border-b-4 border-black overflow-hidden"
      aria-label="Partners"
    >
      {/* Label */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-black/40 uppercase font-mono select-none">
          Partners we've worked with
        </span>
      </div>

      {/* Marquee with left/right fade mask */}
      <div className="partner-marquee-mask overflow-hidden w-full">
        <div className="partner-marquee-track flex w-max">
          {/* Block 1: Real set (first set focusable) + repeated fillers for width */}
          <div className="flex items-center gap-16 pr-16 shrink-0" role="list">
            {logoSet.map((partner, i) => {
              const isFirstSet = i < partners.length;
              return (
                <a
                  key={`primary-${i}`}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isFirstSet ? 0 : -1}
                  aria-hidden={isFirstSet ? undefined : true}
                  role={isFirstSet ? "listitem" : undefined}
                  className="shrink-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <Image
                    src={partner.logo}
                    alt={isFirstSet ? partner.alt : ""}
                    className="h-[40px] md:h-[56px] w-auto object-contain opacity-100 hover:opacity-80 transition-opacity duration-200"
                    loading={isFirstSet ? "eager" : "lazy"}
                    draggable={false}
                  />
                </a>
              );
            })}
          </div>

          {/* Block 2: Duplicated whole set for seamless loop (completely aria-hidden & non-focusable) */}
          <div className="flex items-center gap-16 pr-16 shrink-0" aria-hidden="true">
            {logoSet.map((partner, i) => (
              <a
                key={`duplicate-${i}`}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                className="shrink-0 flex items-center justify-center focus:outline-none"
              >
                <Image
                  src={partner.logo}
                  alt=""
                  className="h-[40px] md:h-[56px] w-auto object-contain opacity-100 hover:opacity-80 transition-opacity duration-200"
                  loading="lazy"
                  draggable={false}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Static row under prefers-reduced-motion */}
      <div className="partner-static-row hidden max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6">
          {partners.map((partner) => (
            <a
              key={`static-${partner.name}`}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <Image
                src={partner.logo}
                alt={partner.alt}
                className="h-[40px] md:h-[56px] w-auto object-contain opacity-100 hover:opacity-80 transition-opacity duration-200"
                loading="eager"
                draggable={false}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
