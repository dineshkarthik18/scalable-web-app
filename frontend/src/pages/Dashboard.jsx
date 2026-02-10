import { useEffect, useState } from 'react'
import { getProfile, updateProfile, listTasks, createTask, updateTask, deleteTask, logout } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [tasks, setTasks] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()

  useEffect(() => {
    async function load() {
      try {
        const me = await getProfile()
        setProfile(me)
        const list = await listTasks()
        setTasks(list)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function onSaveProfile(e) {
    e.preventDefault()
    setError('')
    try {
      const updated = await updateProfile({ name: profile.name })
      setProfile(updated)
    } catch (err) {
      setError(err.message)
    }
  }

  async function onCreateTask(e) {
    e.preventDefault()
    const title = e.target.title.value.trim()
    if (!title) return
    try {
      const created = await createTask({ title })
      setTasks([created, ...tasks])
      e.target.reset()
    } catch (err) {
      setError(err.message)
    }
  }

  async function onToggleComplete(t) {
    try {
      const updated = await updateTask(t._id, { completed: !t.completed })
      setTasks(tasks.map(x => x._id === t._id ? updated : x))
    } catch (err) {
      setError(err.message)
    }
  }

  async function onDeleteTask(t) {
    try {
      await deleteTask(t._id)
      setTasks(tasks.filter(x => x._id !== t._id))
    } catch (err) {
      setError(err.message)
    }
  }

  async function onLogout() {
    await logout()
    setIsAuthenticated(false)
    navigate('/login')
  }

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(q.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button onClick={onLogout} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">Logout</button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Profile</h2>
          <form onSubmit={onSaveProfile} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                className="mt-1 w-full border rounded-md px-3 py-2"
                value={profile?.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100"
                value={profile?.email || ''}
                readOnly
              />
            </div>
            <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <input
              placeholder="Search..."
              className="border rounded px-2 py-1"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <form onSubmit={onCreateTask} className="flex gap-2 mb-3">
            <input name="title" className="flex-1 border rounded px-3 py-2" placeholder="New task..." />
            <button className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Add</button>
          </form>

          <ul className="space-y-2">
            {filtered.map((t) => (
              <li key={t._id} className="flex items-center justify-between border rounded px-3 py-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={t.completed} onChange={() => onToggleComplete(t)} />
                  <span className={t.completed ? 'line-through text-gray-500' : ''}>{t.title}</span>
                </div>
                <button onClick={() => onDeleteTask(t)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              </li>
            ))}
            {filtered.length === 0 && <li className="text-sm text-gray-500">No tasks</li>}
          </ul>
        </section>
      </div>
    </div>
  )
}
