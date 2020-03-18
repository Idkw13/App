import mongoose, { Schema } from 'mongoose'

export default mongoose.model('Token', new Schema({
  tokenId: String,
  userId: String
}))

