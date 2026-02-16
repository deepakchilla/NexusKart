import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "../axios";

const AdminDashboard = () => {
    const { data, refreshData, user } = useContext(AppContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isDeleting, setIsDeleting] = useState(null);

    useEffect(() => {
        // Simple client-side protection (can be bypassed, but routes are also protected)
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        setProducts(data);
    }, [data]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setIsDeleting(id);
            try {
                await axios.delete(`/product/${id}`);
                alert("Product deleted successfully");
                refreshData();
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product");
            } finally {
                setIsDeleting(null);
            }
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-0">Admin Dashboard</h2>
                        <p className="text-muted small mb-0">Manage your store inventory and products</p>
                    </div>
                    <Link to="/add_product" className="btn btn-dark rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2">
                        <i className="bi bi-plus-lg text-white"></i>
                        Add New Product
                    </Link>
                </div>

                <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light border-bottom">
                                <tr>
                                    <th className="ps-4 py-3 fw-bold text-muted small" style={{ width: '80px' }}>ID</th>
                                    <th className="py-3 fw-bold text-muted small">PRODUCT INFO</th>
                                    <th className="py-3 fw-bold text-muted small">CATEGORY</th>
                                    <th className="py-3 fw-bold text-muted small">PRICE</th>
                                    <th className="py-3 fw-bold text-muted small">STOCK</th>
                                    <th className="py-3 fw-bold text-muted small text-end pe-4">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="ps-4 py-3 text-muted small">#{product.id}</td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                                        <i className="bi bi-box text-muted"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{product.name}</div>
                                                        <div className="text-muted smaller">{product.brand}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className="badge bg-light text-dark border rounded-pill px-3 py-1 fw-medium" style={{ fontSize: '11px' }}>
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-3 fw-bold text-dark">₹{product.price.toLocaleString()}</td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className={`rounded-circle ${product.stockQuantity > 10 ? 'bg-success' : 'bg-danger'}`} style={{ width: '8px', height: '8px' }}></div>
                                                    <span className="fw-medium">{product.stockQuantity}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-end pe-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link
                                                        to={`/product/update/${product.id}`}
                                                        className="btn btn-sm btn-outline-dark rounded-pill px-3 border-0 transition-all"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        disabled={isDeleting === product.id}
                                                        className="btn btn-sm btn-outline-danger rounded-pill px-3 border-0 transition-all hover-bg-danger"
                                                    >
                                                        {isDeleting === product.id ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : (
                                                            <i className="bi bi-trash3"></i>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="text-muted py-3">
                                                <i className="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                                                <p>No products found. Start by adding one!</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .admin-dashboard .table thead th {
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }
                .admin-dashboard .smaller {
                    font-size: 11px;
                }
                .admin-dashboard .hover-bg-danger:hover {
                    background-color: #000;
                    color: white !important;
                }
                .transition-all {
                    transition: all 0.2s ease;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
