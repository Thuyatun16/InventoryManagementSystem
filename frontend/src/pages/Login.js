/*************  ✨ Codeium Command 🌟  *************/
import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import Axios from "axios";

const Login = ({onLoginSuccess}) => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const loginSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:5000/login', { email: email, password: password })
            .then((response) => {
                console.log('Full response:', response.data); // Debug log
                if (response.data.message === "Login successful!") {
                    localStorage.setItem('userId', response.data.userId);
                    // Convert to string 'true' or 'false' for localStorage
                    localStorage.setItem('isAdmin', response.data.isAdmin.toString());
                    console.log('Setting isAdmin to:', response.data.isAdmin);
                    console.log('localStorage isAdmin:', localStorage.getItem('isAdmin'));
                    onLoginSuccess();
                } else {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className="container py-6">
            <div className="grid-container">
                <div className="card">
                    <h2 className="text-center">Login</h2>
                    <form onSubmit={loginSubmit} className="space-y-7 mt-5">
                        <div className="input-group">
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span className="floating-label">Email</span>
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
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
                    <div className="register-link">
                        Don't have an account? 
                        <Link to="/register" className="register-link-text">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

