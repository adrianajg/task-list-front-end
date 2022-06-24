import React, { useState } from 'react';
import PropTypes from 'prop-types';

const kDefaultForm = { title: '', description: '' };

const NewTaskForm = ({ goals, onTaskSubmitted }) => {
  const [formData, setFormData] = useState(kDefaultForm);

  const handleChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    const newFormData = { ...formData, [fieldName]: fieldValue };

    setFormData(newFormData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onTaskSubmitted(formData);

    setFormData(kDefaultForm);
  };

  const goalListJSX = goals.map((goal, index) => {
    return (
      <option key={index} value={goal.title}>
        {goal.title}
      </option>
    );
  });

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        name="title"
        onChange={handleChange}
        value={formData.title}
      ></input>

      <label htmlFor="description">Description</label>
      <input
        type="text"
        name="description"
        onChange={handleChange}
        value={formData.description}
      ></input>

      <label htmlFor="goals">Add Task to Goal</label>
      <select name="goals" id="goals">
        <option disabled selected value>
          –– Add a goal? ––
        </option>
        {goalListJSX}
      </select>

      <input type="submit" value="Add Task" />
    </form>
  );
};

NewTaskForm.propTypes = {
  onTaskSubmitted: PropTypes.func.isRequired,
  goals: PropTypes.arrayOf(PropTypes.object),
};

export default NewTaskForm;
