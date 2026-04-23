import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { connectSocket, disconnectSocket } from '../../lib/socket.js';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { logout } from '../../store/slices/authSlice.js';
import { fetchNotifications, pushNotification } from '../../store/slices/notificationSlice.js';
import { setTheme, showFlashMessage } from '../../store/slices/uiSlice.js';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';

export function DashboardLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    dispatch(fetchNotifications());

    const socket = connectSocket(token);
    socket?.on('notification:new', (payload) => {
      dispatch(pushNotification(payload));
    });

    return () => {
      socket?.off('notification:new');
      disconnectSocket();
    };
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showFlashMessage({ type: 'success', text: 'Logged out successfully.' }));
    navigate('/login');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col gap-4 p-3 sm:gap-5 sm:p-4 lg:flex-row lg:gap-6 lg:p-6">
      <Sidebar role={user?.role} onLogout={handleLogout} />
      <main className="min-w-0 flex-1 space-y-4 sm:space-y-5 lg:space-y-6">
        <Topbar user={user} theme={theme} onThemeToggle={(value) => dispatch(setTheme(value))} />
        <Outlet />
      </main>
    </div>
  );
}
