package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Long> {
    java.util.List<Review> findByProduct_Id(int productId);
}
