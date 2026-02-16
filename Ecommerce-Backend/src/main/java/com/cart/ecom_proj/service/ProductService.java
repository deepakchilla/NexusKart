package com.cart.ecom_proj.service;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public org.springframework.data.domain.Page<Product> getProductsPaginated(int page, int size) {
        return repo.findAll(org.springframework.data.domain.PageRequest.of(page, size));
    }

    public org.springframework.data.domain.Page<Product> getProductsByCategory(String category, int page, int size) {
        return repo.findByCategory(category, org.springframework.data.domain.PageRequest.of(page, size));
    }

    public org.springframework.data.domain.Page<Product> getProductsBySearchPaginated(String keyword, int page,
            int size) {
        return repo.searchProductsPaginated(keyword, org.springframework.data.domain.PageRequest.of(page, size));
    }

    public Product getProductById(int id) {
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageDate(imageFile.getBytes());
        return repo.save(product);
    }

    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageDate(imageFile.getBytes());
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
        } else {
            // If no new image, we might need to preserved the old one or handle it
            // Assuming 'product' passed from frontend might not have imageDate
            Product existingProduct = repo.findById(id).orElse(null);
            if (existingProduct != null) {
                product.setImageDate(existingProduct.getImageDate());
                product.setImageName(existingProduct.getImageName());
                product.setImageType(existingProduct.getImageType());
            }
        }
        product.setId(id); // Ensure ID is set
        return repo.save(product);
    }

    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
}
