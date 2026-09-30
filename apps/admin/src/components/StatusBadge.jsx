import { CheckCircle2, Clock, XCircle, HelpCircle } from 'lucide-react';

// Each status pairs a colour with a distinct icon and always renders its text
// label, so the state is never conveyed by colour alone. The icon is
// decorative (aria-hidden); the text is the accessible name.
const VARIANTS = {
  success: { colorClass: 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300', Icon: CheckCircle2 },
  pending: { colorClass: 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300', Icon: Clock },
  failed: { colorClass: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300', Icon: XCircle },
};
const FALLBACK = { colorClass: 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300', Icon: HelpCircle };

export default function StatusBadge({ status }) {
  const key = typeof status === 'string' && status ? status.toLowerCase() : undefined;
  const { colorClass, Icon } = VARIANTS[key] ?? FALLBACK;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${colorClass}`}
      data-status={key ?? 'unknown'}
    >
      <Icon size={12} aria-hidden="true" data-testid="status-icon" />
      {status || 'Unknown'}
    </span>
  );
}
