package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Order;
import com.cart.ecom_proj.model.OrderItem;
import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.OrderRepo;
import com.cart.ecom_proj.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> user = userRepo.findByEmail(email);

        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        order.setUser(user.get());
        order.setOrderDate(new Date());
        order.setStatus("COMPLETED"); // Realistically starts as PENDING

        // Set the order reference in each item
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }

        return new ResponseEntity<>(orderRepo.save(order), HttpStatus.CREATED);
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return new ResponseEntity<>(orderRepo.findAll(), HttpStatus.OK);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> user = userRepo.findByEmail(email);

        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(orderRepo.findByUser(user.get()), HttpStatus.OK);
    }
}
