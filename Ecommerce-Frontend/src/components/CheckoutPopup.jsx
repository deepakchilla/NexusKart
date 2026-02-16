import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice }) => {
  const navigate = useNavigate();

  const handleProceedToPayment = () => {
    handleClose();
    navigate('/payment', {
      state: {
        cartItems: cartItems,
        totalPrice: totalPrice
      }
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Confirm Your Order</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        <div className="checkout-items d-flex flex-column gap-3">
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item d-flex align-items-center gap-3 p-2 rounded bg-light border border-light-subtle">
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: '60px', height: '60px', objectFit: 'contain', backgroundColor: 'white', padding: '4px', borderRadius: '4px' }}
              />
              <div className="flex-grow-1">
                <h6 className="mb-0 fw-bold small text-truncate" style={{ maxWidth: '200px' }}>{item.name}</h6>
                <p className="mb-0 text-muted smaller">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
              </div>
              <div className="text-end fw-bold small">
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}

          <div className="border-top pt-3 mt-2 d-flex justify-content-between align-items-center px-2">
            <span className="fw-bold">Order Total:</span>
            <h4 className="fw-bold mb-0 text-primary">₹{totalPrice.toLocaleString()}</h4>
          </div>

          <div className="alert alert-info py-2 px-3 mt-2 mb-0" style={{ fontSize: '12px', border: 'none', backgroundColor: '#f0f8ff' }}>
            <i className="bi bi-info-circle me-2"></i>
            By confirming, you agree to NexusKart's Terms of Service.
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="link" className="text-decoration-none text-muted fw-medium" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          className="px-4 fw-bold border-0 shadow-sm"
          style={{ backgroundColor: 'var(--accent-color)', color: '#ffffff' }}
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutPopup;
