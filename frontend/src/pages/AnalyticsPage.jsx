import { useEffect } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { fetchHistoricalAnalytics, fetchOverviewAnalytics, fetchStudentAnalytics } from '../store/slices/analyticsSlice.js';

export function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { overview, historical, student } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    if (user?.role === 'student') {
      dispatch(fetchStudentAnalytics());
    } else {
      dispatch(fetchOverviewAnalytics());
      dispatch(fetchHistoricalAnalytics());
    }
  }, [dispatch, user?.role]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="glass-panel rounded-[2rem] p-6">
        <h3 className="section-title">{user?.role === 'student' ? 'Readiness Narrative' : 'Historical Placement Trends'}</h3>
        <div className="mt-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={user?.role === 'student' ? (student?.applications || []).map((item, index) => ({ year_label: `Drive ${index + 1}`, total_placed: item.packageLpa })) : historical}>
              <CartesianGrid stroke="rgba(148,163,184,0.18)" vertical={false} />
              <XAxis dataKey="year_label" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip />
              <Line type="monotone" dataKey={user?.role === 'student' ? 'total_placed' : 'total_placed'} stroke="var(--accent)" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-6">
        <h3 className="section-title">Analytics Notes</h3>
        <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted)]">
          <p>All analytics on this screen now come directly from MongoDB, so placement summaries and yearly trends stay in one database.</p>
          <p>When applications are updated, the dashboard reflects the latest selected counts, company performance, and yearly placement data directly from MongoDB.</p>
          {overview?.companyWise?.length ? (
            <div className="rounded-[1.5rem] border border-[var(--line)] p-4">
              <p className="font-semibold text-[var(--text)]">Top Companies</p>
              <div className="mt-3 space-y-2">
                {overview.companyWise.slice(0, 4).map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span>{item._id}</span>
                    <span className="font-semibold text-[var(--text)]">{item.selected}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
