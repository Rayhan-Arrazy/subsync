package com.subsync.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*") // Allows your frontend to talk to this backend
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository repository;

    // 1. GET ALL SUBSCRIPTIONS
    @GetMapping
    public List<Subscription> getAllSubscriptions() {
        return repository.findAll();
    }

    // 2. CREATE NEW SUBSCRIPTION
    @PostMapping
    public Subscription createSubscription(@RequestBody Subscription sub) {
        // We need to fill in missing data because your simple Frontend form
        // doesn't send UserID or ServiceID yet.

        // AUTO-FIX: If userId is missing, assign it to User ID 1 (Rayhan)
        if (sub.getUserId() == null) {
            sub.setUserId(1L);
        }

        // AUTO-FIX: If serviceId is missing, assign it to 'General' (ID 1)
        if (sub.getServiceId() == null) {
            sub.setServiceId(1L);
        }

        // AUTO-FIX: If dates are missing, set them to today
        if (sub.getStartDate() == null) {
            sub.setStartDate(LocalDate.now());
        }
        if (sub.getNextRenewalDate() == null) {
            sub.setNextRenewalDate(LocalDate.now().plusMonths(1));
        }

        // Set Active by default
        sub.setIsActive(true);

        return repository.save(sub);
    }

    // 3. DELETE SUBSCRIPTION
    @DeleteMapping("/{id}")
    public void deleteSubscription(@PathVariable Long id) {
        repository.deleteById(id);
    }
}