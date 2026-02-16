import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "../axios";
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

      const productsWithImages = await Promise.all(
        newProducts.map(async (product) => {
          try {
            const imgRes = await axios.get(`/product/${product.id}/image`, { responseType: "blob" });
            return { ...product, imageUrl: URL.createObjectURL(imgRes.data) };
          } catch {
            return { ...product, imageUrl: unplugged };
          }
        })
      );

      if (pageNum === 0) {
        setProducts(productsWithImages);
      } else {
        setProducts(prev => [...prev, ...productsWithImages]);
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
      {user?.role === 'ADMIN' && (
        <div className="admin-stats-container py-5 px-4 bg-white border-bottom">
          <div className="container-fluid max-width-xl">
            <div className="row g-4">
              <div className="col-md-3">
                <div className="stat-card p-4 rounded-4 border bg-light shadow-sm transition-all">
                  <div className="small text-muted mb-1 text-uppercase fw-bold">Active Inventory</div>
                  <div className="h2 fw-bold mb-0 text-dark">{stats.totalProducts} Items</div>
                  <div className="badge bg-dark mt-2 border border-white">Operational</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card p-4 rounded-4 border bg-light shadow-sm transition-all">
                  <div className="small text-muted mb-1 text-uppercase fw-bold">Stock Status</div>
                  <div className="h2 fw-bold mb-0 text-dark" style={{ color: stats.lowStockCount > 0 ? '#dc3545' : 'inherit' }}>{stats.stockStatus}</div>
                  <div className="badge bg-dark mt-2">Live Update</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card p-4 rounded-4 border bg-light shadow-sm transition-all">
                  <div className="small text-muted mb-1 text-uppercase fw-bold">Sales Volume</div>
                  <div className="h2 fw-bold mb-0 text-dark">₹{Number(stats.totalSales).toLocaleString()}</div>
                  <div className="badge bg-dark mt-2 border border-white">Real-time</div>
                </div>
              </div>
              <div className="col-md-3">
                <Link to="/add_product" className="stat-card p-4 rounded-4 border bg-dark text-white shadow-lg d-flex flex-column justify-content-center align-items-center text-decoration-none transition-all h-100">
                  <i className="bi bi-plus-circle fs-1 mb-2 text-white"></i>
                  <div className="fw-bold">New Product</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="amazon-main-container">
        <div className="category-sidebar">
          <h5 className="fw-bold mb-3">Shop by Category</h5>
          <ul className="category-list">
            {["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"].map((cat, index) => (
              <li key={index}>
                <Link to={`/category/${cat}`} className={`category-link ${categoryName === cat ? 'fw-bold' : ''} text-decoration-none d-block`} style={categoryName === cat ? { backgroundColor: 'var(--accent-color)', color: '#fff' } : {}}>
                  {cat}
                </Link>
              </li>
            ))}
            <li><Link to="/" className="category-link see-all fw-bold">All Categories</Link></li>
          </ul>
        </div>

        <div className="product-area">
          <div id="products" className="product-section">
            <div className="section-header border-bottom pb-3 mb-4">
              <h2 className="fw-bold">{keyword ? 'Search Management' : categoryName ? `${categoryName} Catalog` : 'Warehouse Catalog'}</h2>
              <p className="text-muted small mb-0">Total of {products.length} entries found</p>
            </div>

            <div className="amazon-product-grid">
              {products.length === 0 ? (
                <div className="no-products text-center w-100 py-5">
                  <img src={unplugged} alt="No Products" style={{ width: '100px', opacity: 0.3 }} />
                  <p className="mt-3 text-muted">No products found.</p>
                </div>
              ) : (
                products.map((product) => {
                  const { id, name, price, productAvailable, imageUrl, category, reviews } = product;
                  const { stars, count } = calculateRating(reviews);
                  return (
                    <div key={id} className="amazon-product-card">
                      <Link to={`/product/${id}`} className="text-decoration-none">
                        <div className="product-image-container position-relative">
                          <img src={imageUrl || unplugged} alt={name} className="product-image" />
                          {productAvailable && price < 1000 && <span className="deal-badge">Deal</span>}
                        </div>
                      </Link>



                      <Link to={`/product/${id}`} className="text-decoration-none text-dark">
                        <div className="product-details">
                          <span className="product-category text-muted small">{category}</span>
                          <h4 className="product-title fw-bold mb-1">{name}</h4>
                          <div className="product-rating">
                            <span className="stars">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: i < Math.floor(stars) ? '#000000' : '#ddd' }}>★</span>
                              ))}
                            </span>
                            <span className="rating-count ms-1 text-muted">({count > 0 ? count : "0"})</span>
                          </div>
                          <div className="product-price-row mt-2">
                            <span className="currency fw-bold">₹</span>
                            <span className="price fw-bold fs-5">{price.toLocaleString()}</span>
                          </div>
                          <span className="delivery text-dark fw-bold smaller">FREE delivery</span>
                        </div>
                      </Link>

                      <div className="admin-actions mt-auto d-flex gap-2">
                        <Link
                          to={`/product/update/${id}`}
                          className="btn btn-dark flex-grow-1 rounded-pill py-2 small fw-bold"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                          style={{ width: '40px', height: '40px' }}
                          onClick={(e) => {
                            e.preventDefault();
                            deleteProduct(id);
                          }}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {hasMore && (
              <div className="text-center mt-4">
                <button onClick={loadMore} className="btn btn-outline-dark px-5 py-2 fw-bold rounded-pill">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
