package com.ups.package_management.service;

import com.ups.package_management.dto.*;
import com.ups.package_management.model.User;
import com.ups.package_management.repository.UserRepository;
import com.ups.package_management.security.JwtUtil;
import com.ups.package_management.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ups.package_management.model.BlacklistedToken;
import com.ups.package_management.repository.BlacklistedTokenRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final BlacklistedTokenRepository tokenRepository;
    private final JwtUtil jwtUtil;
    public void logout(String token) {
        String rawToken = token.replace("Bearer ", "");
        LocalDateTime expiry = jwtUtil.extractExpirationAsLocalDateTime(token);
        tokenRepository.save(new BlacklistedToken(rawToken, expiry));
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Wrap User in CustomUserDetails to conform to UserDetails
        UserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token);
    }
}
