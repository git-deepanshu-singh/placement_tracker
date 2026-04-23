import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { updateProfile } from '../store/slices/authSlice.js';

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    department: user?.department || '',
    batch: user?.batch || '',
    skills: user?.skills?.join(', ') || '',
    strengths: user?.strengths?.join(', ') || '',
    weaknesses: user?.weaknesses?.join(', ') || '',
    academics: {
      tenthPercentage: user?.academics?.tenthPercentage || 0,
      twelfthPercentage: user?.academics?.twelfthPercentage || 0,
      cgpa: user?.academics?.cgpa || 0,
      semester: user?.academics?.semester || '',
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await dispatch(
      updateProfile({
        ...form,
        skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
        strengths: form.strengths.split(',').map((item) => item.trim()).filter(Boolean),
        weaknesses: form.weaknesses.split(',').map((item) => item.trim()).filter(Boolean),
      }),
    );
  };

  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <h3 className="section-title">Profile & Readiness</h3>
      <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
        <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Full name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
        <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Mobile" value={form.mobile} onChange={(event) => setForm((current) => ({ ...current, mobile: event.target.value }))} />
        <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Department" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} />
        <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Batch" value={form.batch} onChange={(event) => setForm((current) => ({ ...current, batch: event.target.value }))} />
        <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="10th %" type="number" value={form.academics.tenthPercentage} onChange={(event) => setForm((current) => ({ ...current, academics: { ...current.academics, tenthPercentage: Number(event.target.value) } }))} />
        <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="12th %" type="number" value={form.academics.twelfthPercentage} onChange={(event) => setForm((current) => ({ ...current, academics: { ...current.academics, twelfthPercentage: Number(event.target.value) } }))} />
        <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Current CGPA" type="number" step="0.01" value={form.academics.cgpa} onChange={(event) => setForm((current) => ({ ...current, academics: { ...current.academics, cgpa: Number(event.target.value) } }))} />
        <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Current semester" type="number" min="1" max="12" value={form.academics.semester} onChange={(event) => setForm((current) => ({ ...current, academics: { ...current.academics, semester: event.target.value === '' ? '' : Number(event.target.value) } }))} />
        <textarea className="min-h-28 rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none lg:col-span-2" placeholder="Skills (comma separated)" value={form.skills} onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))} />
        <textarea className="min-h-28 rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Strengths (comma separated)" value={form.strengths} onChange={(event) => setForm((current) => ({ ...current, strengths: event.target.value }))} />
        <textarea className="min-h-28 rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Weaknesses (comma separated)" value={form.weaknesses} onChange={(event) => setForm((current) => ({ ...current, weaknesses: event.target.value }))} />
        <button className="rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold text-white lg:col-span-2">Save profile</button>
      </form>
    </section>
  );
}
