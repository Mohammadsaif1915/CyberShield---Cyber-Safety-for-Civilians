import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['General Inquiry', 'Technical Support', 'Security Issue', 'Feature Request', 'Partnership', 'Other']
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    minlength: [10, 'Message must be at least 10 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'replied', 'closed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('Contact', contactSchema);