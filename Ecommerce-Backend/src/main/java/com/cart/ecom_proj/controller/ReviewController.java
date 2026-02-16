package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.model.Review;
import com.cart.ecom_proj.repo.ProductRepo;
import com.cart.ecom_proj.repo.ReviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private ProductRepo productRepo;

    @GetMapping("/product/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable int productId) {
        return new ResponseEntity<>(reviewRepo.findByProduct_Id(productId), HttpStatus.OK);
    }

    @PostMapping("/product/{productId}/reviews")
    public ResponseEntity<Review> addReview(@PathVariable int productId, @RequestBody Review review) {
        Product product = productRepo.findById(productId).orElse(null);
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        review.setProduct(product);
        return new ResponseEntity<>(reviewRepo.save(review), HttpStatus.CREATED);
    }
}
