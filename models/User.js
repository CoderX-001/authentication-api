import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  DOB: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: String,
    required: false
  },
  active: {
    type: Boolean,
    default: true
  }
})

const User = mongoose.model('Users', UserSchema)

export default User