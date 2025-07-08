const express = require('express');
const router = express.Router();
const Message = require('../models/message.model.js');
const { isAuthenticated } = require('../middleware/auth.middleware.js');

// Store a new message in MongoDB
router.post('/', isAuthenticated, async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.id;

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      message
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
