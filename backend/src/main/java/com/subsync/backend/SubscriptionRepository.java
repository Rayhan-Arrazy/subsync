package com.subsync.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// CHANGE <Subscription, UUID> TO <Subscription, Long>
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

}