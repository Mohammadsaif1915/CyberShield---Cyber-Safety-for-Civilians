import express from 'express'
import Contact from '../models/Contact.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body

    if (!name || !email || !subject || !category || !message)
      return res.status(400).json({ success: false, message: 'Please provide all required fields' })

    const contact = await Contact.create({ name, email, subject, category, message })

    res.status(201).json({ success: true, message: 'Your message has been sent successfully!', data: contact })
  } catch (error) {
    console.error('Contact Form Error:', error)
    res.status(500).json({ success: false, message: error.message || 'Server error. Please try again later.' })
  }
})

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: contacts.length, data: contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
    if (!contact)
      return res.status(404).json({ success: false, message: 'Contact not found' })
    res.status(200).json({ success: true, data: contact })
  } catch (error) {
    console.error('Error fetching contact:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    if (!contact)
      return res.status(404).json({ success: false, message: 'Contact not found' })
    res.status(200).json({ success: true, message: 'Status updated successfully', data: contact })
  } catch (error) {
    console.error('Error updating contact:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact)
      return res.status(404).json({ success: false, message: 'Contact not found' })
    res.status(200).json({ success: true, message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router