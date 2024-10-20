// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Task = require('./models/Task'); // Import the Task model
const helmet = require('helmet');

// Load environment variables from .env file
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Configuring Content Security Policy (CSP) via helmet
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"], // Default policy: allow resources from the same origin
      scriptSrc: ["'self'", "https://vercel.live"], // Allow scripts from vercel.live
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow fonts from Google Fonts
      styleSrc: ["'self'", "https://fonts.googleapis.com"], // Allow styles from Google Fonts
      connectSrc: ["'self'", "https://vercel.live"], // Allow WebSocket or XHR connections from Vercel
      imgSrc: ["'self'", "data:"], // Allow images from the same origin and inline images (data URIs)
      // Add more directives as needed
    },
  })
);


// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.set('views', path.join(__dirname, 'api', 'views'));
// Set EJS as the templating engine
app.set("view engine", "ejs");
// MongoDB connection using the URI from .env file
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err}`);
  });

// Serve the index.ejs template (assuming you have a frontend for this project)
app.get('/', (req, res) => {
  res.render('index.ejs'); // Renders the index.ejs template
});
// API Routes

// Get all tasks for a specific sessionId
app.get('/api/tasks', async (req, res) => {
    const { sessionId } = req.query; // Pass sessionId as a query param
    try {
      const tasks = await Task.find({ sessionId }); // Find tasks by sessionId
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  });
  
  // Add a new task with sessionId
  app.post('/api/tasks', async (req, res) => {
    const { description, sessionId } = req.body; // Ensure sessionId is passed in request body
    try {
      const newTask = new Task({ description, sessionId }); // Include sessionId in the new task
      await newTask.save();
      res.status(201).json(newTask);
    } catch (err) {
      res.status(500).json({ message: 'Error adding task' });
    }
  });
  
  // Update task completion status or description
  app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { completed, description, sessionId } = req.body; // Ensure sessionId is passed
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: id, sessionId }, // Ensure the sessionId matches
        { completed, description }, 
        { new: true } // Return the updated task
      );
      res.json(updatedTask); // Return the updated task
    } catch (err) {
      res.status(500).json({ message: 'Error updating task' });
    }
  });
  
  
  // Delete a task// Delete a task
  app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { sessionId } = req.query; // Get sessionId from query parameters
  
    try {
      await Task.findOneAndDelete({ _id: id, sessionId }); // Ensure sessionId matches
      res.json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting task' });
    }
  });
//new 
app.get('public/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
  });