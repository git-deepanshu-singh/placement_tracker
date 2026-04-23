import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import logo from '../assets/logo.svg';
import { RoleScene } from '../components/three/RoleScene.jsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { forgotPassword, loginUser, registerUser, resetPassword } from '../store/slices/authSlice.js';
import { showFlashMessage } from '../store/slices/uiSlice.js';

const roleDescriptions = {
  admin: 'Global control across users, analytics, drives, and communications.',
  faculty: 'Manage student readiness, drive postings, forms, and notifications.',
  student: 'Track eligibility, apply to drives, and monitor placement readiness.',
};

const initialRegister = {
  role: 'student',
  fullName: '',
  rollNo: '',
  employeeId: '',
  email: '',
  mobile: '',
  password: '',
  department: 'CSE',
  batch: '2026',
  academics: {
    tenthPercentage: '',
    twelfthPercentage: '',
    cgpa: '',
    semester: '',
  },
};

const MotionSection = motion.section;

const syncRegisterRole = (current, nextRole) => ({
  ...current,
  role: nextRole,
  rollNo: nextRole === 'student' ? current.rollNo : '',
  employeeId: nextRole === 'student' ? '' : current.employeeId,
  department: nextRole === 'student' ? current.department : '',
  batch: nextRole === 'student' ? current.batch : '',
  academics:
    nextRole === 'student'
      ? current.academics
      : {
          tenthPercentage: '',
          twelfthPercentage: '',
          cgpa: '',
          semester: '',
        },
});

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const resetToken = searchParams.get('resetToken');
  const resetEmail = searchParams.get('email') || '';

  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('student');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [forgotForm, setForgotForm] = useState({ email: '' });
  const [resetForm, setResetForm] = useState({ password: '', confirmPassword: '' });
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const isStudentRegistration = role === 'student';
  const isAdminRegistration = role === 'admin';

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setRegisterForm((current) => syncRegisterRole(current, nextRole));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const result = await dispatch(loginUser(loginForm));
    if (!result.error) {
      dispatch(showFlashMessage({ type: 'success', text: 'Logged in successfully.' }));
      navigate('/');
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Login failed.' }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const payload = isStudentRegistration
      ? {
          ...registerForm,
          role,
          academics: {
            ...registerForm.academics,
            tenthPercentage: registerForm.academics.tenthPercentage === '' ? 0 : registerForm.academics.tenthPercentage,
            twelfthPercentage: registerForm.academics.twelfthPercentage === '' ? 0 : registerForm.academics.twelfthPercentage,
            cgpa: registerForm.academics.cgpa === '' ? 0 : registerForm.academics.cgpa,
          },
        }
      : {
          role,
          fullName: registerForm.fullName,
          employeeId: registerForm.employeeId,
          email: registerForm.email,
          mobile: registerForm.mobile,
          password: registerForm.password,
        };

    const result = await dispatch(registerUser(payload));
    if (!result.error) {
      dispatch(showFlashMessage({ type: 'success', text: 'Registration completed successfully.' }));
      navigate('/');
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Registration failed.' }));
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    const result = await dispatch(forgotPassword(forgotForm));

    if (!result.error) {
      dispatch(showFlashMessage({ type: 'success', text: result.payload || 'Password reset link sent successfully.' }));
      setForgotForm({ email: '' });
      setMode('login');
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Unable to send reset link.' }));
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (resetForm.password !== resetForm.confirmPassword) {
      dispatch(showFlashMessage({ type: 'error', text: 'New password and confirm password must match.' }));
      return;
    }

    const result = await dispatch(
      resetPassword({
        token: resetToken,
        password: resetForm.password,
      }),
    );

    if (!result.error) {
      dispatch(showFlashMessage({ type: 'success', text: result.payload || 'Password reset successfully.' }));
      setResetForm({ password: '', confirmPassword: '' });
      setSearchParams({});
      setMode('login');
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Unable to reset password.' }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(17,100,102,0.20),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(217,125,84,0.18),_transparent_35%)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-start gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel rounded-[2rem] p-5 sm:p-8 md:p-10">
          <div className="flex items-center gap-4">
            <img src={logo} alt="MIET logo" className="h-14 w-auto rounded-2xl border border-[var(--line)] bg-white/80 p-2 sm:h-16" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Meerut Institute of Engineering and Technology</p>
          </div>
          <h1 className="mt-5 max-w-xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl xl:text-6xl">
            Placement operations with real-time visibility and premium student experience.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)]">
            A unified enterprise dashboard for placement drives, analytics, Google Forms workflows, and role-based engagement across the MIET campus ecosystem.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {['admin', 'faculty', 'student'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleRoleChange(item)}
                className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                  role === item ? 'border-transparent bg-[var(--accent)] text-white' : 'border-[var(--line)] bg-white/30 text-[var(--text)]'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em]">{item}</p>
                <p className={`mt-2 text-sm ${role === item ? 'text-white/85' : 'text-[var(--muted)]'}`}>{roleDescriptions[item]}</p>
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-[var(--muted)]">
            Public signup is available for <span className="font-semibold text-[var(--text)]">student</span> and <span className="font-semibold text-[var(--text)]">faculty</span>. Admin login uses the seeded admin account from backend environment variables.
          </p>

          <div className="mt-8 hidden lg:block">
            <RoleScene role={role} />
          </div>
        </section>

        <MotionSection
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-[2rem] p-5 sm:p-8 md:p-10"
        >
          <div className="flex rounded-full bg-black/5 p-1 dark:bg-white/5">
            {['login', 'register', 'forgot'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold capitalize transition ${
                  mode === item ? 'bg-[var(--text)] text-[var(--bg)]' : 'text-[var(--muted)]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {resetToken ? (
            <form className="mt-8 space-y-4" onSubmit={handleResetPassword}>
              <p className="text-sm leading-6 text-[var(--muted)]">
                Resetting password for <span className="font-semibold text-[var(--text)]">{resetEmail || 'your account'}</span>.
              </p>
              <input
                className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none"
                placeholder="New password"
                type="password"
                value={resetForm.password}
                onChange={(event) => setResetForm((current) => ({ ...current, password: event.target.value }))}
              />
              <input
                className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none"
                placeholder="Confirm new password"
                type="password"
                value={resetForm.confirmPassword}
                onChange={(event) => setResetForm((current) => ({ ...current, confirmPassword: event.target.value }))}
              />
              <button className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold text-white" disabled={loading}>
                {loading ? 'Resetting password...' : 'Reset password'}
              </button>
              <button
                type="button"
                className="w-full rounded-2xl border border-[var(--line)] px-5 py-4 text-sm font-semibold"
                onClick={() => {
                  setSearchParams({});
                  setMode('login');
                }}
              >
                Back to login
              </button>
            </form>
          ) : mode === 'login' ? (
            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <input
                className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none"
                placeholder="Email address"
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
              />
              <input
                className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none"
                placeholder="Password"
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
              />
              <p className="text-sm leading-6 text-[var(--muted)]">
                Use the email and password saved in MongoDB. If you do not have an account yet, open the <span className="font-semibold text-[var(--text)]">register</span> tab and create one first.
              </p>
              <button type="button" className="text-sm font-semibold text-[var(--accent)]" onClick={() => setMode('forgot')}>
                Forgot password?
              </button>
              <button className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold text-white" disabled={loading}>
                {loading ? 'Signing in...' : `Enter as ${role}`}
              </button>
            </form>
          ) : mode === 'forgot' ? (
            <form className="mt-8 space-y-4" onSubmit={handleForgotPassword}>
              <p className="text-sm leading-6 text-[var(--muted)]">
                Enter your account email address. We will send you a password reset link.
              </p>
              <input
                className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none"
                placeholder="Email address"
                type="email"
                value={forgotForm.email}
                onChange={(event) => setForgotForm({ email: event.target.value })}
              />
              <button className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold text-white" disabled={loading}>
                {loading ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </form>
          ) : (
            <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleRegister}>
              <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none md:col-span-2" placeholder="Full name" value={registerForm.fullName} onChange={(event) => setRegisterForm((current) => ({ ...current, fullName: event.target.value }))} />
              {isStudentRegistration && (
                <input
                  className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none"
                  placeholder="Roll No"
                  value={registerForm.rollNo}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      rollNo: event.target.value,
                    }))
                  }
                />
              )}
              {!isStudentRegistration && (
                <input
                  className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none"
                  placeholder="Employee ID"
                  value={registerForm.employeeId}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      employeeId: event.target.value,
                    }))
                  }
                />
              )}
              <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Mobile" value={registerForm.mobile} onChange={(event) => setRegisterForm((current) => ({ ...current, mobile: event.target.value }))} />
              <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none md:col-span-2" placeholder="Email address" type="email" value={registerForm.email} onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))} />
              <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none md:col-span-2" placeholder="Password" type="password" value={registerForm.password} onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))} />
              {isStudentRegistration && (
                <>
                  <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Department" value={registerForm.department} onChange={(event) => setRegisterForm((current) => ({ ...current, department: event.target.value }))} />
                  <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Batch" value={registerForm.batch} onChange={(event) => setRegisterForm((current) => ({ ...current, batch: event.target.value }))} />
                  <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="10th percentage (for example 85)" type="number" min="0" max="100" value={registerForm.academics.tenthPercentage} onChange={(event) => setRegisterForm((current) => ({ ...current, academics: { ...current.academics, tenthPercentage: event.target.value === '' ? '' : Number(event.target.value) } }))} />
                  <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="12th percentage (for example 78)" type="number" min="0" max="100" value={registerForm.academics.twelfthPercentage} onChange={(event) => setRegisterForm((current) => ({ ...current, academics: { ...current.academics, twelfthPercentage: event.target.value === '' ? '' : Number(event.target.value) } }))} />
                  <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Current CGPA (for example 7.6)" type="number" min="0" max="10" step="0.01" value={registerForm.academics.cgpa} onChange={(event) => setRegisterForm((current) => ({ ...current, academics: { ...current.academics, cgpa: event.target.value === '' ? '' : Number(event.target.value) } }))} />
                  <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Current semester" type="number" min="1" max="12" value={registerForm.academics.semester} onChange={(event) => setRegisterForm((current) => ({ ...current, academics: { ...current.academics, semester: event.target.value === '' ? '' : Number(event.target.value) } }))} />
                  <p className="text-sm leading-6 text-[var(--muted)] md:col-span-2">
                    Students: enter your latest overall CGPA and your current semester. Example: if you are studying in 6th semester now, fill semester as 6.
                  </p>
                </>
              )}
              {!isStudentRegistration && (
                <p className="text-sm leading-6 text-[var(--muted)] md:col-span-2">
                  Faculty and admin use employee ID instead of roll number. Student-only academic details are not required here.
                </p>
              )}
              <p className="text-sm leading-6 text-[var(--muted)] md:col-span-2">
                Registration creates the account immediately and signs you in. Admin accounts cannot be created from this form.
              </p>
              <button className="md:col-span-2 rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={loading || isAdminRegistration}>
                {loading ? 'Creating account...' : isAdminRegistration ? 'Admin signup unavailable' : `Create ${role} account`}
              </button>
            </form>
          )}

          {error ? <p className="mt-4 text-sm font-medium text-[var(--danger)]">{error}</p> : null}
        </MotionSection>
      </div>
    </div>
  );
}
