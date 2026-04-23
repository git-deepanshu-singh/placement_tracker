import { useEffect, useState } from 'react';

import { DriveCard } from '../components/common/DriveCard.jsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import {
  applyToDrive,
  createDrive,
  deleteDrive,
  fetchDrives,
  toggleDriveRegistration,
  updateDrive,
} from '../store/slices/driveSlice.js';
import { showFlashMessage } from '../store/slices/uiSlice.js';

const initialDriveForm = {
  companyName: '',
  packageLpa: 0,
  role: '',
  jobDescription: '',
  termsAndConditions: '',
  registrationDeadline: '',
  driveDate: '',
  venue: '',
  registrationEnabled: true,
  googleFormFields: ['Resume Link', 'Current Backlogs'],
  eligibility: {
    departments: ['CSE', 'IT', 'ECE'],
    minTenthPercentage: 60,
    minTwelfthPercentage: 60,
    minCgpa: 6.5,
    allowedBatches: ['2026'],
  },
};

const toDateTimeLocalValue = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

export function DrivesPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.drives);
  const [driveForm, setDriveForm] = useState(initialDriveForm);
  const [editingDriveId, setEditingDriveId] = useState(null);

  useEffect(() => {
    dispatch(fetchDrives());
  }, [dispatch]);

  const resetDriveForm = () => {
    setDriveForm(initialDriveForm);
    setEditingDriveId(null);
  };

  const handleSubmitDrive = async (event) => {
    event.preventDefault();
    const action = editingDriveId
      ? updateDrive({ driveId: editingDriveId, payload: driveForm })
      : createDrive(driveForm);
    const result = await dispatch(action);

    if (!result.error) {
      dispatch(showFlashMessage({ text: editingDriveId ? 'Drive updated successfully.' : 'Drive published successfully.' }));
      resetDriveForm();
      dispatch(fetchDrives());
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Unable to save drive.' }));
  };

  const handleEditDrive = (drive) => {
    setEditingDriveId(drive._id);
    setDriveForm({
      companyName: drive.companyName || '',
      packageLpa: drive.packageLpa || 0,
      role: drive.role || '',
      jobDescription: drive.jobDescription || '',
      termsAndConditions: drive.termsAndConditions || '',
      registrationDeadline: toDateTimeLocalValue(drive.registrationDeadline),
      driveDate: toDateTimeLocalValue(drive.driveDate),
      venue: drive.venue || '',
      registrationEnabled: drive.registrationEnabled,
      googleFormFields: drive.googleForm?.fields?.length ? drive.googleForm.fields : ['Resume Link', 'Current Backlogs'],
      eligibility: {
        departments: drive.eligibility?.departments || [],
        minTenthPercentage: drive.eligibility?.minTenthPercentage || 0,
        minTwelfthPercentage: drive.eligibility?.minTwelfthPercentage || 0,
        minCgpa: drive.eligibility?.minCgpa || 0,
        allowedBatches: drive.eligibility?.allowedBatches || [],
      },
    });
  };

  const handleDeleteDrive = async (driveId) => {
    const result = await dispatch(deleteDrive(driveId));
    if (!result.error) {
      if (editingDriveId === driveId) {
        resetDriveForm();
      }
      dispatch(showFlashMessage({ text: 'Drive deleted successfully.' }));
      dispatch(fetchDrives());
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Unable to delete drive.' }));
  };

  const handleToggleRegistration = async (drive) => {
    const result = await dispatch(
      toggleDriveRegistration({
        driveId: drive._id,
        registrationEnabled: !drive.registrationEnabled,
      }),
    );

    if (!result.error) {
      dispatch(
        showFlashMessage({
          text: `Drive registration ${drive.registrationEnabled ? 'disabled' : 'enabled'} successfully.`,
        }),
      );
      dispatch(fetchDrives());
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Unable to update drive registration.' }));
  };

  const handleApplyToDrive = async (driveId) => {
    const result = await dispatch(
      applyToDrive({
        driveId,
        formPayload: {
          fullName: user.fullName,
          rollNo: user.rollNo,
          email: user.email,
          mobile: user.mobile,
          tenthPercentage: user.academics?.tenthPercentage,
          twelfthPercentage: user.academics?.twelfthPercentage,
          cgpa: user.academics?.cgpa,
        },
      }),
    );

    if (!result.error) {
      dispatch(showFlashMessage({ text: 'Applied to drive successfully.' }));
      return;
    }

    dispatch(showFlashMessage({ type: 'error', text: result.payload || 'Unable to apply for this drive.' }));
  };

  const renderStudentAction = (drive) => {
    if (!drive.eligible) {
      return (
        <div className="space-y-3">
          <button
            type="button"
            disabled
            className="rounded-2xl bg-black/10 px-5 py-3 text-sm font-semibold text-[var(--muted)]"
          >
            Not eligible
          </button>
          <p className="text-sm leading-6 text-[var(--muted)]">
            This drive is published, but your current department, batch, or academic scores do not match the eligibility criteria.
          </p>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleApplyToDrive(drive._id)}
        className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
      >
        Apply now
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {user?.role !== 'student' ? (
        <section className="glass-panel rounded-[2rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="section-title">{editingDriveId ? 'Edit Placement Drive' : 'Create Placement Drive'}</h3>
            {editingDriveId ? (
              <button type="button" className="rounded-2xl border border-[var(--line)] px-4 py-2 text-sm font-semibold" onClick={resetDriveForm}>
                Cancel edit
              </button>
            ) : null}
          </div>
          <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmitDrive}>
            <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Company name" value={driveForm.companyName} onChange={(event) => setDriveForm((current) => ({ ...current, companyName: event.target.value }))} />
            <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Role" value={driveForm.role} onChange={(event) => setDriveForm((current) => ({ ...current, role: event.target.value }))} />
            <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Package (LPA)" type="number" step="0.01" value={driveForm.packageLpa} onChange={(event) => setDriveForm((current) => ({ ...current, packageLpa: Number(event.target.value) }))} />
            <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" placeholder="Venue" value={driveForm.venue} onChange={(event) => setDriveForm((current) => ({ ...current, venue: event.target.value }))} />
            <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" type="datetime-local" value={driveForm.registrationDeadline} onChange={(event) => setDriveForm((current) => ({ ...current, registrationDeadline: event.target.value }))} />
            <input className="rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none" type="datetime-local" value={driveForm.driveDate} onChange={(event) => setDriveForm((current) => ({ ...current, driveDate: event.target.value }))} />
            <textarea className="min-h-36 rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none lg:col-span-2" placeholder="Job description" value={driveForm.jobDescription} onChange={(event) => setDriveForm((current) => ({ ...current, jobDescription: event.target.value }))} />
            <textarea className="min-h-28 rounded-2xl border border-[var(--line)] bg-transparent px-4 py-4 outline-none lg:col-span-2" placeholder="Terms and conditions" value={driveForm.termsAndConditions} onChange={(event) => setDriveForm((current) => ({ ...current, termsAndConditions: event.target.value }))} />
            <button className="rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold text-white lg:col-span-2">
              {editingDriveId ? 'Save drive changes' : 'Publish drive'}
            </button>
          </form>
        </section>
      ) : null}

      <section className="space-y-5">
        {items.length === 0 ? (
          <div className="glass-panel rounded-[1.5rem] p-6 text-sm leading-6 text-[var(--muted)]">
            {user?.role === 'student'
              ? 'No active drives are published right now. New drives published by admin or faculty will appear here while registration is open.'
              : 'No drives have been published yet.'}
          </div>
        ) : null}
        {items.map((drive) => (
          <DriveCard
            key={drive._id}
            drive={drive}
            action={
              user?.role === 'student' ? (
                renderStudentAction(drive)
              ) : (
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/drives/${drive._id}/applications/export`}
                    className="rounded-2xl border border-[var(--line)] px-5 py-3 text-sm font-semibold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Export registrations
                  </a>
                  {drive.googleForm?.responderUri ? (
                    <a href={drive.googleForm.responderUri} className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white" target="_blank" rel="noreferrer">
                      Open Google Form
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleToggleRegistration(drive)}
                    className="rounded-2xl border border-[var(--line)] px-5 py-3 text-sm font-semibold"
                  >
                    {drive.registrationEnabled ? 'Disable registration' : 'Enable registration'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditDrive(drive)}
                    className="rounded-2xl border border-[var(--line)] px-5 py-3 text-sm font-semibold"
                  >
                    Edit drive
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDrive(drive._id)}
                    className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Delete drive
                  </button>
                </div>
              )
            }
          />
        ))}
      </section>
    </div>
  );
}
