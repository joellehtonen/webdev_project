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

      if (response.status === 201) {
        setSuccess("Registration successful!"); // Show success message
        setUsername(""); // Clear username input
        setPassword(""); // Clear password input
        setError(""); // Clear any previous errors
      }
    } catch (err) {
      setError("Registration failed. Please try again."); // Show error message
      setSuccess(""); // Clear success message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border p-2"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2"
        />
      </div>
      <button type="submit">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
