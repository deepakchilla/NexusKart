import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";

const Signup = () => {
    const [userData, setUserData] = useState({ name: "", email: "", password: "", adminCode: "" });
    const [isAdminFieldVisible, setIsAdminFieldVisible] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/auth/signup", userData);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data || "Something went wrong. Please try again.");
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
                    <h2 className="h4 fw-bold mb-1" style={{ color: "var(--text-primary)" }}>Create Account</h2>
                    <p className="text-muted small">Join NexusKart for the best tech deals</p>
                </div>

                {error && <div className="alert alert-danger py-2 px-3 small border-0 mb-4" style={{ backgroundColor: '#fff5f5', color: '#c53030' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold text-dark mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control py-2 shadow-none border-1"
                            placeholder="John Doe"
                            style={{ fontSize: '14px', borderRadius: '8px' }}
                            value={userData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold text-dark mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control py-2 shadow-none border-1"
                            placeholder="name@example.com"
                            style={{ fontSize: '14px', borderRadius: '8px' }}
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-semibold text-dark mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control py-2 shadow-none border-1"
                            placeholder="At least 6 characters"
                            style={{ fontSize: '14px', borderRadius: '8px' }}
                            value={userData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Admin Access Section */}
                    <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6' }}>
                        <div className="form-check">
                            <input
                                className="form-check-input shadow-none"
                                type="checkbox"
                                id="adminCheck"
                                checked={isAdminFieldVisible}
                                onChange={() => setIsAdminFieldVisible(!isAdminFieldVisible)}
                            />
                            <label className="form-check-label small fw-bold text-secondary" htmlFor="adminCheck">
                                Register as Admin?
                            </label>
                        </div>
                        {isAdminFieldVisible && (
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="adminCode"
                                    className="form-control py-2 shadow-none border-1"
                                    placeholder="Enter Admin Secret Key"
                                    style={{ fontSize: '13px', borderRadius: '8px' }}
                                    value={userData.adminCode}
                                    onChange={handleChange}
                                    required={isAdminFieldVisible}
                                />
                                <p className="text-info-emphasis mt-1 mb-0" style={{ fontSize: '10px' }}>
                                    Required for Administrative privileges.
                                </p>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-dark w-100 py-2 fw-bold mb-3 shadow-sm rounded-3">
                        Sign Up
                    </button>

                    <div className="text-center mt-3">
                        <p className="small text-muted mb-0">
                            Already have an account? <Link to="/login" className="fw-bold text-decoration-none" style={{ color: "var(--accent-color)" }}>Sign In</Link>
                        </p>
                    </div>
                </form>
            </div>

            <div className="mt-4 text-center small opacity-50">
                <p>© 2026 NexusKart.com</p>
            </div>
        </div>
    );
};

export default Signup;
