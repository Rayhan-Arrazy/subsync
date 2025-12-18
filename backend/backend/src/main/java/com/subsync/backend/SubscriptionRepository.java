package com.subsync.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

// The name here MUST match the filename (SubscriptionRepository)
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    // This is the line that fixes your original Controller error
    List<Subscription> findByPayerId(UUID payerId);
}