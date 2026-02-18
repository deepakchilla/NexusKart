
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Membership = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const benefits = [
        {
            icon: "bi bi-lightning-charge-fill",
            title: "Priority fulfillment",
            description: "Nexus Pro orders move to the front of the line. Enjoy guaranteed same-day processing and ultra-fast 1-day shipping on eligible curated gadgets."
        },
        {
            icon: "bi bi-stars",
            title: "Exclusive tech drops",
            description: "Get 48-hour early access to pre-orders and limited-edition releases. Never miss out on the latest tech innovations again."
        },
        {
            icon: "bi bi-shield-check",
            title: "Nexus extended guard",
            description: "Automatically receive an extra 12 months of manufacturer warranty on every electronics purchase. Rest easy with premium protection."
        },
        {
            icon: "bi bi-headset",
            title: "VIP 24/7 concierge",
            description: "Access a dedicated support line with expert tech advisors. No waiting, no bots—just elite assistance whenever you need it."
        },
        {
            icon: "bi bi-percent",
            title: "Zero-fee returns",
            description: "Changed your mind? We'll pick it up for free. No restocking fees, no questions asked, within 30 days of purchase."
        },
        {
            icon: "bi bi-gift",
            title: "Annual anniversary credit",
            description: "Receive a ₹2,000 store credit every year on your membership anniversary to spend on any collection in the Nexus store."
        }
    ];

    return (
        <div className="pro-page-wrapper bg-white min-vh-100" style={{ paddingTop: 'var(--header-height)' }}>
            {/* Hero Section */}
            <div className="pro-hero text-center py-5 mb-5 px-3">
                <div className="container">
                    <h1 className="display-3 fw-800 mb-3" style={{ letterSpacing: '-0.06em' }}>
                        NEXUS<span style={{ fontWeight: '400' }}>PRO</span>
                    </h1>
                    <p className="lead mx-auto text-secondary mb-5" style={{ maxWidth: '600px', fontSize: '1.25rem' }}>
                        Join the elite circle of tech enthusiasts and experience a shopping journey designed for the modern visionary.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <button className="startup-btn-primary px-5 py-3 shadow-lg">Start 30-Day Free Trial</button>
                        <Link to="/" className="startup-btn-outline px-5 py-3 text-decoration-none">Explore Collections</Link>
                    </div>
                    <p className="mt-4 smaller text-muted fw-bold">₹999/month after trial • Cancel anytime</p>
                </div>
            </div>

            {/* Benefits Grid */}
            <div className="container py-5">
                <div className="row g-5">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="col-lg-4 col-md-6">
                            <div className="benefit-card h-100 p-4 rounded-4 border-0 transition-all hover-lift">
                                <div className="icon-wrapper mb-4 d-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: '64px', height: '64px' }}>
                                    <i className={`${benefit.icon} fs-3 text-dark`}></i>
                                </div>
                                <h4 className="fw-800 mb-3" style={{ fontSize: '1.25rem' }}>{benefit.title}</h4>
                                <p className="text-secondary small leading-relaxed m-0" style={{ lineHeight: '1.6' }}>
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comparison Section */}
            <div className="bg-light py-5 mt-5">
                <div className="container py-5">
                    <h2 className="text-center fw-800 mb-5 pb-3">Why go Pro?</h2>
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="table-responsive bg-white rounded-4 shadow-sm border p-2">
                                <table className="table table-borderless align-middle m-0">
                                    <thead>
                                        <tr className="border-bottom">
                                            <th className="p-4 fs-5 text-uppercase smaller tracking-widest">Features</th>
                                            <th className="p-4 text-center text-muted fw-normal">Standard</th>
                                            <th className="p-4 text-center fw-800">Nexus Pro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-bottom">
                                            <td className="p-4 fw-bold">Delivery Speed</td>
                                            <td className="p-4 text-center text-muted">3-5 Days</td>
                                            <td className="p-4 text-center fw-800 text-dark">12-24 Hours</td>
                                        </tr>
                                        <tr className="border-bottom">
                                            <td className="p-4 fw-bold">New Launches</td>
                                            <td className="p-4 text-center text-muted">Direct Buy</td>
                                            <td className="p-4 text-center fw-800 text-dark">48h Early Access</td>
                                        </tr>
                                        <tr className="border-bottom">
                                            <td className="p-4 fw-bold">Returns</td>
                                            <td className="p-4 text-center text-muted">Flat Fee</td>
                                            <td className="p-4 text-center fw-800 text-dark">Always Free</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 fw-bold">Warranty</td>
                                            <td className="p-4 text-center text-muted">Standard</td>
                                            <td className="p-4 text-center fw-800 text-dark">+1 Year Extra</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="container py-5 my-5 text-center">
                <div className="p-5 bg-black text-white rounded-5 shadow-2xl position-relative overflow-hidden">
                    <div className="position-relative z-1">
                        <h2 className="display-5 fw-800 mb-4 text-white">Ready to upgrade?</h2>
                        <p className="lead mb-5 opacity-75 text-white">Join thousands of visionaries who have already leveled up.</p>
                        <button className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold text-dark hover-lift">Unlock Your Pro Access</button>
                    </div>
                </div>
            </div>

            <style>{`
                .benefit-card:hover {
                    background: #fdfdfd;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                }
                .benefit-card .icon-wrapper {
                    transition: all 0.4s ease;
                }
                .benefit-card:hover .icon-wrapper {
                    background: #000 !important;
                    transform: scale(1.1);
                }
                .benefit-card:hover .icon-wrapper i {
                    color: #fff !important;
                }
                .pro-hero {
                    background: radial-gradient(circle at 50% 100%, #fafafa 0%, #ffffff 100%);
                }
            `}</style>
        </div>
    );
};

export default Membership;
