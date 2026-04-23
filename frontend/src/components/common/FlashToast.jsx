import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { clearFlashMessage } from '../../store/slices/uiSlice.js';

const toneClasses = {
  success: 'border-emerald-500/30 bg-emerald-500/12 text-emerald-700',
  error: 'border-red-500/30 bg-red-500/12 text-red-700',
  info: 'border-sky-500/30 bg-sky-500/12 text-sky-700',
};

export function FlashToast() {
  const dispatch = useAppDispatch();
  const { flashMessage } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (!flashMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(clearFlashMessage());
    }, 2800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dispatch, flashMessage]);

  if (!flashMessage?.text) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] w-full max-w-sm">
      <div className={`rounded-[1.25rem] border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur ${toneClasses[flashMessage.type] || toneClasses.success}`}>
        {flashMessage.text}
      </div>
    </div>
  );
}
