package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

        @Query("SELECT p.id as id, p.name as name, p.brand as brand, p.category as category, p.price as price FROM Product p WHERE "
                        +
                        "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<java.util.Map<String, Object>> searchProducts(String keyword);

        org.springframework.data.domain.Page<Product> findByCategory(String category,
                        org.springframework.data.domain.Pageable pageable);

        @Query("SELECT p FROM Product p WHERE " +
                        "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        org.springframework.data.domain.Page<Product> searchProductsPaginated(String keyword,
                        org.springframework.data.domain.Pageable pageable);
}
