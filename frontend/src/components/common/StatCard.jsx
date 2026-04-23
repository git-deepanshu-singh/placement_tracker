import { motion } from 'framer-motion';

const MotionDiv = motion.div;

export function StatCard({ title, value, detail, accent }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-[1.75rem] p-6"
    >
      <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <h3 className="font-display text-4xl font-semibold tracking-tight">{value}</h3>
        <div className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: accent }}>
          {detail}
        </div>
      </div>
    </MotionDiv>
  );
}
