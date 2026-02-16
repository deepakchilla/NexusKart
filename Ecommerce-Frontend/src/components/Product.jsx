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
        if (response.data.imageName) {
          fetchImage();
        }
        fetchReviews();
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await axios.get(`/product/${id}/image`, { responseType: "blob" });
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching image:", error);
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
          <img src={imageUrl || "/placeholder-image.png"} alt={product.name} />
        </div>

        {/* Right Column: Details */}
        <div className="product-info-column">
          <nav className="breadcrumb-nav mb-2">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to={`/category/${product.category}`}>{product.category}</Link>
          </nav>

          <h1 className="product-main-title">{product.name}</h1>
          <Link to="/" className="product-brand-link">Visit the {product.brand} Store</Link>

          <div className="product-rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < Math.floor(avgRating) ? '#000000' : '#ddd' }}>★</span>
              ))}
            </div>
            <span className="rating-count">{avgRating} / 5.0</span>
            <span className="text-muted small">| {reviews.length} customer reviews</span>
          </div>

          <div className="product-price-section">
            <div className="product-price-large">
              <span className="currency">₹</span>
              <span className="amount">{product.price.toLocaleString()}</span>
              {product.productAvailable && (
                <span className="delivery-badge ms-3">FREE Delivery</span>
              )}
            </div>
            <p className="text-muted small mt-1">Inclusive of all taxes</p>
          </div>

          {/* Offers Section */}
          <div className="product-offers-container">
            <div className="offer-card shadow-sm">
              <span className="offer-title text-dark"><i className="bi bi-tag-fill me-1"></i> Bank Offer</span>
              <p className="mb-0">Upto ₹1,500.00 discount on select Credit Cards</p>
            </div>
            <div className="offer-card shadow-sm">
              <span className="offer-title text-dark"><i className="bi bi-percent me-1"></i> No Cost EMI</span>
              <p className="mb-0">Upto ₹2,300.00 EMI interest savings</p>
            </div>
            <div className="offer-card shadow-sm">
              <span className="offer-title text-dark"><i className="bi bi-box-seam me-1"></i> Partner Offers</span>
              <p className="mb-0">Get GST invoice and save up to 28%</p>
            </div>
          </div>

          {/* Service Badges */}
          <div className="service-badges-row">
            <div className="service-badge-item">
              <i className="bi bi-arrow-return-left"></i>
              <span>7 days<br />Replacement</span>
            </div>
            <div className="service-badge-item">
              <i className="bi bi-truck"></i>
              <span>Free<br />Delivery</span>
            </div>
            <div className="service-badge-item">
              <i className="bi bi-patch-check"></i>
              <span>1 Year<br />Warranty</span>
            </div>
            <div className="service-badge-item">
              <i className="bi bi-shield-check"></i>
              <span>Top<br />Brand</span>
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

          <div className="product-actions-card bg-white shadow-sm mt-4">
            <div className={`stock-status ${product.productAvailable ? 'in-stock' : 'out-of-stock'}`}>
              {product.productAvailable ? 'In Stock' : 'Currently Unavailable'}
            </div>

            <p className="small mb-3">
              Ships from <b>NexusKart Store</b><br />
              Sold by <b>NexusKart Solutions</b>
            </p>

            {user?.role !== 'ADMIN' ? (
              <>
                {product.productAvailable && (
                  <div className="quantity-selector-row">
                    <span className="small fw-bold">Quantity:</span>
                    <select
                      className="qty-dropdown"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button
                    className="add-to-cart-btn py-2"
                    disabled={!product.productAvailable}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="buy-now-btn py-2"
                    disabled={!product.productAvailable}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>
              </>
            ) : (
              <div className="p-3 rounded-3 border text-center mb-3" style={{ backgroundColor: '#f9f9fb', borderColor: '#e4e4e7' }}>
                <i className="bi bi-shield-lock-fill d-block fs-4 mb-2 text-dark"></i>
                <div className="fw-bold small text-dark">Administrative View</div>
                <div className="smaller text-muted">Shopping disabled for management</div>
              </div>
            )}

            {user?.role === 'ADMIN' && (
              <div className="admin-actions-section mt-3 pt-3 border-top">
                <div className="d-grid gap-2">
                  <Link to={`/product/update/${id}`} className="btn btn-outline-dark btn-sm py-2 fw-bold">
                    <i className="bi bi-pencil-square me-2"></i>Edit Product Details
                  </Link>
                  <button onClick={deleteProduct} className="btn btn-outline-danger btn-sm py-2 fw-bold">
                    <i className="bi bi-trash-fill me-2"></i>Delete This Product
                  </button>
                </div>
              </div>
            )}

            <div className="mt-3 d-flex align-items-center gap-2 small">
              <i className="bi bi-lock-fill text-muted"></i>
              <span className="text-muted">Secure transaction</span>
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
              <div className="global-rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < Math.floor(avgRating) ? '#000000' : '#ddd' }}>★</span>
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
                        <label htmlFor={`star${num}`}>★</label>
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
                    <div className="review-rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < review.rating ? '#000000' : '#ddd' }}>★</span>
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