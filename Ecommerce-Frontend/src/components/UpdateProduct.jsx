import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setUpdateProduct(response.data);

        try {
          const responseImage = await axios.get(`/product/${id}/image`, { responseType: "blob" });
          const imageFile = new File([responseImage.data], response.data.imageName, { type: responseImage.data.type });
          setImage(imageFile);
          setPreviewUrl(URL.createObjectURL(responseImage.data));
        } catch (imgError) {
          console.error("Error fetching image:", imgError);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    try {
      await axios.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage = error.response?.data?.message || "Failed to update product. Please try again.";
      alert(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="update-product-page py-5" style={{ backgroundColor: "#ffffff", minHeight: "calc(100vh - 80px)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
                <h1 className="fw-800 mb-0" style={{ letterSpacing: '-0.04em' }}>Update Product</h1>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Product Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      name="name"
                      value={updateProduct.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Brand</label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      name="brand"
                      value={updateProduct.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Description</label>
                    <textarea
                      className="form-control rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      name="description"
                      value={updateProduct.description}
                      onChange={handleChange}
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
                        name="price"
                        value={updateProduct.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Category</label>
                    <select
                      className="form-select rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      name="category"
                      value={updateProduct.category}
                      onChange={handleChange}
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
                      name="stockQuantity"
                      value={updateProduct.stockQuantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Availability Date</label>
                    <input
                      type="date"
                      className="form-control rounded-3 py-3 px-3 border-light-subtle shadow-none"
                      name="releaseDate"
                      value={updateProduct.releaseDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.1em' }}>Product Visualization</label>
                    <div className="d-flex flex-column align-items-center p-5 border-2 border-dashed rounded-4 text-center transition-all position-relative" style={{ borderColor: '#e5e5e5', backgroundColor: '#fafafa' }}>
                      {previewUrl ? (
                        <div className="preview-container w-100 position-relative">
                          <img src={previewUrl} alt="Preview" style={{ maxHeight: '240px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                          <div className="mt-3 small fw-bold text-dark">Click image to replace</div>
                        </div>
                      ) : (
                        <div className="upload-placeholder py-4">
                          <i className="bi bi-image d-block fs-1 mb-3 text-dark"></i>
                          <p className="mb-1 fw-bold text-dark">No image selected</p>
                          <p className="smaller text-muted">Click to select product image</p>
                        </div>
                      )}
                      <input
                        className="form-control position-absolute inset-0 opacity-0 cursor-pointer w-100 h-100"
                        type="file"
                        onChange={handleImageChange}
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
                        checked={updateProduct.productAvailable}
                        onChange={(e) =>
                          setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
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
                        Save Changes
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
        .update-product-page .form-control:focus, 
        .update-product-page .form-select:focus {
            border-color: #000 !important;
            box-shadow: 0 0 0 1px #000 !important;
        }
        .fw-800 { font-weight: 800; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default UpdateProduct;