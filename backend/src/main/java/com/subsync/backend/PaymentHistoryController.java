package com.subsync.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class PaymentHistoryController {

    @Autowired
    private PaymentHistoryRepository repository;

    @GetMapping
    public List<PaymentHistory> getAllHistory() {
        return repository.findAllByOrderByPaymentDateDesc();
    }

    @GetMapping("/subscription/{subId}")
    public List<PaymentHistory> getHistoryBySubscription(@PathVariable Long subId) {
        return repository.findBySubscriptionId(subId);
    }
}
