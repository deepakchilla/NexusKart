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
    <div className="add-product-page py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "calc(100vh - 80px)" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 p-md-5" style={{ borderRadius: '15px' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px' }}
                >
                  <i className="bi bi-arrow-left"></i>
                </button>
                <h2 className="fw-bold mb-0">Add New Product</h2>
              </div>

              <form onSubmit={submitHandler}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Product Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
                      placeholder="e.g. iPhone 15 Pro Max"
                      onChange={handleInputChange}
                      value={product.name}
                      name="name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      className="form-control rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
                      placeholder="e.g. Apple"
                      value={product.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">Description</label>
                    <textarea
                      className="form-control rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
                      placeholder="Provide a detailed description of the product..."
                      value={product.description}
                      name="description"
                      onChange={handleInputChange}
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Price (₹)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-secondary-subtle rounded-start-3">₹</span>
                      <input
                        type="number"
                        className="form-control border-secondary-subtle shadow-none rounded-end-3"
                        placeholder="0.00"
                        onChange={handleInputChange}
                        value={product.price}
                        name="price"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Category</label>
                    <select
                      className="form-select rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
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
                    <label className="form-label fw-bold small text-muted text-uppercase">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-control rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
                      placeholder="Available items"
                      onChange={handleInputChange}
                      value={product.stockQuantity}
                      name="stockQuantity"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Release Date</label>
                    <input
                      type="date"
                      className="form-control rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
                      value={product.releaseDate}
                      name="releaseDate"
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">Product Image</label>
                    <div className="d-flex flex-column align-items-center p-4 border-2 border-dashed border-secondary-subtle bg-light rounded-3 text-center transition-all hover-border-primary position-relative">
                      {previewUrl ? (
                        <div className="preview-container w-100 position-relative">
                          <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0 m-2 shadow"
                            onClick={() => { setImage(null); setPreviewUrl(null); }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <i className="bi bi-cloud-upload d-block fs-1 opacity-25 mb-2"></i>
                          <p className="mb-0 small fw-medium">Click to upload product image</p>
                          <p className="smaller text-muted">Supports JPG, PNG, WEBP</p>
                        </div>
                      )}
                      <input
                        className="form-control position-absolute inset-0 opacity-0 cursor-pointer"
                        type="file"
                        onChange={handleImageChange}
                        required={!image}
                        style={{ top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="col-12 mt-4">
                    <div className="form-check form-switch p-0 d-flex align-items-center gap-3">
                      <input
                        className="form-check-input mt-0 ms-0"
                        type="checkbox"
                        role="switch"
                        id="availabilitySwitch"
                        checked={product.productAvailable}
                        onChange={(e) =>
                          setProduct({ ...product, productAvailable: e.target.checked })
                        }
                        style={{ width: '45px', height: '22px' }}
                      />
                      <label className="form-check-label fw-bold" htmlFor="availabilitySwitch">
                        Mark as Available for Customers
                      </label>
                    </div>
                  </div>

                  <div className="col-12 mt-5">
                    <div className="d-flex gap-3">
                      <button
                        type="submit"
                        className="btn btn-dark flex-grow-1 py-3 fw-bold rounded-3 shadow-sm border-0"
                        style={{ backgroundColor: 'var(--accent-color)', color: '#ffffff' }}
                      >
                        Publish Product
                      </button>
                      <button
                        type="button"
                        className="btn btn-light py-3 px-4 fw-bold rounded-3"
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
            border-color: var(--accent-color);
            box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.05);
        }
        .add-product-page .hover-border-primary:hover {
            border-color: var(--accent-color) !important;
        }
        .inset-0 { top: 0; left: 0; right: 0; bottom: 0; }
        .cursor-pointer { cursor: pointer; }
        .smaller { font-size: 11px; }
      `}</style>
    </div>
  );
};

export default AddProduct;
