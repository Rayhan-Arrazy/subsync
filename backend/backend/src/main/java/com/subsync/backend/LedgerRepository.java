package com.subsync.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface LedgerRepository extends JpaRepository<Ledger, UUID> {
}