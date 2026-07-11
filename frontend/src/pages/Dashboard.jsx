import { Link } from 'react-router-dom'
import { useAccountsWithBalances } from '../hooks/useAccounts'
import { Card } from '../components/ui/Card'
import { Alert } from '../components/ui/Alert'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Button } from '../components/ui/Button'
import { formatCurrency } from '../utils/helpers'

export default function Dashboard() {
  const { accounts, loading, error } = useAccountsWithBalances()

  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance ?? 0), 0)
  const activeAccounts = accounts.filter((a) => a.status === 'ACTIVE')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Overview of your accounts and balances</p>
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Total balance</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(totalBalance)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Accounts</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{accounts.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Active accounts</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{activeAccounts.length}</p>
        </Card>
      </div>

      <Card
        title="Your accounts"
        action={
          <Link to="/accounts">
            <Button variant="secondary">Manage</Button>
          </Link>
        }
      >
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : accounts.length === 0 ? (
          <EmptyState
            title="No accounts yet"
            description="Create your first bank account to get started."
            action={
              <Link to="/accounts">
                <Button>Create account</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <Link
                key={account._id}
                to={`/accounts/${account._id}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/30"
              >
                <div>
                  <p className="font-medium text-slate-900">{truncateAccountId(account._id)}</p>
                  <StatusBadge status={account.status} />
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {account.balance === null ? '—' : formatCurrency(account.balance)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function truncateAccountId(id) {
  return `Account …${String(id).slice(-6)}`
}
