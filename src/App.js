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

const goalApiToJson = (goal) => {
  const { id, title } = goal;
  return { id, title };
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

const getGoals = () => {
  return axios
    .get(`${kBaseUrl}/goals`)
    .then((response) => {
      return response.data.map(goalApiToJson);
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

const getTaskById = (id) => {
  return axios.get(`${kBaseUrl}/tasks/${id}`).catch((err) => {
    console.log(err);
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

const App = () => {
  const [taskData, setTaskData] = useState([]);
  const [goalData, setGoalData] = useState([]);

  const updateTasks = () => {
    getTasks().then((tasks) => {
      setTaskData(tasks);
    });
  };

  const updateGoals = () => {
    getGoals().then((goals) => {
      setGoalData(goals);
    });
  };

  useEffect(() => {
    updateTasks();
    updateGoals();
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

  // const associateTaskWithGoal = (task, goalId) => {
  //   const requestBody = `{"task_ids":[${task.id}]}`;
  //   console.log('request body for associating task with goal:', requestBody);
  //   console.log(
  //     'this is the url making a call to:',
  //     `${kBaseUrl}/goals/${goalId}/tasks`
  //   );
  //   axios
  //     .post(`${kBaseUrl}/goals/${goalId}/tasks`, requestBody)
  //     .then(() => {
  //       updateTasks();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       throw new Error('error associating task with goal');
  //     });
  // };

  const handleTaskDataSubmitted = (formData, goalId) => {
    addNewTask(formData)
      .then((newTask) => {
        setTaskData((oldData) => [...oldData, newTask]);
        return newTask;
      })
      .then((newTask) => {
        console.log('entered call to check if goal associated');
        console.log('the returned promise was:', newTask);
        console.log('the goal id is:', goalId);
        if (goalId) {
          console.log('the goalId was found to be truthy');
          const requestBody = `{"task_ids":[${newTask.id}]}`;

          axios
            .post(`${kBaseUrl}/goals/${goalId}/tasks`, requestBody)
            .then((response) => {
              console.log(
                'response to post request to associate task with goal',
                response
              );
              getTaskById(response);
            })
            .then((newTask) => {
              setTaskData((oldData) => [...oldData, newTask]);
              return newTask;
            })
            .catch((err) => {
              console.log(err);
              throw new Error('error associating task with goal');
            });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const associateTaskWithGoal = (goalId, taskId) => {
    const requestBody = `{"task_ids":[${taskId}]}`;
    console.log(`requestBody is ${requestBody}`);
    console.log(`request URL is ${kBaseUrl}/goals/${goalId}/tasks`);
    axios
      .post(`${kBaseUrl}/goals/${goalId}/tasks`, requestBody)
      .then((response) => {
        console.log(
          'response to post request to associate task with goal',
          response
        );
        getTaskById(response);
      })
      .then((newTask) => {
        setTaskData((oldData) => [...oldData, newTask]);
        return newTask;
      })
      .catch((err) => {
        console.log(err);
        throw new Error('error associating task with goal');
      });
  };

  console.log('Running associate task id 19 with goal id 2');
  associateTaskWithGoal(2, 19);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <NewTaskForm
          goals={goalData}
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
