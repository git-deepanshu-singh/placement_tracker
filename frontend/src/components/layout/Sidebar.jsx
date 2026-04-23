import { Bell, ChartSpline, LayoutDashboard, LogOut, ShieldCheck, UserRound, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import logo from '../../assets/logo.svg';

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/drives', label: 'Drives', icon: ShieldCheck },
  { to: '/analytics', label: 'Analytics', icon: ChartSpline },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export function Sidebar({ role, onLogout }) {
  const filteredItems = [
    ...navItems,
    ...(role !== 'student' ? [{ to: '/users', label: 'Users', icon: Users }] : []),
  ];

  return (
    <>
      <aside className="glass-panel rounded-[1.5rem] p-4 lg:hidden">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <img src={logo} alt="MIET logo" className="h-11 w-auto shrink-0 rounded-xl border border-[var(--line)] bg-white/70 p-2" />
              <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">MIET Meerut</p>
              <h1 className="mt-2 font-display text-2xl leading-tight">Placement Tracker</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>

          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {filteredItems.map((item) => {
              const NavIcon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `inline-flex min-w-max items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? 'bg-[var(--accent)] text-white' : 'border border-[var(--line)] text-[var(--muted)]'
                    }`
                  }
                >
                  <NavIcon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      <aside className="glass-panel sticky top-6 hidden h-[calc(100vh-3rem)] w-72 rounded-[2rem] p-6 lg:flex lg:flex-col">
        <div className="flex items-start gap-4">
          <img src={logo} alt="MIET logo" className="h-14 w-auto shrink-0 rounded-2xl border border-[var(--line)] bg-white/70 p-2" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">MIET Meerut</p>
            <h1 className="mt-3 font-display text-3xl leading-tight">Placement Tracker</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Enterprise workflow for students, faculty, and placement administrators.</p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          {filteredItems.map((item) => {
            const NavIcon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-[var(--accent)] text-white' : 'text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`
                }
              >
                <NavIcon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={onLogout}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </aside>
    </>
  );
}
