package com.subsync.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SubscriptionMemberRepository extends JpaRepository<SubscriptionMember, UUID> {
}