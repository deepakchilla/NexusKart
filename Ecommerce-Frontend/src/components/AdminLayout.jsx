import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";

const AdminLayout = ({ children }) => {
    const { user, logout } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: "Dashboard", path: "/admin", icon: "bi-speedometer2" },
        { name: "Products", path: "/admin/products", icon: "bi-box-seam" },
        { name: "Add Product", path: "/add_product", icon: "bi-plus-circle" },
        { name: "Orders", path: "/admin/orders", icon: "bi-bag-check" },
    ];

    return (
        <div className="admin-layout" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <div className="admin-content" style={{ padding: "calc(var(--header-height) + 1rem) 0 2rem 0" }}>
                <main>
                    {children}
                </main>
            </div>
            <style>{`
                .admin-layout { font-family: 'Inter', sans-serif; }
            `}</style>
        </div>
    );
};

export default AdminLayout;
