package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin
public class NewsletterController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            emailService.sendNewsletterEmail(email);
            return ResponseEntity.ok(Map.of("message", "Subscription successful! Verification email sent."));
        } catch (Exception e) {
             e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to send email: " + e.getMessage());
        }
    }
}
