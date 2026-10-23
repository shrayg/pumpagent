export const LogoMark = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="8" className="fill-accent" />
    <path
      d="M8.5 21.5 14 16l3.5 3.5 6-7"
      className="stroke-accent-ink"
      fill="none"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.75 12.5h4.75v4.75"
      className="stroke-accent-ink"
      fill="none"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Logo = ({ className = "", markClassName = "w-7 h-7" }) => (
  <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
    <LogoMark className={markClassName} />
    <span className="text-[15px] font-semibold tracking-tight text-fg">
      Pump Agent
    </span>
  </span>
);

export default Logo;
