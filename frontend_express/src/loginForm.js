import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    //const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error
        setSuccess(''); // Clear previous success

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json(); // Assuming response is JSON

            if (response.ok) {

                // If login is successful, store login status in localStorage
                localStorage.setItem('authToken', data.auth_token);
                console.log(data.auth_token)

                // If login is successful, show success message5
                setSuccess('Login successful! Redirecting to the home page ...');

                setTimeout(() => {
                    navigate('/'); // Redirect to the homepage or another route
                }, 3000);
                
            } else {
                // If there's an error, display the error message returned by the server
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            // Handle network or unexpected errors
            setError('An error occurred. Please try again later.');
            console.error('Login error:', err);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {/* Display success or error messages */}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LoginPage;