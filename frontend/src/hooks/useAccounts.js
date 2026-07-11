import { useCallback, useEffect, useState } from 'react'
import * as accountsApi from '../api/accounts.api'
import { getErrorMessage } from '../utils/helpers'

export function useAccountsWithBalances() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { accounts: accountList } = await accountsApi.getAccounts()
      const withBalances = await Promise.all(
        accountList.map(async (account) => {
          try {
            const balanceData = await accountsApi.getAccountBalance(account._id)
            return { ...account, balance: balanceData.balance }
          } catch {
            return { ...account, balance: null }
          }
        })
      )
      setAccounts(withBalances)
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load accounts'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  return { accounts, loading, error, refetch: fetchAccounts }
}
