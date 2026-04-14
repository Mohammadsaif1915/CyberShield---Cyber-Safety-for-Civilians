/**
 * One-time fix: reset quizPassed=true records where the user never
 * actually attempted the quiz (quizAttempts === 0).
 * These were created by the now-removed auto-pass logic.
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

await mongoose.connect(process.env.MONGO_URI)
console.log('Connected to MongoDB')

const result = await mongoose.connection.collection('progresses').updateMany(
  { quizPassed: true, quizAttempts: 0 },
  { $set: { quizPassed: false, completedAt: null } }
)

console.log(`Fixed ${result.modifiedCount} record(s) where quiz was auto-passed without attempt.`)
await mongoose.disconnect()
console.log('Done.')
