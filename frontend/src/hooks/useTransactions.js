import { useEffect, useState, useCallback } from 'react'
import * as transactionsApi from '../api/transactions.api'
import { getErrorMessage } from '../utils/helpers'

export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { transactions: list } = await transactionsApi.getTransactions()
      setTransactions(list)
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load transactions'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return { transactions, loading, error, refetch: fetchTransactions }
}
