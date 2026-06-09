import { useState } from 'react';

function PostJob() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Submit job', data);

      // Optionally reset the form after successful submit
      setForm({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
      });
    } catch (error) {
      console.error('Failed to submit job:', error);
    }
  };

  return (
    <div>
      <h1>Post a New Job</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="company"
          type="text"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <input
          name="salary"
          type="text"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default PostJob;
