import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "../axios";
import { Button, Form, Card, Accordion, Alert } from 'react-bootstrap';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useContext(AppContext);
    const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 };

    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [upiId, setUpiId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // 1. Place the order in the database
            const orderData = {
                totalAmount: totalPrice,
                paymentMethod: paymentMethod,
                shippingAddress: "Default Shipping Address", // In a real app, this would be a form field
                items: cartItems.map(item => ({
                    product: { id: item.id },
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await axios.post("/orders/place", orderData);

            // 2. Update stock quantities
            for (const item of cartItems) {
                const { imageUrl, imageName, imageData, imageType, quantity, reviews, ...rest } = item;
                const updatedStockQuantity = item.stockQuantity - item.quantity;
                const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };

                const formData = new FormData();
                formData.append(
                    "product",
                    new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
                );

                await axios.put(`/product/${item.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            clearCart();
            alert("Payment Successful! Your order has been recorded.");
            navigate("/");
        } catch (error) {
            console.error("Error during payment", error);
            alert("Payment failed. Please check if you are logged in.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container py-5 mt-5 text-center">
                <h3>No items to pay for.</h3>
                <Button className="btn btn-primary px-4 py-2" onClick={() => navigate("/")}>Go Home</Button>
            </div>
        );
    }

    return (
        <div className="payment-page bg-light min-vh-100 py-5 mt-5">
            <div className="container">
                <div className="row g-4 justify-content-center">
                    <div className="col-lg-8">
                        <Card className="border-0 shadow-sm p-4 mb-4">
                            <h2 className="fw-bold mb-4 border-bottom pb-3">Select a payment method</h2>

                            <Accordion defaultActiveKey="0" className="payment-options">
                                <Card className="mb-3 border rounded-3 overflow-hidden shadow-sm">
                                    <Accordion.Item eventKey="0" className="border-0">
                                        <Accordion.Header className="bg-white px-2">
                                            <div className="d-flex align-items-center w-100">
                                                <Form.Check
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="upi-radio"
                                                    checked={paymentMethod === "upi"}
                                                    onChange={() => setPaymentMethod("upi")}
                                                    className="me-3 mb-0 fs-5 custom-radio"
                                                />
                                                <label htmlFor="upi-radio" className="fw-bold mb-0 flex-grow-1 cursor-pointer">UPI (Google Pay, PhonePe, Paytm, BHIM)</label>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body className="bg-white pt-1">
                                            <p className="small text-muted mb-2 ps-1">Choose an app</p>
                                            <div className="d-flex gap-2 mb-4 ps-1">
                                                {['Google_Pay', 'PhonePe', 'Paytm'].map((app) => (
                                                    <div
                                                        key={app}
                                                        className={`upi-app p-2 border rounded-3 text-center d-flex align-items-center justify-content-center transition-all ${upiId.includes(app.toLowerCase()) ? 'border-dark bg-light' : ''}`}
                                                        style={{ width: '90px', height: '45px', cursor: 'pointer' }}
                                                        onClick={() => setUpiId(prev => prev || `${app.toLowerCase()}@upi`)}
                                                    >
                                                        <img
                                                            src={app === 'Google_Pay' ? "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" :
                                                                app === 'PhonePe' ? "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" :
                                                                    "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg"}
                                                            alt={app}
                                                            style={{ maxWidth: '100%', maxHeight: '20px' }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <Form.Group className="mb-2 ps-1">
                                                <Form.Label className="small fw-bold mb-1">Enter UPI ID</Form.Label>
                                                <div className="d-flex gap-2">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="username@bankid"
                                                        value={upiId}
                                                        onChange={(e) => setUpiId(e.target.value)}
                                                        className="rounded-3 shadow-none border-secondary-subtle"
                                                        style={{ maxWidth: '280px' }}
                                                    />
                                                    <Button variant="outline-dark" size="sm" className="px-3 rounded-pill fw-bold">Verify</Button>
                                                </div>
                                            </Form.Group>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Card>

                                <Card className="mb-3 border rounded-3 overflow-hidden shadow-sm">
                                    <Accordion.Item eventKey="1" className="border-0">
                                        <Accordion.Header className="bg-white px-2">
                                            <div className="d-flex align-items-center w-100">
                                                <Form.Check
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="card-radio"
                                                    checked={paymentMethod === "card"}
                                                    onChange={() => setPaymentMethod("card")}
                                                    className="me-3 mb-0 fs-5 custom-radio"
                                                />
                                                <label htmlFor="card-radio" className="fw-bold mb-0 flex-grow-1 cursor-pointer">Credit or Debit Card</label>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body className="bg-white pt-1">
                                            <div className="d-flex gap-3 mb-3 ps-1 align-items-center">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '18px' }} />
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '24px' }} />
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" style={{ height: '16px' }} />
                                            </div>
                                            <Button variant="outline-dark" size="sm" className="rounded-3 fw-bold ps-1">Enter card details</Button>
                                            <p className="smaller text-muted mt-2 ps-1">NexusKart accepts all major credit and debit cards.</p>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Card>

                                <Card className="mb-3 border rounded-3 overflow-hidden shadow-sm">
                                    <Accordion.Item eventKey="2" className="border-0">
                                        <Accordion.Header className="bg-white px-2">
                                            <div className="d-flex align-items-center w-100">
                                                <Form.Check
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="netbanking-radio"
                                                    checked={paymentMethod === "netbanking"}
                                                    onChange={() => setPaymentMethod("netbanking")}
                                                    className="me-3 mb-0 fs-5 custom-radio"
                                                />
                                                <label htmlFor="netbanking-radio" className="fw-bold mb-0 flex-grow-1 cursor-pointer">Net Banking</label>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body className="bg-white pt-1 ps-4 ms-2">
                                            <Form.Select className="w-75 rounded-3 shadow-none border-secondary-subtle" defaultValue="Choose an Option">
                                                <option disabled>Choose a Bank Account</option>
                                                <option>HDFC Bank</option>
                                                <option>ICICI Bank</option>
                                                <option>State Bank of India</option>
                                                <option>Axis Bank</option>
                                                <option>Kotak Mahindra Bank</option>
                                            </Form.Select>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Card>

                                <Card className="mb-3 border rounded-3 overflow-hidden opacity-75">
                                    <Accordion.Header className="bg-white px-2">
                                        <div className="d-flex align-items-center w-100 py-2">
                                            <Form.Check
                                                type="radio"
                                                name="paymentMethod"
                                                disabled
                                                className="me-3 mb-0 fs-5"
                                            />
                                            <span className="fw-bold text-muted">EMI (Unavailable)</span>
                                        </div>
                                    </Accordion.Header>
                                </Card>

                                <Card className="border rounded-3 overflow-hidden shadow-sm">
                                    <Accordion.Header className="bg-white px-2">
                                        <div className="d-flex align-items-center w-100 py-2">
                                            <Form.Check
                                                type="radio"
                                                name="paymentMethod"
                                                id="cod-radio"
                                                checked={paymentMethod === "cod"}
                                                onChange={() => setPaymentMethod("cod")}
                                                className="me-3 mb-0 fs-5 custom-radio"
                                            />
                                            <label htmlFor="cod-radio" className="fw-bold mb-0 flex-grow-1 cursor-pointer">Cash on Delivery / Pay on Delivery</label>
                                        </div>
                                    </Accordion.Header>
                                </Card>
                            </Accordion>
                        </Card>
                    </div>

                    <div className="col-lg-4">
                        <Card className="border-0 shadow-sm p-4 sticky-top" style={{ top: '100px', borderRadius: '12px' }}>
                            <Button
                                className="btn btn-primary w-100 fw-bold py-3 mb-3 shadow-sm rounded-3"
                                onClick={handlePayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Processing..." : "Use this payment method"}
                            </Button>
                            <p className="smaller text-center text-muted mb-4 px-2" style={{ lineHeight: '1.4' }}>Choose a payment method to continue checking out. You'll still have a chance to review and edit your order before it's final.</p>

                            <hr className="opacity-10 mb-4" />

                            <h5 className="fw-bold mb-3 px-1">Order Summary</h5>
                            <div className="px-1 d-flex flex-column gap-2 mb-4">
                                <div className="d-flex justify-content-between small">
                                    <span className="text-muted">Items:</span>
                                    <span className="fw-medium">₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between small">
                                    <span className="text-muted">Delivery:</span>
                                    <span className="text-success fw-bold">FREE</span>
                                </div>
                                <div className="d-flex justify-content-between small pt-2 border-top">
                                    <h5 className="fw-bold text-dark mb-0">Total:</h5>
                                    <h5 className="fw-bold text-dark mb-0">₹{totalPrice.toLocaleString()}</h5>
                                </div>
                            </div>

                            <Alert className="py-2 px-3 mb-0 border rounded-3 d-flex align-items-center gap-2 bg-light text-dark" style={{ fontSize: '12px' }}>
                                <i className="bi bi-lock-fill"></i>
                                <span>Secure Payment. Your data is encrypted.</span>
                            </Alert>
                        </Card>
                    </div>
                </div>
            </div>

            <style>{`
                .payment-page {
                    color: #0f1111;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .cursor-pointer { cursor: pointer; }
                .payment-options .accordion-button {
                    padding: 1rem;
                    box-shadow: none !important;
                }
                .payment-options .accordion-button:not(.collapsed) {
                    background-color: #f8f9fa;
                    color: #0f1111;
                }
                .payment-options .accordion-button::after {
                    display: none;
                }
                .smaller {
                    font-size: 11.5px;
                }
                .upi-app {
                    transition: all 0.2s ease;
                }
                .upi-app:hover {
                    border-color: var(--accent-color) !important;
                    background-color: #f8f9fa;
                    transform: translateY(-1px);
                }
                .custom-radio .form-check-input:checked {
                    background-color: var(--accent-color);
                    border-color: var(--accent-color);
                }
                .custom-radio .form-check-input:focus {
                    box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.1);
                    border-color: var(--accent-color);
                }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </div>
    );
};

export default Payment;
