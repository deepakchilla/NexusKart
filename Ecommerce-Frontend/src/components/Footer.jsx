import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axios';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError('');

        try {
            await axios.post('/newsletter/subscribe', { email });
            setSubscribed(true);
            setEmail('');
        } catch (err) {
            console.error('Subscription error:', err);
            const data = err.response?.data;
            const errorMessage = typeof data === 'object' ? data.message : (data || 'Something went wrong');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="footer-light py-5 mt-5" style={{ backgroundColor: '#ffffff', color: '#000000', borderTop: '1px solid #f0f0f0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="container-fluid px-lg-5">
                <div className="row g-5 align-items-start">
                    {/* Brand & Mission */}
                    <div className="col-lg-4">
                        <Link className="navbar-brand fw-bold mb-4 d-block" to="/" style={{ color: '#000000', fontSize: '1.6rem', letterSpacing: '-0.06em' }}>
                            NEXUS<span style={{ fontWeight: '400' }}>KART</span>
                        </Link>
                        <p className="mb-4 pe-lg-5" style={{ color: '#525252', lineHeight: '1.7', fontSize: '0.95rem' }}>
                            Redefining the digital shopping experience through curated technology and minimalist design.
                            We bridge the gap between innovation and everyday utility.
                        </p>
                        <div className="d-flex gap-3">
                            {['twitter-x', 'instagram', 'linkedin', 'github'].map((social) => (
                                <Link key={social} to="#" className="social-icon-box-light">
                                    <i className={`bi bi-${social}`}></i>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="col-lg-4 col-md-12">
                        <div className="row g-4">
                            <div className="col-6">
                                <h6 className="text-dark text-uppercase small fw-bold mb-4" style={{ letterSpacing: '0.15em' }}>Navigation</h6>
                                <ul className="list-unstyled d-flex flex-column gap-3">
                                    <li><Link to="/" className="footer-link">Home</Link></li>
                                    <li><Link to="/category/Laptop" className="footer-link">Laptops</Link></li>
                                    <li><Link to="/category/Mobile" className="footer-link">Mobile</Link></li>
                                    <li><Link to="/category/Electronics" className="footer-link">Electronics</Link></li>
                                </ul>
                            </div>
                            <div className="col-6">
                                <h6 className="text-dark text-uppercase small fw-bold mb-4" style={{ letterSpacing: '0.15em' }}>Company</h6>
                                <ul className="list-unstyled d-flex flex-column gap-3">
                                    <li><Link to="/profile" className="footer-link">Profile</Link></li>
                                    <li><Link to="/orders" className="footer-link">Orders</Link></li>
                                    <li><Link to="/membership" className="footer-link">Membership</Link></li>
                                    <li><Link to="#" className="footer-link">Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter & Meta */}
                    <div className="col-lg-4">
                        <h6 className="text-dark text-uppercase small fw-bold mb-4" style={{ letterSpacing: '0.15em' }}>Newsletter</h6>

                        {subscribed ? (
                            <div className="newsletter-success p-4 rounded-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <i className="bi bi-patch-check-fill text-success fs-4 mb-2 d-block"></i>
                                <h6 className="fw-bold text-success mb-1">Check your inbox!</h6>
                                <p className="smaller text-success mb-0 opacity-75">You've been successfully added to the NexusKart circle.</p>
                            </div>
                        ) : (
                            <>
                                <p className="small mb-4" style={{ color: '#525252' }}>Join 5,000+ tech visionaries. No spam, only innovation.</p>
                                <form onSubmit={handleSubscribe} className="newsletter-wrapper p-1 rounded-pill" style={{ background: '#f8f8f8', border: '1px solid #eeeeee' }}>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className="form-control bg-transparent border-0 text-dark shadow-none ps-3"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={{ fontSize: '14px' }}
                                            required
                                        />
                                        <button
                                            className="btn btn-dark rounded-pill px-4 fw-bold"
                                            style={{ fontSize: '13px' }}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? '...' : 'Join'}
                                        </button>
                                    </div>
                                </form>
                                {error && <p className="smaller text-danger mt-2 ms-2">{error}</p>}
                            </>
                        )}

                        <div className="mt-4 d-flex align-items-center gap-2">
                            <div className="status-dot"></div>
                            <span className="smaller" style={{ color: '#a3a3a3' }}>Systems Operational</span>
                        </div>
                    </div>
                </div>

                <div className="mt-5 pt-4 border-top" style={{ borderColor: '#f0f0f0' }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <p className="smaller mb-0" style={{ color: '#a3a3a3' }}>
                            © 2026 NEXUSKART SYSTEMS. ALL RIGHTS RESERVED.
                        </p>
                        <div className="d-flex gap-4">
                            <span className="smaller text-uppercase fw-bold" style={{ color: '#e5e5e5', letterSpacing: '0.1em' }}>Premium Ecommerce</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .footer-link {
                    color: #525252;
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .footer-link:hover {
                    color: #000000;
                    padding-left: 5px;
                }
                .social-icon-box-light {
                    width: 40px;
                    height: 40px;
                    background: #ffffff;
                    border: 1px solid #eeeeee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    color: #525252;
                    font-size: 1.1rem;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                .social-icon-box-light:hover {
                    border-color: #000000;
                    color: #000000;
                    transform: translateY(-3px);
                }
                .smaller { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; }
                .status-dot {
                    width: 6px;
                    height: 6px;
                    background: #22c55e;
                    border-radius: 50%;
                    box-shadow: 0 0 8px #22c55e;
                }
            `}</style>
        </footer >
    );
};

export default Footer;
