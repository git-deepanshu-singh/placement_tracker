import { motion } from 'framer-motion';
import { BriefcaseBusiness, CalendarClock, MapPin } from 'lucide-react';

const MotionArticle = motion.article;

export function DriveCard({ drive, action }) {
  return (
    <MotionArticle
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-[1.5rem] p-4 sm:p-5 lg:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">{drive.companyName}</p>
          <h3 className="mt-2 break-words font-display text-xl sm:text-2xl">{drive.role}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-[15px]">{drive.jobDescription}</p>
        </div>
        <div className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent)]">
          {drive.packageLpa} LPA
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-[var(--muted)] md:grid-cols-3">
        <div className="flex items-start gap-2">
          <CalendarClock size={16} />
          <span className="break-words">Deadline: {new Date(drive.registrationDeadline).toLocaleString()}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={16} />
          <span className="break-words">{drive.venue}</span>
        </div>
        <div className="flex items-start gap-2">
          <BriefcaseBusiness size={16} />
          <span>{drive.eligibility?.minCgpa || 0}+ CGPA</span>
        </div>
      </div>

      {action ? <div className="mt-6">{action}</div> : null}
    </MotionArticle>
  );
}
