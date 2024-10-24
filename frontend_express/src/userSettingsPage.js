import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PasswordChecks from "./pswCheck";

const UserSettingsPage = () => {
    const [currentPassword, setCurrentPassword] = useState ('')
    const [newUsername, setNewUsername] = useState ('')
    const [newPassword, setNewPassword] = useState ('')
    const [confirmPassword, setConfirmPassword] = useState ('')
    const [error, setError] = useState ('')
    const [success, setSuccess] = useState ('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (newPassword && newPassword !== confirmPassword) {
            setError(`New password and confirmation do not match.`)
            return
        }

        if (newUsername) {
            const alphanumericRegex = /^[a-zA-Z0-9_.!-]+$/;
            if (!alphanumericRegex.test(newUsername)) {
                setError("Username must contain only alphanumeric characters and special characters (_, ., !, -).");
                return;
            }
        }
    
        if (newPassword) {
            const passwordCheckResult = PasswordChecks(newPassword);
            if (!passwordCheckResult.isValid) {
                setError(passwordCheckResult.error); // Set error if the password is invalid
                return; // Exit the function early
            }
        }
        

        try {
            const token = localStorage.getItem(`auth_token`)
            if (!token) {
                setError('You must be logged in to update your credentials.');
                return;
            }

            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/auth/updateCredentials`,
                {
                    currentPassword,
                    newUsername: newUsername || undefined,
                    newPassword: newPassword || undefined
                },
                {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                setError('')
                setSuccess('Credentials updated successfully!');
                setCurrentPassword('');
                setNewUsername('');
                setNewPassword('');
                setConfirmPassword('');

                setTimeout(() => {
                navigate('/');
                }, 2000);
            }
        } catch (err) {
            console.error('Error updating credentials:', err)
            setError(err.response?.data?.error || 'Failed to update credentials. Please try again.')
        }
    }

    return (
        <div className="container text-center">
          {/* Display success or error messages */}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
    
          <div className="row justify-content-md-center">
            <form className="col col-lg-6" onSubmit={handleSubmit}>
              {/* Current password field */}
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
    
              {/* New username field */}
              <div className="mb-3">
                <label htmlFor="newUsername" className="form-label">New Username (optional)</label>
                <input
                  type="text"
                  id="newUsername"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="form-control"
                />
              </div>
    
              {/* New password field */}
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">New Password (optional)</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                />
              </div>
    
              {/* Confirm new password field */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control"
                />
              </div>
    
              {/* Submit button */}
              <button type="submit" className="btn btn-primary">Update Credentials</button>
            </form>
          </div>
        </div>
      );
}

export default UserSettingsPage;