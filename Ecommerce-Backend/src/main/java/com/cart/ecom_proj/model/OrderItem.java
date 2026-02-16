package com.cart.ecom_proj.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Order order;

    @ManyToOne
    private Product product;

    private int quantity;
    private BigDecimal price; // Price at the time of order
}
