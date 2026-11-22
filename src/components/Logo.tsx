import { useId } from "react";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 44, className }: LogoMarkProps) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2F7BE8" />
          <stop offset="1" stopColor="#0B3B8C" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#${gradientId})`} />
      <rect x="0.5" y="0.5" width="47" height="47" rx="13.5" stroke="white" strokeOpacity="0.16" />
      <path
        d="M16 11.5h10.7L34 18.8V33a3.5 3.5 0 0 1-3.5 3.5h-14A3.5 3.5 0 0 1 13 33V15a3.5 3.5 0 0 1 3-3.5Z"
        fill="white"
        fillOpacity="0.96"
      />
      <path d="M26.5 11.8V19H34" stroke="#BFD7FF" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="m19.2 27.6 3.2 3.2 6.6-7.3"
        stroke="#1D4ED8"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
