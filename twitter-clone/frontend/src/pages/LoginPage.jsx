import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {loginUser} from "../api/authApi.js"

function LoginPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
        setError("Please fill all fields.");
        return;
    }

    try {
        setLoading(true);
        const response = await loginUser(formData);
        const { token } = response.data;
        if (token) {
            localStorage.setItem("token", token);
        }
        navigate("/");
    } 
    catch (err) {
        const message =
            err.response?.data?.message || "Login failed. Please try again.";
        setError(message);
    } 
    finally {
        setLoading(false);
    }
};

    return (
        <div className="auth-page">
        <div className="auth-card">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Username</label>
                <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>

            <p className="auth-link">
            Don't have an account? <Link to="/register">Register</Link>
            </p>
            </div>
        </div>
    );
}

export default LoginPage;