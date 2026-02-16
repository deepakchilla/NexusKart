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
    <div className="update-product-page">
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
                <h2 className="fw-bold mb-0">Update Product</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Product Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
                      name="name"
                      value={updateProduct.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Brand</label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
                      name="brand"
                      value={updateProduct.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">Description</label>
                    <textarea
                      className="form-control rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
                      name="description"
                      value={updateProduct.description}
                      onChange={handleChange}
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
                        name="price"
                        value={updateProduct.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Category</label>
                    <select
                      className="form-select rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
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
                    <label className="form-label fw-bold small text-muted text-uppercase">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-control rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
                      name="stockQuantity"
                      value={updateProduct.stockQuantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Release Date</label>
                    <input
                      type="date"
                      className="form-control rounded-3 py-2 px-3 border-secondary-subtle shadow-none"
                      name="releaseDate"
                      value={updateProduct.releaseDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">Product Image</label>
                    <div className="d-flex flex-column align-items-center p-4 border-2 border-dashed border-secondary-subtle bg-light rounded-3 text-center position-relative">
                      {previewUrl ? (
                        <div className="preview-container w-100 position-relative">
                          <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
                          <div className="mt-2 small text-muted">Click image to change</div>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <i className="bi bi-image d-block fs-1 opacity-25 mb-2"></i>
                          <p className="mb-0 small fw-medium">No image available</p>
                        </div>
                      )}
                      <input
                        className="form-control position-absolute inset-0 opacity-0 cursor-pointer"
                        type="file"
                        onChange={handleImageChange}
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
                        checked={updateProduct.productAvailable}
                        onChange={(e) =>
                          setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
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
                        Update Product
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
        .update-product-page .form-control:focus, 
        .update-product-page .form-select:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.05);
        }
        .inset-0 { top: 0; left: 0; right: 0; bottom: 0; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default UpdateProduct;