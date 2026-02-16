package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Order;
import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.repo.OrderRepo;
import com.cart.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class AdminStatsController {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private OrderRepo orderRepo;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        try {
            long totalProducts = productRepo.count();
            stats.put("totalProducts", totalProducts);

            List<Order> orders = orderRepo.findAll();
            BigDecimal totalSales = orders.stream()
                    .filter(o -> o.getTotalAmount() != null)
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            stats.put("totalSales", totalSales);

            List<Product> products = productRepo.findAll();
            long lowStockCount = products.stream()
                    .filter(p -> p.getStockQuantity() <= 5)
                    .count();

            String stockStatus = lowStockCount > 0 ? "Alert (" + lowStockCount + " Low)" : "Healthy";
            stats.put("stockStatus", stockStatus);
            stats.put("lowStockCount", lowStockCount);
        } catch (Exception e) {
            stats.put("error", e.getMessage());
            return ResponseEntity.status(500).body(stats);
        }
        return ResponseEntity.ok(stats);
    }
}
