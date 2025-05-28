package com.ups.package_management.service;

import com.ups.package_management.model.BlacklistedToken;
import com.ups.package_management.repository.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TokenCleanupService {

    @Autowired
    private BlacklistedTokenRepository tokenRepo;

    public void blacklistToken(String token, LocalDateTime expiry) {
        if (!tokenRepo.existsByToken(token)) {
            tokenRepo.save(new BlacklistedToken(token, expiry));
        }
    }

    public boolean isBlacklisted(String token) {
        return tokenRepo.existsByToken(token);
    }

    // Optional: cleanup expired tokens
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        tokenRepo.findAll().stream()
                .filter(t -> t.getExpiry().isBefore(now))
                .forEach(t -> tokenRepo.delete(t));
    }
}
