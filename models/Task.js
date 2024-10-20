const mongoose = require('mongoose');

// Task schema with timestamps and sessionId
const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  sessionId: {
    type: String, // Assuming sessionId is a string, adjust if needed
    required: true, // This makes sessionId mandatory
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Task model
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
