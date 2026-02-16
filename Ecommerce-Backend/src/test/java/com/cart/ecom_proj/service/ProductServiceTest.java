package com.cart.ecom_proj.service;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.repo.ProductRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProductServiceTest {

    @Mock
    private ProductRepo productRepo;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetProductById_Success() {
        // Arrange
        Product mockProduct = new Product();
        mockProduct.setId(1);
        mockProduct.setName("Test Product");
        mockProduct.setPrice(new BigDecimal("99.99"));

        when(productRepo.findById(1)).thenReturn(Optional.of(mockProduct));

        // Act
        Product found = productService.getProductById(1);

        // Assert
        assertNotNull(found);
        assertEquals("Test Product", found.getName());
        verify(productRepo, times(1)).findById(1);
    }

    @Test
    public void testGetProductById_NotFound() {
        // Arrange
        when(productRepo.findById(999)).thenReturn(Optional.empty());

        // Act
        Product found = productService.getProductById(999);

        // Assert
        assertNull(found);
    }
}
