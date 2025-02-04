import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.log(error));
  }, [tasks]);

  // Handle change in task input field
  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };
  // Handle change in task image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      alert('Please select a valid image file.');
      e.target.value = ''; // Reset file input if invalid
    }
  };
  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title || !image) {
      alert('Title and Image are required!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/tasks', formData);
      setTasks([...tasks, response.data]);
      setTitle('');
      setImage(null);

      // Reset file input field
      document.getElementById('fileInput').value = '';
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  // Start editing a task
  const handleEditClick = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setImage(null); 
  };

  // Handle updating the task
  const handleUpdateTask = (e) => {
    e.preventDefault();

    if (!editingTask) return;

    const formData = new FormData();
    formData.append("title", title);
    if (image) formData.append("image", image); // Only add if new image is selected

    axios.put(`http://localhost:5000/tasks/${editingTask._id}`, formData)
      .then(response => {
        setTasks(tasks.map(task => (task._id === editingTask._id ? response.data : task)));
        setEditingTask(null);
        setTitle("");
        setImage(null);
        document.getElementById("fileInput").value = ""; // Reset file input
      })
      .catch(error => console.error(error));
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setImage(null);
    document.getElementById('fileInput').value = '';
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>

       {/* Create or Edit Task */}
       <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
          <input
            type="text"
            value={title}
            onChange={handleInputChange}
            placeholder="Task title"
          />
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageChange}
          />
        
        <button type="submit">{editingTask ? "Update Task" : "Add Task"}</button>
        {editingTask && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
      </form>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            {task.image && (
              <img src={`http://localhost:5000/${task.image}`} alt="Task" width="100px" />
            )}
            <button onClick={() => handleEditClick(task)}>Edit</button>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
