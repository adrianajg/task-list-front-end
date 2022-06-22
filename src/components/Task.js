import React from 'react';
import PropTypes from 'prop-types';
import './Task.css';

const Task = (props) => {
  const buttonClass = props.isComplete ? 'tasks__item__toggle--completed' : '';

  const handleDelete = () => {
    props.onDeleteFx(props.id);
  };

  const handleUpdate = () => {
    props.onUpdate(props.id);
  };

  return (
    <li className="tasks__item">
      <button
        className={`tasks__item__toggle ${buttonClass}`}
        onClick={handleUpdate}
      >
        {props.title}
      </button>
      <button className="tasks__item__remove button" onClick={handleDelete}>
        x
      </button>
    </li>
  );
};

Task.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  isComplete: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDeleteFx: PropTypes.func.isRequired,
};

export default Task;
