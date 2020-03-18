import mongoose, { Schema } from 'mongoose'

export default mongoose.model('User', new Schema({
  email: { type: 'String', required: true, max: 255, unique: true, lowercase: true, },
  password: { type: 'String', required: true, min: 6, max: 255, },
  name: { type: 'String', trim: true },
}))

