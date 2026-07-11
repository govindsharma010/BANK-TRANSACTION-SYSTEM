export function Card({ title, children, action }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}
