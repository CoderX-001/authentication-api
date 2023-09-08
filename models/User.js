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
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  DOB: {
    type: String,
    required: false
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
  },
  identificationToken: {
    type: String,
    required: true
  }
})

const User = mongoose.model('Users', UserSchema)

export default User