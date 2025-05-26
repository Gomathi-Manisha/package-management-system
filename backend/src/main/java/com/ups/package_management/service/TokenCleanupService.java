package com.ups.package_management.service;

import com.ups.package_management.repository.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TokenCleanupService {

    private final BlacklistedTokenRepository tokenRepository;

    @Autowired
    public TokenCleanupService(BlacklistedTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Scheduled(cron = "0 0 * * * *") // Runs every hour
    public void cleanExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        tokenRepository.deleteAllByExpiryBefore(now);
    }
}
