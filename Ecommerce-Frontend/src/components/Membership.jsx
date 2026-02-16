import React from "react";

const Membership = () => {
    return (
        <div className="container py-5 mt-5">
            <div className="card shadow-sm border-0 p-0 overflow-hidden" style={{ borderRadius: '24px' }}>
                <div className="p-5 text-white bg-dark text-center">
                    <h1 className="fw-bold display-4">NexusKart <span className="text-white">Elite</span></h1>
                    <p className="lead opacity-75">Level up your tech shopping experience</p>
                </div>
                <div className="p-5">
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 text-center" style={{ borderRadius: '16px' }}>
                                <i className="bi bi-truck display-4 text-white mb-3"></i>
                                <h5 className="fw-bold">Free Delivery</h5>
                                <p className="text-muted small">Get fast, free shipping on all eligible items with no minimum spend.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 text-center" style={{ borderRadius: '16px' }}>
                                <i className="bi bi-lightning-charge display-4 text-dark mb-3"></i>
                                <h5 className="fw-bold">Early Access</h5>
                                <p className="text-muted small">Be the first to know about new tech launches and limited deals.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 text-center" style={{ borderRadius: '16px' }}>
                                <i className="bi bi-shield-check display-4 text-dark mb-3"></i>
                                <h5 className="fw-bold">Elite Shield</h5>
                                <p className="text-muted small">Extended warranty and premium support for all your tech purchases.</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-5">
                        <button className="btn btn-dark btn-lg px-5 fw-bold rounded-pill shadow">Join Elite Now</button>
                        <p className="mt-3 text-muted small">Cancel anytime. Terms and conditions apply.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Membership;
