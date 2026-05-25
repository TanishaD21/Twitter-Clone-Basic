import {useState} from 'react';
import { registerUser } from '../services/authService';

function SignUp() {
    const[formData, setFormData] = useState({
        name: '',
        username:'',
        email: '',
        password:'',
        confirmPassword:''   
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const { name, username, email, password } = formData;
            const response = await registerUser({
                name,
                username,
                email,
                password
            });
            console.log(response);
            alert("user registered succesfully");
        }catch(error){
            console.log(error);
            alert("Registration failed");
        }
        
    }
    return(
        <div className = 'auth-Container'>
            <h2> SignUp</h2>
            <form onSubmit={handleSubmit}>
                <input type = "text" name = 'name' placeholder = 'Name' value = {formData.name} onChange = {handleChange}></input>
                <input type = 'text' name = 'username' placeholder = 'Username' value = {formData.username} onChange = {handleChange}></input>
                <input type = 'email' name = 'email' placeholder= 'Email' value = {formData.email} onChange = {handleChange}></input>
                <input type = "password" name = "password" placeholder= "Password" value ={formData.password} onChange = {handleChange}></input>
                <input type = "password" name="confirmPassword" placeholder = "Confirm Password" value ={formData.confirmPassword} onChange = {handleChange}></input>
                <button type = 'submit'> Sign Up </button>
            </form>
        </div>
    )
}

export default SignUp;