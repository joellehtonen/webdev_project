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

                // If login is successful, store login status and username in localStorage
                localStorage.setItem('auth_token', data.auth_token);
                //console.log(data.auth_token)

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
        <div className="container text-center">
             <h2 style={{textAlign: 'center'}}>Sign in</h2>
            {/* Display success or error messages */}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="row justify-content-md-center">
                <form className="col col-lg-6" onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
