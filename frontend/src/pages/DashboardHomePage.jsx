import { useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { StatCard } from '../components/common/StatCard.jsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { fetchOverviewAnalytics, fetchStudentAnalytics } from '../store/slices/analyticsSlice.js';
import { fetchDrives } from '../store/slices/driveSlice.js';

export function DashboardHomePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: drives } = useAppSelector((state) => state.drives);
  const { overview, student } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchDrives());
    if (user?.role === 'student') {
      dispatch(fetchStudentAnalytics());
    } else {
      dispatch(fetchOverviewAnalytics());
    }
  }, [dispatch, user?.role]);

  if (user?.role === 'student') {
    return (
      <div className="space-y-6">
        <section className="grid gap-5 xl:grid-cols-3">
          <StatCard title="Readiness Score" value={`${student?.readinessScore || 0}%`} detail="Placement-ready index" accent="rgba(17,100,102,0.14)" />
          <StatCard title="Strength Signals" value={student?.strengths?.length || 0} detail="Resume differentiators" accent="rgba(31,157,117,0.14)" />
          <StatCard title="Active Opportunities" value={drives.length} detail="Eligible drives" accent="rgba(217,125,84,0.14)" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel rounded-[2rem] p-6">
            <h3 className="section-title">Application Journey</h3>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={student?.applications || []}>
                  <CartesianGrid stroke="rgba(148,163,184,0.18)" vertical={false} />
                  <XAxis dataKey="companyName" stroke="var(--muted)" />
                  <YAxis stroke="var(--muted)" />
                  <Tooltip />
                  <Bar dataKey="packageLpa" radius={[12, 12, 0, 0]} fill="var(--accent)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] p-6">
            <h3 className="section-title">Growth Focus</h3>
            <div className="mt-6 grid gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--accent)]">Strengths</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(student?.strengths || ['Problem Solving', 'Communication']).map((item) => (
                    <span key={item} className="rounded-full bg-[var(--accent-soft)] px-3 py-2 text-sm font-medium text-[var(--accent)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--accent-2)]">Weaknesses</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(student?.weaknesses || ['Mock interview exposure']).map((item) => (
                    <span key={item} className="rounded-full bg-black/5 px-3 py-2 text-sm font-medium text-[var(--muted)] dark:bg-white/5">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-5 xl:grid-cols-4">
        <StatCard title="Total Students" value={overview?.summary?.totalStudents || 0} detail="Campus talent pool" accent="rgba(17,100,102,0.14)" />
        <StatCard title="Faculty Coordinators" value={overview?.summary?.totalFaculty || 0} detail="Active coordinators" accent="rgba(112,214,255,0.14)" />
        <StatCard title="Placement Drives" value={overview?.summary?.totalDrives || 0} detail="Published drives" accent="rgba(217,125,84,0.14)" />
        <StatCard title="Placed Students" value={overview?.summary?.totalPlaced || 0} detail="Confirmed selections" accent="rgba(31,157,117,0.14)" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h3 className="section-title">Yearly Drive Activity</h3>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.yearly || []}>
                <CartesianGrid stroke="rgba(148,163,184,0.18)" vertical={false} />
                <XAxis dataKey="_id" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip />
                <Bar dataKey="totalDrives" radius={[12, 12, 0, 0]} fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h3 className="section-title">Company-Wise Selections</h3>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={overview?.companyWise || []} dataKey="selected" nameKey="_id" outerRadius={110}>
                  {(overview?.companyWise || []).map((entry, index) => (
                    <Cell key={`${entry._id}-${index}`} fill={['#116466', '#d97d54', '#70d6ff', '#ffd166'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
