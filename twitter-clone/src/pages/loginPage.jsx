import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { loginUser } from '../services/authService'

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
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await loginUser(formData);
            console.log(response);

            localStorage.setItem(
                "token",
                response.token
            );

            login(response.user);

            alert("Login successfull");
            navigate('/')
        }catch(error){
            console.log(error);
            alert("Login failed");
        }
    };

    return (
        <div className = 'auth-Container'>
            <h2> Login Page</h2>
            <form onSubmit={handleSubmit}>
                <input type = 'email' name='email' placeholder = 'Email' value={formData.email} onChange = {handleChange}></input>
                <input type = 'password' name = 'password' placeholder = 'password' value = {formData.password} onChange = {handleChange}></input>
                <button type = 'submit'> Login </button>
            </form>
        </div>
    )
}

export default Login;