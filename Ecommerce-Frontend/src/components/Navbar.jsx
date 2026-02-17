import React, { useEffect, useState, useContext } from "react";
import AppContext from "../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import axios, { API_BASE_URL } from "../axios";

const Navbar = () => {
  const { cart, user, logout } = useContext(AppContext);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Mobile states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("/products");
      setSearchResults(response.data.content || response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const closeDropdowns = () => {
      setShowUserDropdown(false);
    };
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  useEffect(() => {
    if (input.length >= 1) {
      setIsSearching(true);
      setShowSearchResults(true);
      const delayDebounceFn = setTimeout(async () => {
        try {
          const response = await axios.get(`/products?keyword=${input}&page=0&size=5`);
          setSearchResults(response.data.content || []);
          setNoResults((response.data.content || []).length === 0);
        } catch (error) {
          console.error("Error searching:", error);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
      setIsSearching(false);
    }
  }, [input]);

  const handleChange = (value) => {
    setInput(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/?search=${input.trim()}`);
      setShowSearchResults(false);
      setShowMobileSearch(false);
    }
  };

  const categories = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top" style={{
        zIndex: 1050,
        height: 'var(--header-height)',
        backgroundColor: 'var(--navbar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div className="container-fluid px-3 px-lg-5">
          <div className="d-flex align-items-center justify-content-between w-100">

            {/* Left: Mobile Toggle & Brand */}
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn d-lg-none border-0 p-0 me-2"
                onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
              >
                <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-3`}></i>
              </button>
              <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{ color: 'var(--text-primary)', fontSize: '1.5rem', letterSpacing: '-0.06em' }}>
                NEXUS<span style={{ fontWeight: '400', letterSpacing: '0' }}>KART</span>
              </Link>
            </div>

            {/* Center: Desktop Search */}
            <div className="flex-grow-1 mx-lg-5 d-none d-lg-block" style={{ maxWidth: '600px' }}>
              <form className="position-relative" onSubmit={handleSearchSubmit}>
                <div className="input-group bg-light rounded-pill px-3 border-0" style={{ height: '48px' }}>
                  <span className="input-group-text bg-transparent border-0 pe-2 d-flex align-items-center">
                    <i className="bi bi-search text-muted" style={{ fontSize: '14px' }}></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 shadow-none ps-0 fw-medium"
                    placeholder="Search curated gadgets..."
                    style={{ fontSize: '14px' }}
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={() => setShowSearchResults(input.length > 0)}
                  />
                </div>

                {showSearchResults && input.length >= 1 && (
                  <div className="search-suggestions-container shadow-sm">
                    {isSearching ? (
                      <div className="p-3 text-center">
                        <div className="spinner-border spinner-border-sm text-muted opacity-50" role="status"></div>
                      </div>
                    ) : noResults ? (
                      <div className="p-3 text-muted small">No results found for "{input}"</div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            to={`/product/${result.id}`}
                            className="list-group-item list-group-item-action border-0 d-flex align-items-center py-2 px-3 suggestion-item"
                            onClick={() => setShowSearchResults(false)}
                          >
                            <div className="suggestion-icon">
                              <img
                                src={`${API_BASE_URL}/product/${result.id}/image`}
                                alt=""
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/40?text=P";
                                }}
                              />
                            </div>
                            <div className="suggestion-text">
                              <span className="query-match">{input}</span>
                              <span className="suggestion-remainder">
                                {result.name.toLowerCase().startsWith(input.toLowerCase())
                                  ? result.name.substring(input.length)
                                  : ` in ${result.name}`}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Right: Actions */}
            <div className="d-flex align-items-center gap-3 gap-md-4">
              {/* Mobile Search Toggle */}
              <button
                className="btn d-lg-none border-0 p-0 text-dark"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <i className="bi bi-search fs-5"></i>
              </button>

              {user ? (
                <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn d-flex align-items-center gap-2 gap-md-3 p-0 border-0"
                    type="button"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <div className="text-end d-none d-md-block">
                      <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{user.name?.split(' ')[0] || 'Member'}</div>
                      <div className="text-muted" style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>{user.role}</div>
                    </div>
                    <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', fontSize: '14px', border: '2px solid #fff', boxShadow: '0 0 0 1px #eee' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end shadow-2xl border-0 mt-3 p-2 ${showUserDropdown ? 'show' : ''}`} style={{ borderRadius: '20px', minWidth: '240px', display: showUserDropdown ? 'block' : 'none' }}>
                    <li className="px-3 py-3 mb-2 border-bottom">
                      <div className="fw-bold text-dark">{user.name}</div>
                      <div className="small text-muted">{user.email || 'Verified Member'}</div>
                    </li>
                    <li><Link className="dropdown-item rounded-3 py-2 px-3 small mb-1 fw-bold" to="/profile" onClick={() => setShowUserDropdown(false)}><i className="bi bi-gear me-2"></i> Settings</Link></li>
                    {user.role === 'ADMIN' && (
                      <li><Link className="dropdown-item rounded-3 py-2 px-3 small mb-1 fw-bold text-primary" to="/admin" onClick={() => setShowUserDropdown(false)}><i className="bi bi-cpu me-2"></i> Admin Panel</Link></li>
                    )}
                    <li><Link className="dropdown-item rounded-3 py-2 px-3 small mb-1 fw-bold" to={user.role === 'ADMIN' ? "/admin/orders" : "/orders"} onClick={() => setShowUserDropdown(false)}><i className="bi bi-box-seam me-2"></i> Orders</Link></li>
                    <li><hr className="dropdown-divider opacity-10 mx-2 my-2" /></li>
                    <li>
                      <button className="dropdown-item rounded-3 py-2 px-3 small text-danger fw-bold d-flex align-items-center gap-2" onClick={() => { logout(); setShowUserDropdown(false); }}>
                        <i className="bi bi-power"></i> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="startup-btn-primary py-2 px-3 px-md-4 shadow-none d-none d-sm-block"
                  style={{ fontSize: '13px' }}
                >
                  Sign In
                </Link>
              )}

              {user?.role !== 'ADMIN' && (
                <Link to="/cart" className="text-decoration-none d-flex align-items-center position-relative" style={{ color: 'var(--text-primary)' }}>
                  <i className="bi bi-handbag fs-4"></i>
                  {totalItems > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-dark" style={{ fontSize: '9px', minWidth: '18px', height: '18px', border: '2px solid #fff' }}>
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="position-fixed w-100 bg-white shadow-sm p-3 d-lg-none" style={{ top: 'var(--header-height)', zIndex: 1040, animation: 'slideDownNav 0.3s ease' }}>
          <form className="position-relative" onSubmit={handleSearchSubmit}>
            <div className="input-group bg-light rounded-pill px-3 border-0" style={{ height: '48px' }}>
              <input
                type="text"
                className="form-control bg-transparent border-0 shadow-none fw-medium"
                placeholder="Search..."
                autoFocus
                value={input}
                onChange={(e) => handleChange(e.target.value)}
              />
              <button className="btn bg-transparent border-0" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Menu</h5>
          <button className="btn p-0 border-0" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="bi bi-x-lg fs-4"></i>
          </button>
        </div>
        <div className="drawer-body p-4">
          {!user && (
            <div className="mb-4 d-sm-none">
              <Link to="/login" className="btn btn-dark w-100 rounded-pill py-2 fw-bold" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
            </div>
          )}
          <h6 className="text-uppercase smaller text-muted fw-bold tracking-widest mb-3" style={{ fontSize: '10px' }}>Categories</h6>
          <div className="list-group list-group-flush mb-5">
            <Link to="/" className="list-group-item list-group-item-action border-0 px-0 py-2 fw-bold" onClick={() => setIsMobileMenuOpen(false)}>
              All Collections
            </Link>
            {categories.map((cat, idx) => (
              <Link key={idx} to={`/category/${cat}`} className="list-group-item list-group-item-action border-0 px-0 py-2 fw-medium text-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                {cat}
              </Link>
            ))}
          </div>

          <h6 className="text-uppercase smaller text-muted fw-bold tracking-widest mb-3" style={{ fontSize: '10px' }}>Help & Support</h6>
          <div className="list-group list-group-flush">
            <Link to="#" className="list-group-item list-group-item-action border-0 px-0 py-2 fw-medium text-secondary">Track Orders</Link>
            <Link to="#" className="list-group-item list-group-item-action border-0 px-0 py-2 fw-medium text-secondary">Size Guide</Link>
            <Link to="#" className="list-group-item list-group-item-action border-0 px-0 py-2 fw-medium text-secondary">Contact Us</Link>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="drawer-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <style>{`
        .mobile-drawer {
          position: fixed;
          top: 0;
          left: -320px;
          width: 300px;
          height: 100%;
          background: white;
          z-index: 2000;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 20px 0 50px rgba(0,0,0,0.1);
        }
        .mobile-drawer.open {
          transform: translateX(320px);
        }
        .drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          z-index: 1999;
        }
        @keyframes slideDownNav { 
          from { transform: translateY(-20px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
      `}</style>
    </>
  );
};

export default Navbar;
