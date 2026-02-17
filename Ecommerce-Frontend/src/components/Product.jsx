import { useNavigate, useParams, Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, user } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        fetchReviews();
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/product/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const calculateAvgRating = () => {
    if (reviews.length === 0) return 4.5;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert(`${quantity} unit(s) added to cart!`);
  };

  const handleBuyNow = () => {
    navigate("/payment", {
      state: {
        cartItems: [{ ...product, quantity }],
        totalPrice: product.price * quantity
      }
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to post a review");
      return;
    }
    if (!newReview.comment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      await axios.post(`/product/${id}/reviews`, {
        userName: user.name || user.email,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  const deleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await axios.delete(`/product/${id}`);
        alert("Product deleted successfully");
        navigate("/");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const avgRating = calculateAvgRating();

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Left Column: Image */}
        <div className="product-image-viewer shadow-sm">
          <img
            src={`http://localhost:8085/api/product/${product.id}/image`}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.png";
            }}
          />
        </div>

        {/* Right Column: Details */}
        <div className="product-info-column" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <nav className="breadcrumb-nav mb-3 d-flex align-items-center gap-1" style={{ fontSize: '12px', letterSpacing: '0.02em', textTransform: 'uppercase', fontWeight: '700' }}>
            <Link to="/" className="text-muted text-decoration-none">Home</Link>
            <i className="bi bi-chevron-right text-muted" style={{ fontSize: '10px' }}></i>
            <Link to={`/category/${product.category}`} className="text-dark text-decoration-none">{product.category}</Link>
          </nav>

          <h1 className="product-main-title">{product.name}</h1>
          <div className="mb-4">
            <Link to="/" className="text-muted text-decoration-none small fw-bold" style={{ borderBottom: '1px solid #eee' }}>Visit the {product.brand} Official Store</Link>
          </div>

          <div className="product-rating-row mb-4 d-flex align-items-center gap-3">
            <div className="stars d-flex gap-1">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="bi bi-star-fill" style={{ color: i < Math.floor(avgRating) ? '#000000' : '#e5e5e5', fontSize: '14px' }}></i>
              ))}
            </div>
            <span className="fw-800 small text-dark">{avgRating}</span>
            <span className="text-muted smaller fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>/ {reviews.length} Verified Reviews</span>
          </div>

          <div className="product-price-section">
            <div className="product-price-large">
              <span className="currency">₹</span>
              <span className="amount">{product.price.toLocaleString()}</span>
              {product.productAvailable && (
                <span className="delivery-badge">FREE SHIPPING</span>
              )}
            </div>
          </div>

          {/* Offers Section */}
          <div className="product-offers-container">
            <div className="offer-card">
              <i className="bi bi-tag-fill"></i>
              <div className="offer-content">
                <span className="offer-title">Bank Offer</span>
                <p className="mb-0 small text-muted">Upto ₹1,500.00 discount on select Credit Cards</p>
              </div>
            </div>
            <div className="offer-card">
              <i className="bi bi-percent"></i>
              <div className="offer-content">
                <span className="offer-title">No Cost EMI</span>
                <p className="mb-0 small text-muted">Upto ₹2,300.00 EMI interest savings</p>
              </div>
            </div>
            <div className="offer-card">
              <i className="bi bi-box-seam"></i>
              <div className="offer-content">
                <span className="offer-title">Partner Offers</span>
                <p className="mb-0 small text-muted">Get GST invoice and save up to 28%</p>
              </div>
            </div>
          </div>

          {/* Service Badges */}
          <div className="service-badges-row">
            <div className="service-badge-item">
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>7 Days Return</span>
            </div>
            <div className="service-badge-item">
              <i className="bi bi-truck"></i>
              <span>Free Delivery</span>
            </div>
            <div className="service-badge-item">
              <i className="bi bi-patch-check"></i>
              <span>1 Yr Warranty</span>
            </div>
            <div className="service-badge-item">
              <i className="bi bi-shield-check"></i>
              <span>Nexus Guard</span>
            </div>
          </div>

          <hr className="my-3 opacity-10" />

          <div className="product-description-section">
            <h6 className="product-description-title">About this item</h6>
            <ul className="product-highlights-list">
              <li>Premium build quality and professional finish</li>
              <li>High-performance components for demanding tasks</li>
              <li>Sleek, modern design that fits any aesthetic</li>
              <li>Energy-efficient technology with long-lasting reliability</li>
              <li>Official {product.brand} manufacturer warranty included</li>
            </ul>
            <p className="product-description-text mt-3">{product.description}</p>
          </div>

          {/* Technical Specifications */}
          <div className="product-specs-section mt-4">
            <h6 className="product-description-title">Technical Details</h6>
            <table className="specs-table">
              <tbody>
                <tr>
                  <td className="specs-label">Brand</td>
                  <td>{product.brand}</td>
                </tr>
                <tr>
                  <td className="specs-label">Category</td>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <td className="specs-label">Model Name</td>
                  <td>{product.name.split(' ').slice(0, 2).join(' ')} Elite</td>
                </tr>
                <tr>
                  <td className="specs-label">Availability</td>
                  <td>{product.productAvailable ? 'In Stock' : 'Out of Stock'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="product-actions-card bg-white mt-4">
            <div className={`stock-status ${product.productAvailable ? 'in-stock' : 'out-of-stock'}`}>
              {product.productAvailable ? (
                <><i className="bi bi-check-circle-fill me-2"></i> In Stock and ready to ship</>
              ) : (
                <><i className="bi bi-x-circle-fill me-2"></i> Currently Unavailable</>
              )}
            </div>

            <div className="mb-4 small text-muted">
              <div className="d-flex justify-content-between mb-1">
                <span>Ships from</span>
                <span className="text-dark fw-bold">NexusKart Premiere</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Sold by</span>
                <span className="text-dark fw-bold">NexusKart Official Store</span>
              </div>
            </div>

            {user?.role !== 'ADMIN' ? (
              <>
                {product.productAvailable && (
                  <div className="quantity-selector-row">
                    <span className="small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>Quantity</span>
                    <select
                      className="qty-dropdown"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num >= 10 ? num : `0${num}`}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="d-grid gap-3">
                  <button
                    className="startup-btn-primary w-100 justify-content-center py-3"
                    disabled={!product.productAvailable}
                    onClick={handleAddToCart}
                  >
                    <i className="bi bi-bag-plus me-2"></i> Add to Cart
                  </button>
                  <button
                    className="startup-btn-outline w-100 justify-content-center py-3"
                    disabled={!product.productAvailable}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>
              </>
            ) : (
              <div className="administrative-banner">
                <i className="bi bi-shield-lock d-block fs-3 mb-3 text-dark"></i>
                <div className="fw-800 small text-dark text-uppercase mb-1" style={{ letterSpacing: '0.1em' }}>Administrative View</div>
                <div className="smaller text-muted">Shopping interface disabled for staff</div>
              </div>
            )}

            {user?.role === 'ADMIN' && (
              <div className="admin-actions-section mt-4 pt-4 border-top">
                <div className="d-grid gap-2">
                  <Link to={`/product/update/${id}`} className="startup-btn-outline w-100 justify-content-center btn-sm py-2">
                    <i className="bi bi-pencil-square me-2"></i>Edit Product
                  </Link>
                  <button onClick={deleteProduct} className="btn btn-link text-danger text-decoration-none small fw-bold mt-2">
                    <i className="bi bi-trash3 me-2"></i>Delete Product
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 d-flex align-items-center justify-content-center gap-2 smaller text-muted border-top border-light">
              <i className="bi bi-shield-check"></i>
              <span>Secure checkout enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="customer-reviews-section">
        <h3 className="fw-bold mb-4">Customer Reviews</h3>
        <div className="reviews-grid">
          {/* Left Column: Summary and Submission */}
          <div className="rating-summary-column">
            <div className="rating-summary-card">
              <div className="d-flex align-items-baseline gap-2">
                <span className="big-rating-number">{avgRating}</span>
                <span className="text-muted">out of 5</span>
              </div>
              <div className="global-rating-stars d-flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill" style={{ color: i < Math.floor(avgRating) ? '#000000' : '#e0e0e0', fontSize: '20px' }}></i>
                ))}
              </div>
              <p className="text-muted small mb-4">{reviews.length} global ratings</p>

              {/* Review Form */}
              <div className="review-form-card">
                <h5 className="fw-bold mb-3">Rate this product</h5>
                <form onSubmit={handleSubmitReview}>
                  <div className="star-rating-input mb-3">
                    {[5, 4, 3, 2, 1].map(num => (
                      <React.Fragment key={num}>
                        <input
                          type="radio"
                          id={`star${num}`}
                          name="rating"
                          value={num}
                          checked={newReview.rating === num}
                          onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                        />
                        <label htmlFor={`star${num}`}><i className="bi bi-star-fill"></i></label>
                      </React.Fragment>
                    ))}
                  </div>
                  <textarea
                    className="review-textarea"
                    placeholder="What did you like or dislike? How was the quality?"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  ></textarea>
                  <button type="submit" className="submit-review-btn w-100">
                    Post your review
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Reviews List */}
          <div className="reviews-list-column">
            {reviews.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-chat-left-dots text-muted fs-1 mb-3 d-block"></i>
                <p className="text-muted">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-user-info">
                    <div className="user-avatar text-uppercase">{review.userName?.[0] || 'U'}</div>
                    <span className="review-username">{review.userName || "Verified Customer"}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div className="review-rating-stars d-flex gap-1 me-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill" style={{ color: i < review.rating ? '#000000' : '#e0e0e0', fontSize: '12px' }}></i>
                      ))}
                    </div>
                    <span className="small text-muted">Verified Purchase</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <div className="small text-muted mt-2">
                    Reviewed on {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;