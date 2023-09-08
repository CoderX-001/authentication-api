import mongoose from "mongoose"

const ResetCodeSchema = new mongoose.Schema({
  userMail: {
    type: String,
    required: true
  },
  resetCode: {
    type: String,
    required: true
  },
  resetToken: {
    type: String,
    required: true
  },
  confirmToken: {
    type: String,
    required: false,
  },
  expDate: {
    type: String,
    required: true
  },
  identificationToken: {
    type: String,
    required: true
  }
})

const ResetCode = mongoose.model('ResetCodes', ResetCodeSchema)

export default ResetCode