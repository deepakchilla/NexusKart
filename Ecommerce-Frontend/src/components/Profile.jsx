import React, { useContext, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../axios";

const Profile = () => {
    const { user, updateUser, imageTimestamp, refreshImage } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: ""
    });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    if (!user) {
        return (
            <div className="container py-5 mt-5">
                <div className="alert alert-warning shadow-sm border-0" style={{ borderRadius: '12px' }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Please <Link to="/login" className="alert-link">login</Link> to view your profile.
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("imageFile", file);

        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            console.log("Starting image upload for user:", user.id);
            const response = await axios.post(`/users/${user.id}/image`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log("Upload successful:", response.data);
            refreshImage();
            setStatus({ type: "success", message: "Profile picture updated!" });
        } catch (error) {
            console.error("❌ PROFILE IMAGE UPLOAD FAILED");
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                console.error("Status Code:", error.response.status);
                console.error("Server Message Data:", error.response.data);

                let errorMsg = "Internal Server Error";
                if (typeof error.response.data === 'string') {
                    errorMsg = error.response.data;
                } else if (error.response.data && error.response.data.message) {
                    errorMsg = error.response.data.message;
                } else if (error.response.data && error.response.data.error) {
                    errorMsg = error.response.data.error;
                }

                setStatus({
                    type: "danger",
                    message: `Upload failed (${error.response.status}): ${errorMsg}`
                });
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received from server");
                setStatus({ type: "danger", message: "No response from server. Check your connection." });
            } else {
                // Something happened in setting up the request
                console.error("Request Error:", error.message);
                setStatus({ type: "danger", message: "Error setting up upload request." });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await axios.put(`/auth/profile/${user.id}`, formData);
            updateUser(response.data);
            setIsEditing(false);
            setStatus({ type: "success", message: "Profile updated successfully!" });
            // Clear password field
            setFormData(prev => ({ ...prev, password: "" }));
        } catch (error) {
            setStatus({
                type: "danger",
                message: error.response?.data || "Failed to update profile. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page py-5 mt-5" style={{ backgroundColor: 'var(--bg-secondary)', minHeight: 'calc(100vh - 64px)' }}>
            <div className="container">
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none" style={{ color: 'var(--accent-color)' }}>Home</Link></li>
                        <li className="breadcrumb-item active">Your Account</li>
                    </ol>
                </nav>

                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {status.message && (
                            <div className={`alert alert-${status.type} alert-dismissible fade show mb-4 border-0 shadow-sm`} role="alert" style={{ borderRadius: '12px' }}>
                                {status.type === 'success' ? <i className="bi bi-check-circle-fill me-2"></i> : <i className="bi bi-exclamation-circle-fill me-2"></i>}
                                {status.message}
                                <button type="button" className="btn-close" onClick={() => setStatus({ type: "", message: "" })}></button>
                            </div>
                        )}

                        <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '20px' }}>
                            <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0">
                                <h2 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Account Settings</h2>
                                <p className="text-muted small">Manage your personal information and security</p>
                            </div>

                            <div className="card-body p-4">
                                <div className="row g-5">
                                    {/* Sidebar Info */}
                                    <div className="col-md-4 text-center border-end">
                                        <div className="position-relative d-inline-block mb-4">
                                            <div className="profile-avatar-container">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm overflow-hidden border border-4 border-white"
                                                    style={{
                                                        width: '140px',
                                                        height: '140px',
                                                        fontSize: '56px',
                                                        fontWeight: '700',
                                                        color: 'white',
                                                        background: 'var(--text-primary)'
                                                    }}>
                                                    <img
                                                        src={`${API_BASE_URL}/users/${user.id}/image?t=${imageTimestamp}`}
                                                        alt=""
                                                        className="w-100 h-100 object-fit-cover"
                                                        style={{ display: 'none' }}
                                                        onLoad={(e) => {
                                                            e.target.style.display = 'block';
                                                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'none';
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="initial-placeholder w-100 h-100 d-flex align-items-center justify-content-center">
                                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                </div>
                                                <label htmlFor="avatar-upload" className="avatar-edit-btn position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center bg-white shadow border rounded-circle cursor-pointer transition-all" style={{ width: '40px', height: '40px', zIndex: 2 }}>
                                                    <i className="bi bi-camera-fill text-dark fs-6"></i>
                                                    <input
                                                        type="file"
                                                        id="avatar-upload"
                                                        className="d-none"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <h4 className="fw-bold mb-1">{user.name}</h4>
                                        <p className="text-muted small mb-4">{user.email}</p>

                                        <div className="d-grid gap-2 text-start">
                                            <div className="p-3 bg-light rounded-3 mb-2 border border-light">
                                                <div className="small text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '10px' }}>Account Type</div>
                                                <div className="fw-bold"><i className="bi bi-person-badge me-2"></i>{user.role} Account</div>
                                            </div>
                                            <div className="p-3 bg-light rounded-3 border border-light">
                                                <div className="small text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '10px' }}>Security Status</div>
                                                <div className="fw-bold text-success"><i className="bi bi-shield-check me-2"></i>Verified Identity</div>
                                            </div>

                                            {user.role === 'ADMIN' && (
                                                <Link to="/admin" className="btn btn-dark w-100 mt-3 py-2 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2">
                                                    <i className="bi bi-speedometer2"></i> Admin Dashboard
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Main Form */}
                                    <div className="col-md-8">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h5 className="fw-bold mb-0"><i className="bi bi-person-lines-fill me-2 opacity-50"></i>Personal Information</h5>
                                            {!isEditing && (
                                                <button onClick={() => setIsEditing(true)} className="btn btn-outline-dark btn-sm rounded-pill px-3">
                                                    <i className="bi bi-pencil-square me-2"></i>Edit Details
                                                </button>
                                            )}
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="row g-4">
                                                <div className="col-md-12">
                                                    <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        className={`form-control ${isEditing ? 'bg-white' : 'bg-light border-0'}`}
                                                        style={{ borderRadius: '10px', padding: '12px' }}
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        readOnly={!isEditing}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className={`form-control ${isEditing ? 'bg-white' : 'bg-light border-0'}`}
                                                        style={{ borderRadius: '10px', padding: '12px' }}
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        readOnly={!isEditing}
                                                        required
                                                    />
                                                </div>

                                                {isEditing && (
                                                    <div className="col-md-12">
                                                        <label className="form-label small fw-bold text-muted text-uppercase">New Password (leave blank to keep current)</label>
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            className="form-control"
                                                            placeholder="••••••••"
                                                            style={{ borderRadius: '10px', padding: '12px' }}
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                )}

                                                <div className="col-md-12 mt-5">
                                                    {isEditing ? (
                                                        <div className="d-flex gap-3">
                                                            <button type="submit" className="btn btn-save-changes px-5 py-2 fw-bold rounded-pill shadow-sm text-white" disabled={loading}>
                                                                {loading ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                        Saving...
                                                                    </>
                                                                ) : 'Save Changes'}
                                                            </button>
                                                            <button type="button" onClick={() => {
                                                                setIsEditing(false);
                                                                setFormData({ name: user.name, email: user.email, password: "" });
                                                            }} className="btn btn-light px-4 py-2 fw-bold rounded-pill border">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 rounded-3 border bg-light text-center">
                                                            <i className="bi bi-shield-lock fs-1 text-muted opacity-25 mb-3 d-block"></i>
                                                            <p className="text-muted small mb-0">Your profile is currently in view-only mode. Click "Edit Details" to update your information or change your password.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </form>

                                        <div className="mt-5 pt-4 border-top">
                                            <h5 className="fw-bold text-danger mb-3">Danger Zone</h5>
                                            <div className="card border-danger-subtle bg-danger-subtle bg-opacity-10 p-4" style={{ borderRadius: '12px' }}>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                                    <div>
                                                        <h6 className="fw-bold mb-1">Delete Account</h6>
                                                        <p className="small text-muted mb-0">Once you delete your account, there is no going back. Please be certain.</p>
                                                    </div>
                                                    <button className="btn btn-danger px-4 py-2 fw-bold rounded-pill">Permanently Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .breadcrumb-item + .breadcrumb-item::before {
                    content: "›";
                    font-size: 20px;
                    line-height: 1;
                    vertical-align: middle;
                    color: #9ca3af;
                }
                .form-control:focus {
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
                }
                .btn-save-changes {
                    background: var(--accent-color);
                    border: none;
                    color: white !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-save-changes:hover {
                    background: var(--accent-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
                    color: white !important;
                }
                .btn-save-changes:disabled {
                    opacity: 0.7;
                    transform: none;
                }
                .btn-dark {
                    background-color: var(--text-primary);
                    border: none;
                }
                .btn-dark:hover {
                    background-color: #000;
                    transform: translateY(-1px);
                }
                .card {
                    transition: transform 0.3s ease;
                }
                .avatar-edit-btn:hover {
                    background: #f8f9fa !important;
                    transform: scale(1.1);
                }
                .avatar-edit-btn {
                    transition: all 0.3s ease;
                }
                .btn-outline-dark {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-outline-dark i {
                    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-outline-dark:hover i {
                    color: white !important;
                }
            `}</style>
        </div>
    );
};

export default Profile;
