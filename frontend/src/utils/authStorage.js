const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

export function getStoredUser() {
  const raw = sessionStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  sessionStorage.removeItem(USER_KEY)
}

export function clearAuthStorage() {
  clearToken()
  clearStoredUser()
}
