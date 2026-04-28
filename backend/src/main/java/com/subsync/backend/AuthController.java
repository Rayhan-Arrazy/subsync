package com.subsync.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 1. LOGIN ENDPOINT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        User user = userRepository.findByUsername(username);

        if (user != null && user.getPassword().equals(password)) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // 2. DEMO DATA GENERATOR (Matches your new button)
    @GetMapping("/init")
    public String initData() {
        // Create Alice if she doesn't exist
        if (userRepository.findByUsername("alice") == null) {
            User alice = new User();
            alice.setUsername("alice");
            alice.setPassword("123");
            alice.setFullName("Alice Cooper");
            alice.setEmail("alice@demo.com");
            userRepository.save(alice);
            return "Created user 'alice' with password '123'";
        }
        return "User 'alice' already exists.";
    }
}