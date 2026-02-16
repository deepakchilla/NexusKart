package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByUser(com.cart.ecom_proj.model.User user);
}
