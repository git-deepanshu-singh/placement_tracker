import { MoonStar, SunMedium } from 'lucide-react';

export function Topbar({ user, theme, onThemeToggle }) {
  const nextTheme = theme === 'miet-dark' ? 'miet-light' : 'miet-dark';
  const icon = nextTheme === 'miet-dark' ? <MoonStar size={18} /> : <SunMedium size={18} />;
  const label = nextTheme === 'miet-dark' ? 'Dark' : 'Light';

  return (
    <header className="glass-panel flex flex-col gap-4 rounded-[1.5rem] p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--muted)]">Welcome back</p>
        <h2 className="truncate font-display text-2xl sm:text-3xl">{user?.fullName}</h2>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        <div className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-center text-sm font-semibold text-[var(--accent)]">
          {user?.role?.toUpperCase()}
        </div>
        <button
          type="button"
          onClick={() => onThemeToggle(nextTheme)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--line)] px-4 py-3 text-sm font-semibold"
        >
          {icon}
          {label}
        </button>
      </div>
    </header>
  );
}
