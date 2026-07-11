export function Alert({ type = 'error', children }) {
  const styles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  }

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`} role="alert">
      {children}
    </div>
  )
}
