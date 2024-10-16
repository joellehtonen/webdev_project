// components/RegisterForm.tsx
"use client"
import { useState } from "react";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Reset error
        setSuccess(""); // Reset success message

        try {
            const response = await fetch("http://localhost:5000/auth/register", {
                mode : "cors",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            // On successful registration, you can redirect or display a success message
            setSuccess("Registration successful!");
            setUsername(""); // Clear username field
            setPassword(""); // Clear password field
        } catch (err) {
            // Here we will use a type guard to ensure we handle the error correctly
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl">Register</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
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
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                Register
            </button>
        </form>
    );
}