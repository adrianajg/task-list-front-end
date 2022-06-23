import React, { useState } from 'react';

const kDefaultForm = { title: '', description: '' };

const NewTaskForm = () => {
  const [formData, setFormData] = useState(kDefaultForm);

  const handleChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    const newFormData = { ...formData, [fieldName]: fieldValue };

    setFormData(newFormData);
  };

  return (
    <form onSubmit={() => {}}>
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

export default NewTaskForm;
