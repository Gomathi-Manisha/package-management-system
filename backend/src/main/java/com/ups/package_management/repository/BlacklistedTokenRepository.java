package com.ups.package_management.repository;

import com.ups.package_management.model.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


import java.time.LocalDateTime;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {
    Optional<BlacklistedToken> findByToken(String token);
    boolean existsByToken(String token);
    void deleteAllByExpiryBefore(LocalDateTime now);
}
