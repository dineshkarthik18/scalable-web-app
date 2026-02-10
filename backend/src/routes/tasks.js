import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import Task from '../models/Task.js'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  const q = String(req.query.q || '').toLowerCase()
  let tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean()
  if (q) tasks = tasks.filter(t => t.title.toLowerCase().includes(q))
  return res.json(tasks.map(t => ({ _id: t._id, title: t.title, completed: t.completed })))
})

const createSchema = z.object({
  title: z.string().min(1),
})
router.post('/', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' })
  const t = await Task.create({ userId: req.user.id, title: parsed.data.title })
  return res.status(201).json({ _id: t._id, title: t.title, completed: t.completed })
})

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
})
router.put('/:id', requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' })
  const t = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, parsed.data, { new: true }).lean()
  if (!t) return res.status(404).json({ error: 'Not found' })
  return res.json({ _id: t._id, title: t.title, completed: t.completed })
})

router.delete('/:id', requireAuth, async (req, res) => {
  const t = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  if (!t) return res.status(404).json({ error: 'Not found' })
  return res.json({ ok: true })
})

export default router
