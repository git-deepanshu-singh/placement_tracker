import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { fetchNotifications, sendNotification } from '../store/slices/notificationSlice.js';
import { showFlashMessage } from '../store/slices/uiSlice.js';

export function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.notifications);
  const { user } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({
    title: '',
    message: '',
    audience: 'student',
    type: 'announcement',
  });

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(sendNotification(form));
    if (!result.error) {
      dispatch(showFlashMessage({ type: 'success', text: 'Notification sent successfully.' }));
      setForm({ title: '', message: '', audience: 'student', type: 'announcement' });
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Unable to send notification.' }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      {user?.role !== 'student' ? (
        <section className="glass-panel rounded-[2rem] p-6">
          <h3 className="section-title">Broadcast Update</h3>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Notification title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            <textarea className="min-h-36 w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Message" value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} />
            <div className="grid gap-4 md:grid-cols-2">
              <select className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))}>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="all">All</option>
              </select>
              <select className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>
                <option value="announcement">Announcement</option>
                <option value="drive">Drive</option>
                <option value="deadline">Deadline</option>
                <option value="system">System</option>
              </select>
            </div>
            <button className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold text-white">Send notification</button>
          </form>
        </section>
      ) : null}

      <section className="glass-panel rounded-[2rem] p-6">
        <h3 className="section-title">Notification Feed</h3>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <article key={item._id} className="rounded-[1.5rem] border border-[var(--line)] p-4">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-display text-xl">{item.title}</h4>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  {item.type}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.message}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
