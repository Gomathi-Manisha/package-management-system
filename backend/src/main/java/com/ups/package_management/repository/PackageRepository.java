package com.ups.package_management.repository;

import com.ups.package_management.model.Package;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import com.ups.package_management.model.PackageStatus;

public interface PackageRepository extends JpaRepository<Package, Long> {
    Optional<Package> findByTrackingNumber(String trackingNumber);
    List<Package> findByStatus(PackageStatus status);
    List<Package> findByDestination(String destination);
    List<Package> findByStatusAndDestination(PackageStatus status, String destination);

}
