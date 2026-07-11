export function getErrorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || error?.message || fallback
}

export function isValidObjectId(value) {
  return /^[a-fA-F0-9]{24}$/.test(value?.trim?.() || '')
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount ?? 0)
}

export function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function truncateId(id, length = 8) {
  if (!id) return '—'
  const str = String(id)
  return str.length > length ? `${str.slice(0, length)}…` : str
}
