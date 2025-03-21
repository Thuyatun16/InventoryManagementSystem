/*************  ✨ Codeium Command 🌟  *************/
import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import Axios from "axios";
import 'animate.css';

const Login = ({onLoginSuccess}) => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const loginSubmit = (e) => {
        e.preventDefault();
        setError("");
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 1) {
            setError("Password is required");
            return;
        }

        Axios.post('http://localhost:5000/login', { email: email, password: password })
            .then((response) => {
                console.log('Full response:', response.data); // Debug log
                if (response.data.message === "Login successful!") {
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('isAdmin', response.data.isAdmin.toString());
                    localStorage.setItem('token', response.data.token);
                    console.log('Setting isAdmin to:', response.data.isAdmin);
                    console.log('localStorage isAdmin:', localStorage.getItem('isAdmin'));
                    onLoginSuccess();
                } else {
                    setError(response.data.message);
                }
            })
            .catch((error) => {
                console.error(error);
                setError("Invalid email or password");
            });
    }

    return (
        <div className="container py-6">
           
            <div className="grid-container">
                <div className="card">
                    <h2 className="text-center">Login</h2>
                    <form onSubmit={loginSubmit} className="space-y-7 mt-5">
                        {error && (
                            <div className="error-message text-center">
                                {error}
                            </div>
                        )}
                        <div className="input-group">
                            <input
                                type="email"
                                className={`form-input ${error && 'error'}`}
                                placeholder="Email"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                required
                            />
                            <span className="floating-label">Email</span>
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                className={`form-input ${error && 'error'}`}
                                placeholder="Password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                required
                            />
                            <span className="floating-label">Password</span>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                    
                    </div>
                </div>
            </div>
        
    );
}

export default Login;

