package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Objects;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    @Autowired
    private UserService service;

    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable Long id,
            @RequestParam("imageFile") MultipartFile imageFile) {
        try {
            service.updateProfilePicture(id, imageFile);
            return new ResponseEntity<>("Profile picture updated", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable Long id) {
        User user = service.getById(id);
        byte[] imageFile = user.getImageDate();
        String type = user.getImageType();
        if (imageFile != null && type != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(Objects.requireNonNull(type)))
                    .body(imageFile);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
