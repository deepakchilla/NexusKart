package com.cart.ecom_proj.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Description is required")
    @Column(length = 2000)
    private String description;

    @NotBlank(message = "Brand is required")
    private String brand;

    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;

    @NotBlank(message = "Category is required")
    private String category;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date releaseDate;

    private boolean productAvailable;

    @Min(value = 0, message = "Stock cannot be negative")
    private int stockQuantity;

    private String imageName;
    private String imageType;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageDate;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;
}
