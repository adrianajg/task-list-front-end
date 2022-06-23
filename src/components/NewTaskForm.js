import React, { useState } from 'react';
import PropTypes from 'prop-types';

const kDefaultForm = { title: '', description: '' };

const NewTaskForm = ({ onTaskSubmitted }) => {
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

      <input type="submit" value="Add Task" />
    </form>
  );
};

NewTaskForm.propTypes = {
  onTaskSubmitted: PropTypes.func.isRequired,
};

export default NewTaskForm;
