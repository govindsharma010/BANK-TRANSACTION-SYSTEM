import api from './axios'

export async function getAccounts() {
  const { data } = await api.get('/api/accounts')
  return data
}

export async function createAccount() {
  const { data } = await api.post('/api/accounts')
  return data
}

export async function getAccountBalance(accountId) {
  const { data } = await api.get(`/api/accounts/balance/${accountId}`)
  return data
}
