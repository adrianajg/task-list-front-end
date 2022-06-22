import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList.js';
import './App.css';
import PropTypes from 'prop-types';
import axios from 'axios';

const TASKS = [
  {
    id: 1,
    title: 'Mow the lawn',
    isComplete: false,
  },
  {
    id: 2,
    title: 'Cook Pasta',
    isComplete: true,
  },
];

const kBaseUrl = 'https://task-list-api-c17.herokuapp.com';

const taskApiToJson = (task) => {
  const { id, title, is_complete: isComplete } = task;
  return { id, title, isComplete };
};

const getTasks = () => {
  return axios.get;
};

const App = () => {
  const [taskData, setTaskData] = useState(TASKS);

  const updateTasks = () => {
    getTasks().then((tasks) => {
      setTaskData(tasks);
    });
  };

  useEffect(() => {
    updateTasks();
  }, []);

  const updateTaskCompletion = (id) => {
    const tasks = taskData.map((task) => {
      if (task.id === id) {
        return { ...task, isComplete: !task.isComplete };
      } else {
        return task;
      }
    });

    setTaskData(tasks);
  };

  const deleteTask = (id) => {
    const newTasks = taskData.filter((task) => {
      return task.id !== id;
    });

    setTaskData(newTasks);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <TaskList
          tasks={taskData}
          onUpdateTaskCompletion={updateTaskCompletion}
          onDelete={deleteTask}
        />
      </main>
    </div>
  );
};

App.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      isComplete: PropTypes.bool.isRequired,
      tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ).isRequired,
  onUpdateTaskCompletion: PropTypes.func.isRequired, // this part was inside the validation line for tasks; it just needed its own line!
  onDelete: PropTypes.func.isRequired,
};

export default App;
