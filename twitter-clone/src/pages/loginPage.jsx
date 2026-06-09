import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { loginUser } from '../services/authService';
import './loginPage.css';

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await loginUser(formData);
            console.log(response);
            localStorage.setItem("token", response.token);
            login(response.user);
            alert("Login successfull");
            navigate('/');
        }catch(error){
            console.log(error);
            alert("Login failed");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* X / Twitter logo */}
                <svg viewBox="0 0 24 24" fill="currentColor" height="32" width="32" style={{ alignSelf: 'center', color: '#e7e9ea' }}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>

                <h2 className="login-title">Sign in to X</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="login-input"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="login-input"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit" className="login-btn">Log in</button>
                    <p className="login-footer">
                        Don't have an account?{" "}
                        <Link to="/signup" className="login-link">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;