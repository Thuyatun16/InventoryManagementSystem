import { useState } from "react";
import { Link } from "react-router-dom";
import "./AddStaff.css"; // Ensure this file is updated with the new class names
import Axios from "axios";

const AddStaff = () => {
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
                    alert('Staff Register Successful');
                    setUser("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                })
                .catch((error) => {
                    if (error.status === 409) {
                        alert(error.response?.data?.error || "Error: Username already exists.");
                    }
                    if (error.status === 400) {
                        alert(error.response?.data?.error || "Error: Bad request.");
                    }
                });
        } else {
            alert("Password and confirm password do not match");
        }
    };

    return (
        <div className="a-customer-management">
            {/* Left Section: Add Staff Form */}
            <div className="a-card">
                <h2 className="a-text-center">Add New Staff</h2>
                <form onSubmit={register} className="space-y-6">
                    <div className="a-input-group">
                        <input
                            type="text"
                            className="a-form-input"
                            placeholder=""
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            required
                        />
                        <span className="a-floating-label">Username</span>
                    </div>
                    <div className="a-input-group">
                        <input
                            type="email"
                            className="a-form-input"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <span className="a-floating-label">Email</span>
                    </div>
                    <div className="a-input-group">
                        <input
                            type="password"
                            className="a-form-input"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="a-floating-label">Password</span>
                    </div>
                    <div className="a-input-group">
                        <input
                            type="password"
                            className="a-form-input"
                            placeholder=" "
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span className="a-floating-label">Confirm Password</span>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Add New Staff
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Section: User Preview */}
            <div className="a-user-preview">
                <h3>Staff Details</h3>
                <p><strong>Username:</strong> {user || "Not provided"}</p>
                <p><strong>Email:</strong> {email || "Not provided"}</p>
                <p><strong>Password:</strong> {password ? "●".repeat(password.length) : "Not provided"}</p>
            </div>
        </div>
    );
};

export default AddStaff;