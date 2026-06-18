import { useState } from "react";
import {api} from "../services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message,setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const res = await api.post('/api/auth/forgot-password', {email});

            setMessage(res.data.message);
            setEmail("");
        } catch (error) {
            setError(
                error.response?.data?.message || "Something went wrong. Please try again."
            );
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
          <form onSubmit={handleForgotPassword} className="auth-form">
            <h2>Forgot Password</h2>
    
            <p>Enter your email and we will send you a password reset link.</p>
    
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
    
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
    
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      );
}

export default ForgotPassword;