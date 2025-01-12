import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import Axios from "axios";

const Register = ({onLoginSuccess}) => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const register = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            console.log(user, email, password);
            Axios.post('http://localhost:5000/register', { username: user, email: email, password: password })
                .then((response) => {
                    console.log(response.data);
                    onLoginSuccess();
                })
                .catch((error) => {
                    if (error.status === 409) {
                        alert(error.response.data.error);
                    }
                    if(error.status === 400){
                        alert(error.response.data.error);
                    }
                });
        } else {
            alert("Password and confirm password does not match");
        }
    }

    return (
        <div className="container py-6">
            <div className="grid-container">
                <div className="card">
                    <h2 className="text-center">Register</h2>
                    <form onSubmit={register} className="space-y-6">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Username"
                                onChange={(e) => setUser(e.target.value)}
                                required
                            />
                            <span className="floating-label">Username</span>
                        </div>
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
                        <div className="input-group">
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Confirm Password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="floating-label">Confirm Password</span>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                    <div className="login-link">
                        Already have an account? 
                        <Link to="/" className="login-link-text">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register; 