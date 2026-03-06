import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import Axios from "../../../api/axios";

const Register = ({ onLoginSuccess }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password and confirm password does not match");
      return;
    }

    try {
      await Axios.post("/register", {
        username: user,
        email: email,
        password: password,
      });

      const loginResponse = await Axios.post("/login", {
        email: email,
        password: password,
      });

      if (loginResponse.data?.message === "Login successful!") {
        localStorage.setItem("userId", loginResponse.data.userId);
        localStorage.setItem(
          "isAdmin",
          loginResponse.data.isAdmin.toString(),
        );
        localStorage.setItem("token", loginResponse.data.token);
        onLoginSuccess();
        return;
      }

      alert(loginResponse.data?.message || "Login failed after registration");
    } catch (error) {
      if (error.response?.status === 409) {
        alert(error.response.data.error);
        return;
      }
      if (error.response?.status === 400) {
        alert(error.response.data.error);
        return;
      }
      alert("Registration failed");
    }
  };

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
              <button type="submit" className="btn btn-primary w-full">
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
};

export default Register;

