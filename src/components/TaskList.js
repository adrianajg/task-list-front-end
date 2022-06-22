import React from 'react';
import PropTypes from 'prop-types';
import Task from './Task';
import './TaskList.css';

const TaskList = (props) => {
  // We had some bad syntax here
  const getTaskListJSX = props.tasks.map((task, index) => {
    return (
      <Task
        key={index}
        id={task.id}
        title={task.title}
        isComplete={task.isComplete}
        onUpdate={props.onUpdateTaskCompletion}
        onDeleteFx={props.onDelete}
      />
    );
  });

  return <div>{getTaskListJSX}</div>;
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      isComplete: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onUpdateTaskCompletion: PropTypes.func.isRequired, // this part was inside the validation line for tasks; it just needed its own line!
  onDelete: PropTypes.func.isRequired,
};

export default TaskList;
