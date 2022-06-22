import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList.js';
import './App.css';
import PropTypes from 'prop-types';
import axios from 'axios';

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
      throw new Error('error fetching cats');
    });
};

const markComplete = (id) => {
  return axios
    .patch(`${kBaseUrl}/tasks/${id}/mark_complete`)
    .then((response) => {
      return taskApiToJson(response.data);
    })
    .catch((err) => {
      console.log(err);
      throw new Error(`error while marking task ${id} complete`);
    });
};

const removeTask = (id) => {
  return axios.delete(`${kBaseUrl}/tasks/${id}`).catch((err) => {
    console.log(err);
    throw new Error(`error removing task ${id}`);
  });
};

const App = () => {
  const [taskData, setTaskData] = useState([]);

  const updateTasks = () => {
    getTasks()
      .then((tasks) => {
        setTaskData(tasks);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    updateTasks();
  }, []);

  // const updateTaskCompletion = (id) => {

  //   const tasks = taskData.map((task) => {
  //     if (task.id === id) {
  //       return { ...task, isComplete: !task.isComplete };
  //     } else {
  //       return task;
  //     }
  //   });

  //   setTaskData(tasks);
  // };

  const updateTask = (id) => {
    markComplete(id) // either ternary on the button or maybe ternary here?
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
    removeTask(id).then((task) => {
      setTaskData((oldData) => {
        return oldData.filter((task) => {
          return task.id !== id;
        });
      }).catch((err) => {
        console.log(err.message);
      });
    });
  };
  // const newTasks = taskData.filter((task) => {
  //   return task.id !== id;
  // });

  // setTaskData(newTasks);
  // };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <TaskList
          tasks={taskData}
          onUpdateTaskCompletion={updateTask} // maybe have this be a ternary?
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
