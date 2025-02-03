const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Task = require('./models/Task');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create a task
app.post('/tasks', upload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !req.file) {
      return res.status(400).json({ error: 'Title and image are required' });
    }
    const newTask = new Task({
      title,
      image: req.file.path.replace(/\\/g, '/'),
    });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Error creating task' });
  }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Update a task
app.put('/tasks/:id', upload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // If a new image is uploaded, update it; otherwise, keep the existing one
    const updatedImage = req.file ? req.file.path.replace(/\\/g, '/') : task.image;

    // Update only the provided fields
    task.title = title || task.title;
    task.image = updatedImage;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
