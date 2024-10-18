import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  // Manage state for form inputs and messages
  const [username, setUsername] = useState(""); // Initialize as empty string
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        username,
        password
      });

      setSuccess("Registration successful!"); // Show success message
      setUsername(""); // Clear username input
      setPassword(""); // Clear password input
      setError(""); // Clear any previous errors
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
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
        </div>
      </div>
  );
};

export default RegisterForm;
