import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="footer-premium" style={{ backgroundColor: "#f5f5f7", color: "#1d1d1f", fontFamily: "'Inter', sans-serif" }}>
            {/* Back to Top bar - Mid Gray */}
            <div
                onClick={scrollToTop}
                className="text-center py-3 w-100 transition-all border-bottom"
                style={{
                    backgroundColor: "#e5e7eb",
                    color: "#4b5563",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.3s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#d1d5db"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
            >
                Back to top
            </div>

            {/* Main Content - Uniform Gray */}
            <div className="container-fluid px-lg-5 py-5">
                <div className="container">
                    <div className="row g-4">
                        {/* Newsletter Signup */}
                        <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
                            <h5 className="fw-bold mb-3" style={{ color: "#1d1d1f" }}>Stay Updated</h5>
                            <p className="small mb-4" style={{ color: "#6e6e73", lineHeight: "1.6" }}>
                                Subscribe to get notified about the latest tech deals and exclusive member offers.
                            </p>
                            <div className="input-group mb-4" style={{ maxWidth: "340px" }}>
                                <input
                                    type="text"
                                    className="form-control border px-3 bg-white"
                                    placeholder="your-email@example.com"
                                    style={{ borderRadius: "8px 0 0 8px", fontSize: "14px", height: "45px", borderColor: "#d2d2d7" }}
                                />
                                <button
                                    className="btn fw-bold px-4 text-white border-0"
                                    style={{ backgroundColor: "var(--accent-color)", borderRadius: "0 8px 8px 0", height: "45px" }}
                                >
                                    Subscribe
                                </button>
                            </div>
                            {/* Social Icons - Premium Dark Icons on Gray */}
                            <div className="d-flex gap-3 mt-2">
                                {['facebook', 'twitter-x', 'instagram', 'linkedin'].map((social) => (
                                    <Link key={social} to="#" className="social-icon-box">
                                        <i className={`bi bi-${social}`}></i>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Columns */}
                        <div className="col-lg-8 col-md-12">
                            <div className="row g-4">
                                <div className="col-md-4 col-12">
                                    <h6 className="fw-bold mb-3" style={{ color: "#1d1d1f" }}>Let Us Help You</h6>
                                    <ul className="list-unstyled d-flex flex-column gap-2">
                                        <li><Link to="/profile" className="nav-link-gray">Your Account</Link></li>
                                        <li><Link to="/orders" className="nav-link-gray">Returns Centre</Link></li>
                                        <li><Link to="/membership" className="nav-link-gray">Prime Membership</Link></li>
                                        <li><Link to="#" className="nav-link-gray">Help Centre</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section - Uniform Light Gray */}
            <div className="py-5 border-top border-bottom" style={{ borderColor: "#d2d2d7" }}>
                <div className="container text-center">
                    <Link to="/" className="text-decoration-none d-inline-block mb-4">
                        <h3 className="fw-bold mb-0" style={{ color: "#1d1d1f", letterSpacing: "-1px" }}>
                            Nexus<span style={{ color: "var(--accent-color)" }}>Kart</span>
                        </h3>
                    </Link>
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        <button className="btn btn-sm btn-outline-dark px-4 py-2 rounded-2" style={{ borderColor: "#d2d2d7", fontSize: "13px" }}>🌐 English</button>
                        <button className="btn btn-sm btn-outline-dark px-4 py-2 rounded-2" style={{ borderColor: "#d2d2d7", fontSize: "13px" }}>🇮🇳 India</button>
                        <button className="btn btn-sm btn-outline-dark px-4 py-2 rounded-2" style={{ borderColor: "#d2d2d7", fontSize: "13px" }}>Currency: INR</button>
                    </div>
                </div>
            </div>

            {/* Final Legal Section */}
            <div className="py-4">
                <div className="container">
                    <p className="text-center mb-0" style={{ fontSize: "12px", color: "#6e6e73" }}>
                        © 2010-2026, NexusKart.com, Inc. or its affiliates
                    </p>
                </div>
            </div>

            <style>{`
                .nav-link-gray {
                    color: #4b5563;
                    text-decoration: none;
                    font-size: 14px;
                    transition: color 0.2s;
                }
                .nav-link-gray:hover {
                    color: var(--accent-color);
                }
                .legal-link-gray {
                    color: #6e6e73;
                    text-decoration: none;
                }
                .legal-link-gray:hover {
                    color: var(--accent-color);
                    text-decoration: underline;
                }
                .social-icon-box {
                    width: 42px;
                    height: 42px;
                    background-color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    color: #1d1d1f !important;
                    font-size: 18px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: 1px solid #d2d2d7;
                }
                .social-icon-box:hover {
                    background-color: var(--accent-color);
                    color: #ffffff !important;
                    border-color: var(--accent-color);
                    transform: translateY(-3px);
                }
            `}</style>
        </footer>
    );
};

export default Footer;
