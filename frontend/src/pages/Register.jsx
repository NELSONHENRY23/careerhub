import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/api/auth/register', form);
      console.log(res.data);
      alert('User registered successfully, you can now login');
      navigate('/login');
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input
        type="text"
        name="name"
        onChange={handleChange}
        value={form.name}
        placeholder="Name"
      />
      <input
        type="text"
        name="email"
        onChange={handleChange}
        value={form.email}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        onChange={handleChange}
        value={form.password}
        placeholder="Password"
      />

      <button type="submit">Register</button>
    </form>
    <p>
        You have an account: <Link to="/login">Sign in</Link>.
      </p>
</>
  );
}

export default Register;
