import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import User from '../models/User.js'

const router = Router()

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).lean()
  if (!user) return res.status(404).json({ error: 'Not found' })
  return res.json({ id: user._id, name: user.name, email: user.email })
})

const updateSchema = z.object({
  name: z.string().min(2),
})

router.put('/me', requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' })
  const user = await User.findByIdAndUpdate(req.user.id, { name: parsed.data.name }, { new: true }).lean()
  return res.json({ id: user._id, name: user.name, email: user.email })
})

export default router
