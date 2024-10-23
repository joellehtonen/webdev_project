import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  // Manage state for form inputs and messages
  const [username, setUsername] = useState(""); // Initialize as empty string
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmPassword, setConfirmPassword] = useState ('')

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (password && password.length < 6) {
      setError('password must be at least 6 characters long.');
      return
    }

    if (password && password !== confirmPassword) {
      setError(`password and confirmation do not match.`)
      return
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        username,
        password
      });

      setSuccess("Registration successful! Redirecting to the login page ..."); // Show success message
      setUsername(""); // Clear username input
      setPassword(""); // Clear password input
      setError(""); // Clear any previous errors
      setConfirmPassword('')
      setTimeout(() => {
        navigate('/login'); // Redirect to the homepage or another route
    }, 3000);
    } catch (err) {
      setError("Registration failed. Please try again."); // Show error message
      setSuccess(""); // Clear success message
    }
  };

  return (
    <div className="container text-center">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
        <div className="row justify-content-md-center">
        <form className="col col-lg-6" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-control"
              />
            </div>
          <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            {/* Confirm new password field */}
            <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control"
                />
            </div>
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
        </div>
      </div>
  );
};

export default RegisterForm;
