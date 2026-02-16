import React, { useEffect, useState, useContext } from "react";
import axios from "../axios";
import AppContext from "../Context/Context";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AppContext);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                // Assuming /orders/all exists for admins, or just /orders
                const response = await axios.get("/orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching all orders:", error);
                // Fallback to empty if not implemented
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'ADMIN') {
            fetchAllOrders();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-orders container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0 text-dark">Customer Orders</h2>
                    <p className="text-muted small mb-0">Monitor and manage all customer transactions</p>
                </div>
                <div className="badge bg-dark px-3 py-2 rounded-pill shadow-sm">
                    {orders.length} Total Orders
                </div>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light border-bottom">
                            <tr>
                                <th className="ps-4 py-3 fw-bold text-muted small">ORDER ID</th>
                                <th className="py-3 fw-bold text-muted small">CUSTOMER</th>
                                <th className="py-3 fw-bold text-muted small">DATE</th>
                                <th className="py-3 fw-bold text-muted small">TOTAL</th>
                                <th className="py-3 fw-bold text-muted small">STATUS</th>
                                <th className="py-3 fw-bold text-muted small text-end pe-4">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="ps-4 py-3 fw-bold">#{order.id}</td>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                    {order.user?.name?.charAt(0).toUpperCase() || 'C'}
                                                </div>
                                                <span className="fw-medium">{order.user?.name || 'Customer'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-muted">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="py-3 fw-bold">₹{order.totalAmount?.toLocaleString()}</td>
                                        <td className="py-3">
                                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '10px' }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-end pe-4">
                                            <button className="btn btn-sm btn-outline-dark rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '11px' }}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="text-muted">
                                            <i className="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                                            <p>No orders found in the system.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
