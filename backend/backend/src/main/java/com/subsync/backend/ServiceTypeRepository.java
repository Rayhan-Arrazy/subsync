package com.subsync.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

// The name here MUST match the filename (ServiceTypeRepository)
public interface ServiceTypeRepository extends JpaRepository<ServiceType, UUID> {
    // Keep this empty for now unless you added custom methods before
}