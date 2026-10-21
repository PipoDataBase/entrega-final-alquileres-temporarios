export function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#1C1915" />
      <path d="M4.5 25 L12 8.5 L16.2 15.4 L21.2 7 L27.5 25 Z" fill="#C45C26" />
    </svg>
  );
}
