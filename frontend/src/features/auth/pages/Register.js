import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import Axios from "../../../api/axios";
import { useNotifier } from "../../../context/NotifierContext";

const Register = ({ onLoginSuccess }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { error: showError, success } = useNotifier();

  const register = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError("Password and confirm password do not match");
      return;
    }

    try {
      await Axios.post("/register", {
        username: user,
        email: email,
        phone_number: phoneNumber,
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
        success("Registration completed successfully");
        onLoginSuccess();
        return;
      }

      showError(loginResponse.data?.message || "Login failed after registration");
    } catch (error) {
      if (error.response?.status === 409) {
        showError(
          error.response.data.message ||
            error.response.data.error ||
            "User already exists",
        );
        return;
      }
      if (error.response?.status === 400) {
        showError(
          error.response.data.message ||
            error.response.data.error ||
            "Invalid registration data",
        );
        return;
      }
      showError("Registration failed");
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
                type="tel"
                className="form-input"
                placeholder="Phone Number"
                onChange={(e) => setPhoneNumber(e.target.value)}
                pattern="[0-9]{6,15}"
                required
              />
              <span className="floating-label">Phone Number</span>
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

