const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: { type: String, required: true } 
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
