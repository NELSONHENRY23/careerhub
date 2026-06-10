import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { api } from "../services/api"

function Login() {

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/login", {email, password});

            login(res.data);
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