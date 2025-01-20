import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editedTaskId, setEditedTaskId] = useState(null);
  const [editedText, setEditedText] = useState('');

  // Fetch tasks from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  // Handle change in task input field
  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  // Handle task creation
  const handleCreateTask = () => {
    if (newTask) {
      axios.post('http://localhost:5000/tasks', { text: newTask })
        .then(response => {
          setTasks([...tasks, response.data]);
          setNewTask('');
        })
        .catch(error => console.log(error));
    }
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:5000/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== taskId));
      })
      .catch(error => console.log(error));
  };

  // Set up for editing a task
  const handleEditClick = (taskId, currentText) => {
    setEditedTaskId(taskId);
    setEditedText(currentText);
  };

  // Handle updating the task
  const handleUpdateTask = () => {
    if (editedText) {
      axios.put(`http://localhost:5000/tasks/${editedTaskId}`, { text: editedText })
        .then(response => {
          setTasks(tasks.map(task => 
            task._id === editedTaskId ? { ...task, text: editedText } : task
          ));
          setEditedTaskId(null);
          setEditedText('');
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>

      {/* Create Task */}
      <input
        type="text"
        value={newTask}
        onChange={handleInputChange}
        placeholder="Add a new task"
      />
      <button onClick={handleCreateTask}>Add Task</button>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {editedTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={handleUpdateTask}>Update</button>
              </>
            ) : (
              <>
                {task.text}
                <button onClick={() => handleEditClick(task._id, task.text)}>Edit</button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
