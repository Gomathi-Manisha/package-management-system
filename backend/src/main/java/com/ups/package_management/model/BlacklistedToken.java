package com.ups.package_management.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class BlacklistedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String token;

    private LocalDateTime expiry;

    // Constructors, Getters, Setters
    public BlacklistedToken() {}

    public BlacklistedToken(String token, LocalDateTime expiry) {
        this.token = token;
        this.expiry = expiry;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public LocalDateTime getExpiry() { return expiry; }
    public void setExpiry(LocalDateTime expiry) { this.expiry = expiry; }
}
