import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await axios.get("/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const response = await axios.get(
                `/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const imageFile = await converUrlToFile(response.data, response.data.imageName);
              setCartImage(imageFile)
              const imageUrl = URL.createObjectURL(response.data);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
        // Fallback: show cart items even if fresh image fetch fails
        setCartItems(cart.map(item => ({ ...item, imageUrl: item.imageUrl || "placeholder-image-url" })));
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;
        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };

        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        await axios.put(`/product/${item.id}`, cartProduct, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error during checkout", error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 mt-5">
        <div className="card border-0 shadow-sm p-5 text-center bg-white" style={{ borderRadius: '12px' }}>
          <div className="mb-4">
            <i className="bi bi-cart-x text-muted" style={{ fontSize: '5rem' }}></i>
          </div>
          <h2 className="fw-bold mb-3">Your Cart is empty</h2>
          <p className="text-muted mb-4">You have no items in your shopping cart. Start adding some tech!</p>
          <Link to="/" className="btn btn-primary px-5 py-2 fw-bold">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-premium bg-light py-5 min-vh-100 mt-5">
      <div className="container">
        <div className="row g-4">
          {/* Left Column: Cart Items */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm bg-white p-4" style={{ borderRadius: '8px' }}>
              <div className="d-flex justify-content-between align-items-end border-bottom pb-3 mb-4">
                <h2 className="fw-bold mb-0">Shopping Cart</h2>
                <span className="text-muted small">Price</span>
              </div>

              <div className="cart-items-list d-flex flex-column gap-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row d-flex py-3 border-bottom border-light">
                    {/* Image Section */}
                    <div className="cart-item-img-container me-4" style={{ width: '180px', flexShrink: 0 }}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ width: '100%', height: '180px', objectFit: 'contain' }}
                      />
                    </div>

                    {/* Info Section */}
                    <div className="cart-item-info flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5 className="fw-bold mb-1">{item.name}</h5>
                          <p className="text-muted small mb-2">by <span className="fw-bold text-dark">{item.brand}</span></p>
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="badge bg-success-subtle text-success small">In Stock</span>
                            <span className="text-muted small">Eligible for FREE Shipping</span>
                          </div>
                        </div>
                        <div className="text-end">
                          <h4 className="fw-bold mb-0">₹{item.price.toLocaleString()}</h4>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="d-flex align-items-center gap-4 mt-3 mt-md-4">
                        <div className="quantity-control d-flex align-items-center bg-light rounded px-2" style={{ border: '1px solid #ddd' }}>
                          <button
                            className="btn btn-sm btn-link text-decoration-none text-dark py-1 px-2 border-0"
                            onClick={() => handleDecreaseQuantity(item.id)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="px-3 fw-bold small" style={{ minWidth: '40px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            className="btn btn-sm btn-link text-decoration-none text-dark py-1 px-2 border-0"
                            onClick={() => handleIncreaseQuantity(item.id)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                        <div className="divider" style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }}></div>
                        <button
                          className="btn btn-sm btn-link text-danger text-decoration-none small p-0 fw-medium"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-end pt-4">
                <h4 className="fw-normal">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items): <span className="fw-bold">₹{totalPrice.toLocaleString()}</span></h4>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm bg-white p-4 sticky-top" style={{ borderRadius: '8px', top: '20px' }}>
              <div className="mb-3 d-flex align-items-start gap-2 text-success">
                <i className="bi bi-check-circle-fill mt-1"></i>
                <div className="small">Your order is eligible for FREE Delivery. Select this option at checkout.</div>
              </div>

              <h4 className="fw-normal mb-4">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items): <span className="fw-bold">₹{totalPrice.toLocaleString()}</span></h4>

              <div className="form-check mb-4 small">
                <input className="form-check-input mt-1" type="checkbox" id="giftOption" />
                <label className="form-check-label" htmlFor="giftOption">
                  This order contains a gift
                </label>
              </div>

              <Button
                className="btn btn-primary w-100 py-3 fw-bold border-0 mb-3 shadow-sm rounded-pill"
                onClick={() => setShowModal(true)}
              >
                Proceed to Buy
              </Button>

              <div className="accordion accordion-flush" id="emiOptions">
                <div className="accordion-item bg-transparent">
                  <div id="emiInfo" className="accordion-collapse collapse" data-bs-parent="#emiOptions">
                    <div className="accordion-body p-2 smaller text-muted">
                      No Cost EMI available on select cards. Checkout to see eligibility.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />

      <style>{`
                .cart-page-premium {
                    color: #0f1111;
                }
                .hover-brightness:hover {
                    filter: brightness(0.95);
                }
                .smaller {
                    font-size: 11px;
                }
                @media (max-width: 991px) {
                    .cart-item-img-container {
                        width: 120px !important;
                    }
                    .cart-item-row {
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .cart-item-img-container {
                        margin: 0 auto !important;
                    }
                }
            `}</style>
    </div>
  );
};

export default Cart;
