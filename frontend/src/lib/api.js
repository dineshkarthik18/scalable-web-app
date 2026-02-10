const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function getToken() {
  return localStorage.getItem('token') || ''
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = data?.error || data?.message || 'Request failed'
    throw new Error(message)
  }
  return data
}

export async function signup(payload) {
  return request('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) })
}

export async function login(payload) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}

export async function logout() {
  localStorage.removeItem('token')
  return { ok: true }
}

export async function getProfile() {
  return request('/api/profile/me', { method: 'GET' })
}

export async function updateProfile(payload) {
  return request('/api/profile/me', { method: 'PUT', body: JSON.stringify(payload) })
}

export async function listTasks(query = '') {
  const q = query ? `?q=${encodeURIComponent(query)}` : ''
  return request(`/api/tasks${q}`, { method: 'GET' })
}

export async function createTask(payload) {
  return request('/api/tasks', { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateTask(id, payload) {
  return request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export async function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: 'DELETE' })
}

export function saveToken(token) {
  localStorage.setItem('token', token)
}
