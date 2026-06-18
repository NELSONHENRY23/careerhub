import { useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import {api} from "../services/api"

const ResetPassword = () => {
    const {token} = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleResetPassword = async(e) => {
        e.preventDefault();

        setMessage("");
        setMessage("");

        if(password !== confirmPassword){
            setError("Passwords do not match.");
            return;
        }

        if(password.length < 6){
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            const res = await api.put(`/api/auth/reset-password/${token}`, {password});

            setMessage(res.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong. Please try again.");
        }finally{
            setLoading(false);
        }
    }
    return (
      <div className="auth-container">
        <form onSubmit={handleResetPassword} className="auth-form">
          <h2>Reset Password</h2>
  
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
  
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
  
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
  
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    );
}

export default ResetPassword;
