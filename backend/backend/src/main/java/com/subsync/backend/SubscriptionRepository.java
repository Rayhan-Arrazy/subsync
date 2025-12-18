package com.subsync.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    // Basic CRUD is included automatically
}