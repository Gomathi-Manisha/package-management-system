package com.ups.package_management.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "packages", uniqueConstraints = {@UniqueConstraint(columnNames = "trackingNumber")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String trackingNumber;

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false)
    private String receiver;

    @Column(nullable = false)
    private String destination;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PackageStatus status;

    private Double weight;

    private String dimensions;
}
