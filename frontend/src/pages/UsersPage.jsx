import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { showFlashMessage } from '../store/slices/uiSlice.js';
import { deleteUser, fetchUsers, updateUserStatus } from '../store/slices/userSlice.js';

export function UsersPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.users);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role !== 'student') {
      dispatch(fetchUsers());
    }
  }, [dispatch, user?.role]);

  if (user?.role === 'student') {
    return null;
  }

  const handleUpdateStatus = async (memberId, status) => {
    const result = await dispatch(updateUserStatus({ userId: memberId, status }));
    if (!result.error) {
      dispatch(showFlashMessage({ text: `User marked as ${status} successfully.` }));
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Unable to update user status.' }));
  };

  const handleDeleteUser = async (memberId) => {
    const result = await dispatch(deleteUser(memberId));
    if (!result.error) {
      dispatch(showFlashMessage({ text: 'User deleted successfully.' }));
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Unable to delete user.' }));
  };

  return (
    <section className="glass-panel rounded-[1.5rem] p-4 sm:p-6">
      <h3 className="section-title">User Directory</h3>
      <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-[var(--line)]">
        <table className="min-w-[720px] text-left text-sm">
          <thead className="bg-black/5 dark:bg-white/5">
            <tr>
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Role</th>
              <th className="px-4 py-4">Department</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Email</th>
              {user?.role === 'admin' ? <th className="px-4 py-4">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {items.map((member) => (
              <tr key={member._id} className="border-t border-[var(--line)]">
                <td className="px-4 py-4 font-medium">{member.fullName}</td>
                <td className="px-4 py-4 capitalize">{member.role}</td>
                <td className="px-4 py-4">{member.department || '-'}</td>
                <td className="px-4 py-4 capitalize">{member.status}</td>
                <td className="px-4 py-4">{member.email}</td>
                {user?.role === 'admin' ? (
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(member._id, member.status === 'inactive' ? 'active' : 'inactive')}
                        disabled={member._id === user._id}
                        className="rounded-xl border border-[var(--line)] px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {member.status === 'inactive' ? 'Activate' : 'Inactive'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(member._id)}
                        disabled={member._id === user._id}
                        className="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
