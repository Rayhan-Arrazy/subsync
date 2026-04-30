package com.subsync.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {
    List<PaymentHistory> findBySubscriptionId(Long subscriptionId);
    List<PaymentHistory> findAllByOrderByPaymentDateDesc();
}
