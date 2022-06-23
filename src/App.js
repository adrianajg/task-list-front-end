import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList.js';
import './App.css';
import axios from 'axios';
import NewTaskForm from './components/NewTaskForm.js';

const kBaseUrl = 'https://tambo-task-list.herokuapp.com';

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <NewTaskForm />
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
