import React, { useEffect, useState, useContext } from "react";
import axios from "../axios";
import AppContext from "../Context/Context";
import { Link, useNavigate } from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await axios.get("/orders/my-orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) {
        return <div className="container py-5 mt-5 text-center">Loading your orders...</div>;
    }

    return (
        <div className="container py-5">
            <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '16px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold m-0">Your Orders</h2>
                    <span className="badge bg-light text-dark border">{orders.length} Orders</span>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-box-seam display-1 text-muted opacity-25"></i>
                        <h4 className="mt-4 text-muted">You haven't placed any orders yet.</h4>
                        <p className="text-muted">Once you make a purchase, your orders will appear here.</p>
                        <Link to="/" className="btn btn-dark mt-3 px-4 fw-bold">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card p-3 border rounded-3 mb-3 hover-shadow transition-all">
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 bg-light p-2 rounded">
                                    <div className="order-meta">
                                        <p className="text-muted small mb-0 uppercase fw-bold">Order Placed</p>
                                        <p className="mb-0 small">{new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="order-meta">
                                        <p className="text-muted small mb-0 uppercase fw-bold">Total</p>
                                        <p className="mb-0 small fw-bold text-dark">₹{order.totalAmount?.toLocaleString()}</p>
                                    </div>
                                    <div className="order-meta">
                                        <p className="text-muted small mb-0 uppercase fw-bold">Status</p>
                                        <span className="badge bg-dark small">{order.status}</span>
                                    </div>
                                    <div className="order-meta">
                                        <p className="text-muted small mb-0 uppercase fw-bold">Order #</p>
                                        <p className="mb-0 small">{order.id}</p>
                                    </div>
                                </div>

                                <div className="order-items pt-2">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="item-row d-flex gap-3 align-items-center mb-2">
                                            <div className="item-info">
                                                <Link to={`/product/${item.product?.id}`} className="text-decoration-none fw-bold text-dark">
                                                    {item.product?.name}
                                                </Link>
                                                <p className="small text-muted mb-0">Qty: {item.quantity} | Price: ₹{item.price?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .order-card { transition: all 0.2s ease; }
                .order-card:hover { border-color: #333 !important; transform: translateY(-2px); }
                .uppercase { text-transform: uppercase; letter-spacing: 0.5px; }
            `}</style>
        </div>
    );
};

export default Orders;
