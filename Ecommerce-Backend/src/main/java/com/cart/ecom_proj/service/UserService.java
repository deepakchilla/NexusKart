package com.cart.ecom_proj.service;

import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }

    public User updateProfile(Long id, User updatedUser) {
        return repo.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            // Only update password if provided
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(encoder.encode(updatedUser.getPassword()));
            }
            return repo.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateProfilePicture(Long id, MultipartFile imageFile) throws IOException {
        User user = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setImageName(imageFile.getOriginalFilename());
        user.setImageType(imageFile.getContentType());
        user.setImageDate(imageFile.getBytes());
        return repo.save(user);
    }

    public User getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
