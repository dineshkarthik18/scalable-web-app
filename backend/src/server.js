import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'
import taskRoutes from './routes/tasks.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change'
const MONGODB_URI = process.env.MONGODB_URI

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use((req, res, next) => {
  req.config = { JWT_SECRET }
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/tasks', taskRoutes)

async function start() {
  try {
    let uri = MONGODB_URI
    let mem
    if (!uri) {
      mem = await MongoMemoryServer.create()
      uri = mem.getUri()
      console.log('Using in-memory MongoDB')
    }
    await mongoose.connect(uri)
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`)
    })
    const shutdown = async () => {
      await mongoose.disconnect()
      if (mem) await mem.stop()
      process.exit(0)
    }
    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  } catch (err) {
    console.error('Mongo connection error', err.message)
    process.exit(1)
  }
}

start()
