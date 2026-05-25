import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        const { name, username, email, password, confirmPassword } = formData;

        if (!name || !username || !email || !password || !confirmPassword) {
        setError("Please fill all fields.");
        return;
        }

        if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
        }

        try {
        setLoading(true);

        const response = await registerUser( {
            name,
            username,
            email,
            password,
        });

        const { token } = response.data;

        if (token) {
            localStorage.setItem("token", token);
        }

        navigate("/");
        } catch (err) {
        const message =
            err.response?.data?.message || "Registration failed. Please try again.";
        setError(message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="auth-page">
        <div className="auth-card">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                />
            </div>

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
                <label>Email</label>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
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

            <div className="form-group">
                <label>Confirm Password</label>
                <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
            </form>

            <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
        </div>
    );
}

export default RegisterPage;