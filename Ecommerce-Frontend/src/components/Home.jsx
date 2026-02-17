import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import axios, { API_BASE_URL } from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("search");

  const { isError, addToCart, user } = useContext(AppContext);
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, stockStatus: "Checking...", lowStockCount: 0 });
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (pageNum) => {
    try {
      let url = `/products?page=${pageNum}&size=8`;
      if (categoryName) url += `&category=${categoryName}`;
      if (keyword) url += `&keyword=${keyword}`;

      const response = await axios.get(url);
      const newProducts = response.data.content;

      if (pageNum === 0) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      setHasMore(!response.data.last);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchStats = async () => {
    if (user?.role === 'ADMIN') {
      try {
        const response = await axios.get("/statistics");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
  };

  useEffect(() => {
    setPage(0);
    fetchProducts(0);
    fetchStats();
    // Explicitly scroll to top when category or search changes
    window.scrollTo(0, 0);
  }, [categoryName, keyword, user]);

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/product/${id}`);
        setProducts(products.filter((p) => p.id !== id));
        fetchStats(); // Update stats after delete
        alert("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const calculateRating = (reviews) => {
    if (!reviews || reviews.length === 0) return { stars: 4.5, count: 0 };
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    return { stars: avg.toFixed(1), count: reviews.length };
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const getProductsByCategory = (category) => {
    return products.filter(p => p.category === category).slice(0, 6);
  };

  if (isError) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="text-center">
          <img src={unplugged} alt="Error" style={{ width: '150px' }} className="mb-4" />
          <h3>Oops! Something went wrong.</h3>
          <p className="text-muted">{isError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-wrapper">
        <div className="hero-main">
          <div className="hero-text">
            <h1 className="hero-title">Elevate Your Lifestyle.</h1>
            <p className="hero-description">
              Experience the pinnacle of technology with our curated collection of premium gadgets.
              Designed for the modern professional, built for the future.
            </p>
            <div className="hero-cta-group">
              <a href="#products" className="startup-btn-primary text-decoration-none">
                Shop Collection <i className="bi bi-arrow-right"></i>
              </a>
              <Link to="/membership" className="startup-btn-outline text-decoration-none">
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="info-bar">
        <div className="info-item">
          <div className="info-icon"><i className="bi bi-truck"></i></div>
          <div className="info-title">Free Shipping</div>
          <div className="info-desc">On orders over ₹5,000</div>
        </div>
        <div className="info-item">
          <div className="info-icon"><i className="bi bi-shield-check"></i></div>
          <div className="info-title">2 Year Warranty</div>
          <div className="info-desc">On all electronics</div>
        </div>
        <div className="info-item">
          <div className="info-icon"><i className="bi bi-chat-dots"></i></div>
          <div className="info-title">24/7 Support</div>
          <div className="info-desc">Expert tech assistance</div>
        </div>
        <div className="info-item">
          <div className="info-icon"><i className="bi bi-arrow-repeat"></i></div>
          <div className="info-title">Easy Returns</div>
          <div className="info-desc">30-day money back</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="app-container">
        <aside className="d-none d-lg-block">
          <div className="sidebar-sticky">
            <h5 className="sidebar-title">Categories</h5>
            <div className="category-nav">
              <Link to="/" className={`nav-link-custom ${!categoryName ? 'active' : ''}`}>
                Collections <i className="bi bi-chevron-right small"></i>
              </Link>
              {["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"].map((cat, index) => (
                <Link
                  key={index}
                  to={`/category/${cat}`}
                  className={`nav-link-custom ${categoryName === cat ? 'active' : ''}`}
                >
                  {cat} <i className="bi bi-chevron-right small"></i>
                </Link>
              ))}
            </div>

            <div className="mt-5 p-4 bg-black text-white rounded-0 shadow-lg mini-banner" style={{ border: '1px solid #333' }}>
              <h6 className="fw-bold mb-3 text-white" style={{ fontSize: '18px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Nexus Pro</h6>
              <p className="small text-white mb-4" style={{ lineHeight: '1.6' }}>Get early access to exclusive tech drops and 15% off your first purchase.</p>
              <Link to="/signup" className="btn btn-light btn-sm w-100 fw-bold rounded-0 py-2 text-uppercase" style={{ letterSpacing: '0.1em', fontSize: '12px' }}>Upgrade Now</Link>
            </div>
          </div>
        </aside>

        <main id="products">
          {user?.role === 'ADMIN' && (
            <div className="admin-quick-stats mb-5 p-4 rounded-4 border bg-white shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Management Console</h5>
                <Link to="/add_product" className="btn btn-dark btn-sm rounded-pill px-3">+ Add Item</Link>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="text-muted smaller fw-bold mb-1">REVENUE</div>
                    <div className="h4 mb-0 fw-bold">₹{Number(stats.totalSales).toLocaleString()}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="text-muted smaller fw-bold mb-1">INVENTORY</div>
                    <div className="h4 mb-0 fw-bold">{stats.totalProducts} Items</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="text-muted smaller fw-bold mb-1">STATUS</div>
                    <div className="h4 mb-0 fw-bold text-success">Active</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid-header">
            <div>
              <div className="text-muted small fw-bold mb-1">EXPLORE</div>
              <h2 className="grid-title">
                {keyword ? `Results for "${keyword}"` : categoryName ? `${categoryName}` : 'All Products'}
              </h2>
            </div>
            <div className="d-flex gap-2">
              <select className="form-select border-0 bg-light rounded-pill px-3 shadow-none small fw-bold" style={{ width: '150px', fontSize: '12px' }}>
                <option>Sort: Popular</option>
                <option>Price: Low to High</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          <div className="startup-grid">
            {products.length === 0 ? (
              <div className="text-center py-5 w-100">
                <img src={unplugged} alt="Empty" style={{ width: '80px', opacity: 0.2 }} />
                <p className="mt-3 text-muted">No items found.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="product-entity">
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <div className="product-frame">
                      <img
                        src={`${API_BASE_URL}/product/${product.id}/image`}
                        alt={product.name}
                        className="product-image-main"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = unplugged;
                        }}
                      />
                      {!product.productAvailable && <span className="position-absolute top-0 start-0 m-3 badge bg-dark opacity-75">Out of Stock</span>}
                      {product.price < 5000 && <span className="position-absolute top-0 end-0 m-3 badge bg-white text-dark shadow-sm">Deal</span>}

                      <div className="action-overlay">
                        {user?.role === 'ADMIN' ? (
                          <div className="d-flex gap-2">
                            <Link to={`/product/update/${product.id}`} className="btn btn-white btn-sm rounded-circle shadow p-2"><i className="bi bi-pencil"></i></Link>
                            <button onClick={(e) => { e.preventDefault(); deleteProduct(product.id); }} className="btn btn-white btn-sm rounded-circle shadow p-2 text-danger"><i className="bi bi-trash"></i></button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-dark btn-sm rounded-circle shadow p-2"
                            disabled={!product.productAvailable}
                            onClick={(e) => { e.preventDefault(); addToCart(product); }}
                          >
                            <i className="bi bi-plus-lg"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="product-meta">
                    <span className="product-cat-label">{product.brand || product.category}</span>
                    <Link to={`/product/${product.id}`} className="product-name-link">{product.name}</Link>
                    <div className="product-price-tag">₹{product.price.toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {hasMore && (
            <div className="text-center mt-5">
              <button
                onClick={loadMore}
                className="startup-btn-outline"
                style={{ fontSize: '14px', padding: '12px 48px' }}
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
