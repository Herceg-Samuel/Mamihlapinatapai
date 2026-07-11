// src/components/viz/ScrollChart.tsx
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollChart() {
  const containerRef = useRef < HTMLDivElement > null;
  const pathRef = useRef < SVGPathElement > null;
  const dotRef = useRef < SVGCircleElement > null;

  useGSAP(
    () => {
      // Safety check for TypeScript
      if (!pathRef.current || !dotRef.current) return;

      // 1. Get the raw total length of the SVG path
      const pathLength = pathRef.current.getTotalLength();

      // 2. Set the initial state: Hide the line by pushing the dash offset to the full length
      gsap.set(pathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // Hide the tracking dot initially
      gsap.set(dotRef.current, { opacity: 0 });

      // 3. Create the ScrollTrigger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current, // Start animating when this container enters the screen
          start: "top center", // Start when the top of the chart hits the center of the viewport
          end: "bottom center", // End when the bottom of the chart hits the center
          scrub: 1, // "Scrub" links the animation directly to the scrollbar (1 sec lag for smoothness)
        },
      });

      // Fade the dot in, trace the path, and fade the dot out at the end
      tl.to(dotRef.current, { opacity: 1, duration: 0.1 })
        .to(pathRef.current, { strokeDashoffset: 0, duration: 2, ease: "none" })
        .to(dotRef.current, { opacity: 0, duration: 0.1 });
    },
    { scope: containerRef },
  ); // Scoping prevents GSAP from accidentally selecting elements outside this component

  return (
    <div
      ref={containerRef}
      className="my-12 w-full p-6 border border-gray-200 bg-white shadow-sm rounded-md not-prose"
    >
      <div className="mb-4 text-sm font-mono text-gray-500 uppercase tracking-widest flex justify-between">
        <span>Fig 1. Inverse Panic Ratio</span>
        <span className="text-red-500 animate-pulse">Live</span>
      </div>

      <svg viewBox="0 0 800 400" className="w-full h-auto overflow-visible">
        {/* Y and X Axes */}
        <path
          d="M 50 20 V 350 H 750"
          stroke="#e5e7eb"
          strokeWidth="2"
          fill="none"
        />

        {/* Labels */}
        <text
          x="30"
          y="30"
          className="text-xs font-mono fill-gray-400"
          transform="rotate(-90 30 30)"
        >
          Panic Level
        </text>
        <text x="700" y="380" className="text-xs font-mono fill-gray-400">
          Time (Months)
        </text>

        {/* Static Background Line: Expectations */}
        <path
          d="M 50 50 Q 400 100, 750 350"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeDasharray="4,4"
          fill="none"
        />
        <text x="630" y="340" className="text-[10px] font-mono fill-gray-400">
          Expectations
        </text>

        {/* The Animated Line: Torschlusspanik */}
        <path
          ref={pathRef}
          d="M 50 350 Q 300 350, 500 200 T 750 20"
          stroke="#ef4444"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tracking Dot */}
        <circle ref={dotRef} cx="750" cy="20" r="6" fill="#ef4444" />
      </svg>

      <p className="mt-6 text-sm text-gray-500 italic text-center">
        Scroll down to observe the exponential decay of sanity.
      </p>
    </div>
  );
}
