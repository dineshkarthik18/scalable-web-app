import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, req.config.JWT_SECRET)
    req.user = { id: payload.sub }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
