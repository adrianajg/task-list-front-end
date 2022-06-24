import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList.js';
import './App.css';
import axios from 'axios';
import NewTaskForm from './components/NewTaskForm.js';

const kBaseUrl = 'https://adrianajg-task-list.herokuapp.com';

const taskApiToJson = (task) => {
  const {
    id,
    title,
    description,
    goal_id: goalId,
    is_complete: isComplete,
  } = task;
  return { id, title, description, goalId, isComplete };
};

const getTasks = () => {
  return axios
    .get(`${kBaseUrl}/tasks`)
    .then((response) => {
      return response.data.map(taskApiToJson);
    })
    .catch((err) => {
      console.log(err);
    });
};

const markComplete = (id) => {
  return axios
    .patch(`${kBaseUrl}/tasks/${id}/mark_complete`)
    .then((response) => {
      return taskApiToJson(response.data.task);
    })
    .catch((err) => {
      console.log(err);
      throw new Error(`error while marking task ${id} complete`);
    });
};

const markIncomplete = (id) => {
  return axios
    .patch(`${kBaseUrl}/tasks/${id}/mark_incomplete`)
    .then((response) => {
      return taskApiToJson(response.data.task);
    })
    .catch((err) => {
      console.log(err);
      throw new Error(`error while marking task ${id} incomplete`);
    });
};

const removeTask = (id) => {
  return axios.delete(`${kBaseUrl}/tasks/${id}`).catch((err) => {
    console.log(err);
  });
};

const addNewTask = (taskData) => {
  const requestBody = { ...taskData };

  return axios
    .post(`${kBaseUrl}/tasks`, requestBody)
    .then((response) => {
      return taskApiToJson(response.data.task);
    })
    .catch((err) => {
      console.log(err);
      throw new Error('error creating new task');
    });
};

const connectTaskToGoal = (taskId, goalId) => {
  const requestBody = { task_ids: { taskId } };
  return axios.post(`${kBaseUrl}/goals/${goalId}/tasks`, requestBody);
};

const App = () => {
  const [taskData, setTaskData] = useState([]);

  const updateTasks = () => {
    getTasks().then((tasks) => {
      setTaskData(tasks);
    });
  };

  useEffect(() => {
    updateTasks();
  }, []);

  const updateTask = (id, isComplete) => {
    const toggleComplete = isComplete ? markIncomplete : markComplete;
    toggleComplete(id)
      .then((updatedTask) => {
        setTaskData((oldData) => {
          return oldData.map((task) => {
            if (task.id === id) {
              return updatedTask;
            } else {
              return task;
            }
          });
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const deleteTask = (id) => {
    removeTask(id).then(() => {
      setTaskData((oldData) => {
        return oldData.filter((task) => {
          return task.id !== id;
        });
      });
    });
  };

  const handleTaskDataSubmitted = (formData) => {
    addNewTask(formData)
      .then((newTask) => {
        setTaskData((oldData) => [...oldData, newTask]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main className="main">
        <NewTaskForm
          className="form"
          onTaskSubmitted={handleTaskDataSubmitted}
        />
        <TaskList
          tasks={taskData}
          onUpdateTaskCompletion={updateTask}
          onDelete={deleteTask}
        />
      </main>
    </div>
  );
};

export default App;
