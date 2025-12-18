package com.subsync.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class SubscriptionController {

    private final UserRepository userRepo;
    private final ServiceTypeRepository serviceRepo;
    private final SubscriptionRepository subRepo;

    // Inject the repositories
    public SubscriptionController(UserRepository userRepo,
            ServiceTypeRepository serviceRepo,
            SubscriptionRepository subRepo) {
        this.userRepo = userRepo;
        this.serviceRepo = serviceRepo;
        this.subRepo = subRepo;
    }

    // --- 1. LOGIN ---
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        User user = userRepo.findByUsername(username);

        if (user != null && user.getPassword().equals(password)) {
            // Login Success
            return Map.of(
                    "id", user.getId(),
                    "username", user.getUsername());
        }
        throw new RuntimeException("Invalid Login");
    }

    // --- 2. GET SERVICES (For Dropdown) ---
    @GetMapping("/services")
    public List<ServiceType> getAllServices() {
        return serviceRepo.findAll();
    }

    // --- 3. GET MY SUBSCRIPTIONS ---
    @GetMapping("/subscriptions")
    public List<Subscription> getMySubscriptions(@RequestParam UUID userId) {
        return subRepo.findByPayerId(userId);
    }

    // --- 4. ADD NEW SUBSCRIPTION ---
    @PostMapping("/subscriptions")
    public Subscription addSubscription(@RequestBody Map<String, Object> payload) {
        // 1. Find the User
        UUID payerId = UUID.fromString((String) payload.get("payerId"));
        User payer = userRepo.findById(payerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Find the Service (Netflix/Spotify)
        UUID serviceId = UUID.fromString((String) payload.get("serviceId"));
        ServiceType service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // 3. Create Connection
        Subscription sub = new Subscription();
        sub.setPayer(payer);
        sub.setServiceType(service);

        // Handle Amount (Convert safely from JSON)
        String amountStr = payload.get("amount").toString();
        sub.setAmount(new java.math.BigDecimal(amountStr));

        sub.setRenewalDate(java.time.LocalDate.now().plusMonths(1));

        return subRepo.save(sub);
    }

    // --- 5. INITIALIZE DEMO DATA (Run once) ---
    @GetMapping("/init")
    public String initData() {
        if (userRepo.count() > 0)
            return "Data already exists!";

        // Create Users
        User alice = new User();
        alice.setUsername("alice");
        alice.setPassword("123");
        userRepo.save(alice);

        User bob = new User();
        bob.setUsername("bob");
        bob.setPassword("123");
        userRepo.save(bob);

        // Create Services
        ServiceType netflix = new ServiceType();
        netflix.setName("Netflix");
        netflix.setDefaultPrice(new java.math.BigDecimal("15.99"));
        serviceRepo.save(netflix);

        ServiceType spotify = new ServiceType();
        spotify.setName("Spotify");
        spotify.setDefaultPrice(new java.math.BigDecimal("9.99"));
        serviceRepo.save(spotify);

        ServiceType aws = new ServiceType();
        aws.setName("AWS");
        aws.setDefaultPrice(new java.math.BigDecimal("29.99"));
        serviceRepo.save(aws);

        return "Database Initialized! Login as 'alice' with '123'";
    }
}