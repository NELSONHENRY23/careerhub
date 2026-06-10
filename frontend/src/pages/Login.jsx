import { useState } from "react"
import { api } from "../services/api"
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/auth/login", {email, password});

            login(res.data);

            navigate("/")
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    }


  return (
    <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

        <button type="submit">Login</button> 
    </form>
  )
}

export default Login