package com.subsync.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // This matches the INT AUTO_INCREMENT in MySQL
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "service_id")
    private Long serviceId;

    // We map the SQL column "custom_name" to "serviceName" so your Frontend JSON
    // works
    @Column(name = "custom_name")
    private String serviceName;

    @Column(name = "monthly_cost")
    private BigDecimal monthlyCost;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "next_renewal")
    private LocalDate nextRenewalDate;

    @Column(name = "is_active")
    private Boolean isActive;

    // --- Constructors ---
    public Subscription() {
    }

    public Subscription(Long userId, Long serviceId, String serviceName, BigDecimal monthlyCost, LocalDate startDate,
            LocalDate nextRenewalDate) {
        this.userId = userId;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.monthlyCost = monthlyCost;
        this.startDate = startDate;
        this.nextRenewalDate = nextRenewalDate;
        this.isActive = true;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public BigDecimal getMonthlyCost() {
        return monthlyCost;
    }

    public void setMonthlyCost(BigDecimal monthlyCost) {
        this.monthlyCost = monthlyCost;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getNextRenewalDate() {
        return nextRenewalDate;
    }

    public void setNextRenewalDate(LocalDate nextRenewalDate) {
        this.nextRenewalDate = nextRenewalDate;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}