import api from './axios'

export async function getTransactions() {
  const { data } = await api.get('/api/transactions')
  return data
}

export async function transfer({ fromAccount, toAccount, amount, idempotencyKey }) {
  const { data } = await api.post('/api/transactions', {
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
  })
  return data
}
