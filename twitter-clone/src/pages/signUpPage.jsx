import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import './signUpPage.css';

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const { name, username, email, password } = formData;
            const response = await registerUser({ name, username, email, password });
            console.log(response);
            alert("User registered successfully");
            navigate('/');
        }catch(error){
            console.log(error);
            alert("Registration failed");
        }
    };

    return(
        <div className="signup-page">
            <div className="signup-container">
                {/* X / Twitter logo */}
                <svg viewBox="0 0 24 24" fill="currentColor" height="32" width="32" style={{ alignSelf: 'center', color: '#e7e9ea' }}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>

                <h2 className="signup-title">Create your account</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input
                        className="signup-input"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        className="signup-input"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        className="signup-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        className="signup-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <input
                        className="signup-input"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <button className="signup-btn" type="submit">Sign up</button>
                    <p className="signup-footer">
                        Already have an account?{" "}
                        <Link to="/login" className="signup-link">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;