import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/auth/register", { name, email, password });

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Register</h2>

        {success ? (
          <div className="register-success">
            <span className="register-success-icon">✅</span>
            <p>Registration successful!</p>
            <p className="register-redirect-msg">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="register-error">{error}</p>}

            <button type="submit">Register</button>

            <p>
              Already have an account?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}