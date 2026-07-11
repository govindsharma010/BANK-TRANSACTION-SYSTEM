export function StatusBadge({ status }) {
  const styles = {
    ACTIVE: 'bg-emerald-100 text-emerald-800',
    FROZEN: 'bg-amber-100 text-amber-800',
    CLOSED: 'bg-slate-200 text-slate-700',
    PENDING: 'bg-amber-100 text-amber-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    FAILED: 'bg-red-100 text-red-800',
    REVERSED: 'bg-purple-100 text-purple-800',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  )
}
