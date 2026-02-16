package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.service.UserService;
import com.cart.ecom_proj.service.JWTService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");
        String adminCode = request.get("adminCode");

        if (service.findByEmail(email).isPresent()) {
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name);

        if (adminCode != null && adminCode.equals("ADMIN_SECRET_123")) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }

        // The service.register(user) will implicitly trigger validation if we added
        // @Valid here,
        // but since we are manually building the User object, we'll manually check or
        // refactor later.
        // For now, let's keep it simple.
        return new ResponseEntity<>(service.register(user), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            if (authentication.isAuthenticated()) {
                Optional<User> userOpt = service.findByEmail(loginRequest.getEmail());
                User user = userOpt.get();
                String token = jwtService.generateToken(user.getEmail());

                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("email", user.getEmail());
                response.put("name", user.getName());
                response.put("role", user.getRole());
                response.put("token", token);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        } catch (AuthenticationException e) {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @Valid @RequestBody User user) {
        User updated = service.updateProfile(id, user);
        Map<String, Object> response = new HashMap<>();
        response.put("id", updated.getId());
        response.put("email", updated.getEmail());
        response.put("name", updated.getName());
        response.put("role", updated.getRole());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
