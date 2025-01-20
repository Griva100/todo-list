const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Create a task
app.post('/tasks', async (req, res) => {
  const { text } = req.body;
  const newTask = new Task({ text });
  await newTask.save();
  res.json(newTask);
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(id, { text, completed }, { new: true });
  res.json(updatedTask);
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: 'Task deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
