import React, { useEffect, useState, useContext } from "react";
import AppContext from "../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";

const Navbar = () => {
  const { cart, user, logout } = useContext(AppContext);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // React-controlled dropdown states
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("/products");
      // Populate results initially for suggestions
      setSearchResults(response.data.content || response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // Close dropdowns on global click
    const closeDropdowns = () => {
      setShowCatDropdown(false);
      setShowUserDropdown(false);
    };
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(`/products/search?keyword=${value}`);
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/?search=${input.trim()}`);
      setShowSearchResults(false);
    }
  };

  const categories = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{
      zIndex: 1050,
      height: 'var(--header-height)',
      backgroundColor: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div className="container-fluid px-4 px-lg-5">
        <div className="d-flex align-items-center w-100 position-relative">

          <Link className="navbar-brand fw-bold me-2 me-lg-4 d-flex align-items-center" to="/" style={{ color: 'var(--text-primary)', fontSize: '1.4rem', letterSpacing: '-0.03em' }}>
            Nexus<span style={{ color: 'var(--accent-color)' }}>Kart</span>
          </Link>

          <div className="dropdown d-none d-lg-block me-3" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn d-flex align-items-center gap-2 border-0 bg-white shadow-sm rounded-pill px-3 fw-bold"
              style={{ fontSize: '12px', color: 'var(--text-primary)', height: '44px', border: '1px solid var(--border-color)' }}
              type="button"
              onClick={() => setShowCatDropdown(!showCatDropdown)}
            >
              Categories
              <i className="bi bi-chevron-down" style={{ fontSize: '10px' }}></i>
            </button>
            <ul className={`dropdown-menu shadow-lg border-0 mt-2 p-2 ${showCatDropdown ? 'show' : ''}`} style={{ borderRadius: '16px', minWidth: '200px', display: showCatDropdown ? 'block' : 'none', backgroundColor: '#ffffff' }}>
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    className="dropdown-item rounded-3 py-2 px-3 small mb-1 fw-medium"
                    to={`/category/${category}`}
                    onClick={() => setShowCatDropdown(false)}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-grow-1 mx-2 mx-lg-4">
            <form className="position-relative" onSubmit={handleSearchSubmit}>
              <div className="input-group bg-white shadow-sm rounded-pill px-3" style={{ border: '1px solid var(--border-color)', height: '44px' }}>
                <span className="input-group-text bg-transparent border-0 pe-2 d-flex align-items-center">
                  <i className="bi bi-search text-muted" style={{ fontSize: '14px' }}></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 shadow-none ps-0"
                  placeholder="Search over 10,000+ tech products..."
                  style={{ fontSize: '14px', fontWeight: '500' }}
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setShowSearchResults(input.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
              </div>

              {showSearchResults && (
                <div className="position-absolute w-100 mt-2 shadow-lg bg-white overflow-hidden border-0" style={{ zIndex: 1100, borderRadius: '18px' }}>
                  {noResults ? (
                    <div className="p-4 text-center text-muted small">No items found for "{input}"</div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {searchResults.slice(0, 6).map((result) => (
                        <Link
                          key={result.id}
                          to={`/product/${result.id}`}
                          className="list-group-item list-group-item-action border-0 py-3 px-4 d-flex align-items-center gap-3 transition-all"
                          onClick={() => setShowSearchResults(false)}
                        >
                          <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center">
                            <i className="bi bi-lightning-fill text-dark" style={{ fontSize: '12px' }}></i>
                          </div>
                          <span className="small fw-semibold text-dark">{result.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="d-flex align-items-center gap-3 gap-lg-4 ms-2 flex-shrink-0">
            {user ? (
              <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn d-flex align-items-center gap-2 p-0 border-0"
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '38px', height: '38px', fontSize: '14px' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-start d-none d-md-block">
                    <div className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>MY PROFILE</div>
                    <div className="fw-bold text-dark" style={{ fontSize: '14px', lineHeight: '1.2' }}>{user.name?.split(' ')[0] || 'User'}</div>
                  </div>
                </button>
                <ul className={`dropdown-menu shadow-lg border-0 mt-3 p-2 ${showUserDropdown ? 'show' : ''}`} style={{ borderRadius: '16px', minWidth: '220px', display: showUserDropdown ? 'block' : 'none', backgroundColor: '#ffffff', left: '50%', transform: 'translateX(-50%)', right: 'auto' }}>
                  <li className="px-3 py-2 mb-2 d-md-none border-bottom">
                    <p className="mb-0 small fw-bold text-dark">{user.name}</p>
                    <p className="mb-0 smaller text-muted">{user.role}</p>
                  </li>
                  <li><Link className="dropdown-item rounded-3 py-2 px-3 small mb-1 fw-medium" to="/profile" onClick={() => setShowUserDropdown(false)}><i className="bi bi-person me-2 fs-6"></i> Account Details</Link></li>
                  {user.role === 'ADMIN' && (
                    <li><Link className="dropdown-item rounded-3 py-2 px-3 small mb-1 fw-bold" to="/admin" onClick={() => setShowUserDropdown(false)}><i className="bi bi-speedometer2 me-2 fs-6"></i> Admin Dashboard</Link></li>
                  )}
                  <li><Link className="dropdown-item rounded-3 py-2 px-3 small mb-1 fw-medium" to={user.role === 'ADMIN' ? "/admin/orders" : "/orders"} onClick={() => setShowUserDropdown(false)}><i className="bi bi-bag me-2 fs-6"></i> Orders</Link></li>
                  <li><Link className="dropdown-item rounded-3 py-2 px-3 small mb-1 fw-medium" to="/profile" onClick={() => setShowUserDropdown(false)}><i className="bi bi-gear me-2 fs-6"></i> Settings</Link></li>
                  <li><hr className="dropdown-divider opacity-10 mx-2 my-2" /></li>
                  <li>
                    <button className="dropdown-item rounded-3 py-2 px-3 small text-danger fw-bold d-flex align-items-center gap-2" onClick={() => { logout(); setShowUserDropdown(false); }}>
                      <i className="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                style={{
                  fontSize: '14px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: '1px solid #000000',
                  padding: '10px 24px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="bi bi-person-fill" style={{ color: '#ffffff' }}></i>
                Sign In
              </Link>
            )}

            {user?.role !== 'ADMIN' && (
              <Link to="/cart" className="text-decoration-none d-flex align-items-center gap-2 px-2 py-1 position-relative group" style={{ color: 'var(--text-primary)' }}>
                <div className="position-relative">
                  <i className="bi bi-cart3 fs-4"></i>
                  {totalItems > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border border-2 border-white" style={{ fontSize: '10px', padding: '0.4em 0.5em', minWidth: '18px', height: '18px' }}>
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="d-none d-md-inline fw-bold small">Cart</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
