import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const { login } = useContext(AppContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/auth/login", credentials);
            login(response.data);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || "Invalid credentials");
        }
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center bg-white" style={{ minHeight: "100vh" }}>
            {/* Brand Header */}
            <div className="mb-4">
                <Link className="text-decoration-none fw-bold" to="/" style={{ fontSize: '2rem', letterSpacing: '-1px', color: 'var(--text-primary)' }}>
                    Nexus<span style={{ color: "var(--accent-color)" }}>Kart</span>
                </Link>
            </div>

            <div className="card p-4 border shadow-sm" style={{ width: "100%", maxWidth: "380px", borderRadius: "12px" }}>
                <div className="mb-4">
                    <h2 className="h4 fw-bold mb-1" style={{ color: "var(--text-primary)" }}>Sign In</h2>
                    <p className="text-muted small">Access your account to continue</p>
                </div>

                {error && <div className="alert alert-danger py-2 px-3 small border-0 mb-4" style={{ backgroundColor: '#fff5f5', color: '#c53030' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold text-dark mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control py-2 shadow-none border-1"
                            placeholder="name@example.com"
                            style={{ fontSize: '14px', borderRadius: '8px' }}
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <div className="d-flex justify-content-between">
                            <label className="form-label small fw-semibold text-dark mb-1">Password</label>
                        </div>
                        <input
                            type="password"
                            name="password"
                            className="form-control py-2 shadow-none border-1"
                            placeholder="Enter password"
                            style={{ fontSize: '14px', borderRadius: '8px' }}
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-dark w-100 py-2 fw-bold mb-3 shadow-sm rounded-3">
                        Sign In
                    </button>

                    <div className="position-relative text-center my-4">
                        <hr className="opacity-10" />
                        <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">New to NexusKart?</span>
                    </div>

                    <Link to="/signup" className="btn btn-outline-secondary w-100 py-2 small fw-semibold rounded-3 text-dark text-decoration-none">
                        Create your NexusKart account
                    </Link>
                </form>
            </div>

            <div className="mt-4 text-center small opacity-50">
                <p>© 2026 NexusKart.com</p>
            </div>
        </div>
    );
};

export default Login;
