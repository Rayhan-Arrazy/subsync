package com.subsync.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private SubscriptionRepository subRepository;

    @Autowired
    private PaymentHistoryRepository historyRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if history is empty
        if (historyRepository.count() == 0) {
            List<Subscription> subs = subRepository.findAll();
            
            for (Subscription sub : subs) {
                // Add 3 months of history for each sub
                for (int i = 1; i <= 3; i++) {
                    PaymentHistory history = new PaymentHistory();
                    history.setSubscription(sub);
                    history.setAmount(sub.getMonthlyCost());
                    history.setPaymentDate(LocalDate.now().minusMonths(i));
                    history.setStatus("PAID");
                    historyRepository.save(history);
                }
            }
            System.out.println(">>> Seeded " + (subs.size() * 3) + " payment history records.");
        }
    }
}
