import React, { useState, useEffect, useContext } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";

const AddProduct = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: new Date().toISOString().split('T')[0],
    productAvailable: true,
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    axios
      .post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Product added successfully");
        navigate("/admin");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        const errorMessage = error.response?.data?.message || "Error adding product";
        alert(errorMessage);
      });
  };

  return (
    <div className="add-product-page py-5" style={{ backgroundColor: "#ffffff", minHeight: "calc(100vh - 80px)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-5">
                <button
                  onClick={() => navigate('/admin')}
                  className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '42px', height: '42px', border: '1px solid #e5e5e5' }}
                >
                  <i className="bi bi-arrow-left"></i>
                </button>
                <h1 className="fw-800 mb-0" style={{ letterSpacing: '-0.04em' }}>New Product</h1>
              </div>

              <form onSubmit={submitHandler}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Product Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      placeholder="e.g. MacBook Pro M3"
                      onChange={handleInputChange}
                      value={product.name}
                      name="name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      className="form-control rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      placeholder="e.g. Apple"
                      value={product.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Description</label>
                    <textarea
                      className="form-control rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      placeholder="Describe the technical excellence..."
                      value={product.description}
                      name="description"
                      onChange={handleInputChange}
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Price (INR)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-light-subtle rounded-start-3 fw-bold">₹</span>
                      <input
                        type="number"
                        className="form-control border-light-subtle shadow-none rounded-end-3 py-3"
                        placeholder="0"
                        onChange={handleInputChange}
                        value={product.price}
                        name="price"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Category</label>
                    <select
                      className="form-select rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      value={product.category}
                      onChange={handleInputChange}
                      name="category"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Headphone">Headphone</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Toys">Toys</option>
                      <option value="Fashion">Fashion</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Inventory</label>
                    <input
                      type="number"
                      className="form-control rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      placeholder="Units available"
                      onChange={handleInputChange}
                      value={product.stockQuantity}
                      name="stockQuantity"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Availability Date</label>
                    <input
                      type="date"
                      className="form-control rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      value={product.releaseDate}
                      name="releaseDate"
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Product Visualization</label>
                    <div className="d-flex flex-column align-items-center p-5 border-2 border-dashed rounded-4 text-center transition-all position-relative" style={{ borderColor: '#e5e5e5', backgroundColor: '#fafafa' }}>
                      {previewUrl ? (
                        <div className="preview-container w-100 position-relative">
                          <img src={previewUrl} alt="Preview" style={{ maxHeight: '240px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                          <button
                            type="button"
                            className="btn btn-dark rounded-circle position-absolute top-0 end-0 m-2 shadow-sm d-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => { setImage(null); setPreviewUrl(null); }}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="upload-placeholder py-4">
                          <i className="bi bi-upload d-block fs-1 mb-3 text-dark"></i>
                          <p className="mb-1 fw-bold text-dark">Drop product image here</p>
                          <p className="smaller text-muted">Click to browse your files (PNG, JPG, WEBP)</p>
                        </div>
                      )}
                      <input
                        className="form-control position-absolute inset-0 opacity-0 cursor-pointer w-100 h-100"
                        type="file"
                        onChange={handleImageChange}
                        required={!image}
                        style={{ top: 0, left: 0 }}
                      />
                    </div>
                  </div>

                  <div className="col-12 mt-4">
                    <div className="form-check form-switch p-1 d-flex align-items-center gap-3">
                      <input
                        className="form-check-input mt-0 ms-0 shadow-none"
                        type="checkbox"
                        role="switch"
                        id="availabilitySwitch"
                        checked={product.productAvailable}
                        onChange={(e) =>
                          setProduct({ ...product, productAvailable: e.target.checked })
                        }
                        style={{ width: '48px', height: '24px' }}
                      />
                      <label className="form-check-label fw-bold text-dark" htmlFor="availabilitySwitch">
                        Available for public viewing
                      </label>
                    </div>
                  </div>

                  <div className="col-12 mt-5">
                    <div className="d-flex gap-3">
                      <button
                        type="submit"
                        className="startup-btn-primary flex-grow-1 justify-content-center py-3"
                      >
                        Create Product
                      </button>
                      <button
                        type="button"
                        className="startup-btn-outline py-3 px-5"
                        onClick={() => navigate('/admin')}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .add-product-page .form-control:focus, 
        .add-product-page .form-select:focus {
            border-color: #000 !important;
            box-shadow: 0 0 0 1px #000 !important;
        }
        .fw-800 { font-weight: 800; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AddProduct;
