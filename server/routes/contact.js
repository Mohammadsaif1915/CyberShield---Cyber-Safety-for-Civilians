const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;

    // Validation
    if (!name || !email || !subject || !category || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create contact
    const contact = await Contact.create({
      name,
      email,
      subject,
      category,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      data: contact
    });

  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact submissions (for admin)
// @access  Public (later make it private/admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/contact/:id
// @desc    Get single contact by ID
// @access  Public (later make it private/admin only)
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/contact/:id
// @desc    Update contact status
// @access  Public (later make it private/admin only)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact
// @access  Public (later make it private/admin only)
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;