package com.subsync.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*") // Allows the frontend to communicate with this backend
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository repository;

    // 1. GET ALL SUBSCRIPTIONS (For the Dashboard List)
    @GetMapping
    public List<Subscription> getAllSubscriptions() {
        return repository.findAll();
    }

    // 2. GET SINGLE SUBSCRIPTION (For the Detail Page)
    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscription(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. CREATE NEW SUBSCRIPTION (For the "Add" Form)
    @PostMapping
    public Subscription createSubscription(@RequestBody Subscription sub) {
        // Auto-fill defaults if data is missing
        if (sub.getUserId() == null) {
            sub.setUserId(1L); // Default to User 1
        }
        if (sub.getServiceId() == null) {
            sub.setServiceId(1L); // Default to 'General' service
        }
        if (sub.getStartDate() == null) {
            sub.setStartDate(LocalDate.now());
        }
        if (sub.getNextRenewalDate() == null) {
            sub.setNextRenewalDate(LocalDate.now().plusMonths(1));
        }

        // Ensure it is marked as active
        sub.setIsActive(true);

        return repository.save(sub);
    }

    // 4. DELETE SUBSCRIPTION (For the Trash Button)
    @DeleteMapping("/{id}")
    public void deleteSubscription(@PathVariable Long id) {
        repository.deleteById(id);
    }
}