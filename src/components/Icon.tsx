import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size = 18, extra?: SVGProps<SVGSVGElement>) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...extra,
  };
}

export function IconArrowRight({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

export function IconArrowLeft({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M19 12H5" />
      <path d="M11 5l-7 7 7 7" />
    </svg>
  );
}

export function IconInfo({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8.5h.01" />
      <path d="M11 12h1v4h1" />
    </svg>
  );
}

export function IconShare({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v14" />
    </svg>
  );
}

export function IconLink({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07L11 6" />
      <path d="M14 10a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07L13 18" />
    </svg>
  );
}

export function IconCheck({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function IconClose({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export function IconCompass({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5L13 13l-3.5 1.5L11 11z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBalance({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M3 11l4-4 4 4-2 4H5z" />
      <path d="M13 11l4-4 4 4-2 4h-4z" />
    </svg>
  );
}

export function IconChevronDown({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconSparkle({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z" />
    </svg>
  );
}
