package com.ups.package_management.service;

import com.ups.package_management.dto.PackageRequestDTO;
import com.ups.package_management.model.Package;
import com.ups.package_management.model.PackageStatus;
import com.ups.package_management.repository.PackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PackageService {

    private final PackageRepository packageRepository;

    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }




    public Package createPackage(PackageRequestDTO dto) {
        if (packageRepository.findByTrackingNumber(dto.getTrackingNumber()).isPresent()) {
            throw new RuntimeException("Tracking number already exists");
        }

        Package newPackage = Package.builder()
                .trackingNumber(dto.getTrackingNumber())
                .sender(dto.getSender())
                .receiver(dto.getReceiver())
                .destination(dto.getDestination())
                .status(dto.getStatus())
                .weight(dto.getWeight())
                .dimensions(dto.getDimensions())
                .build();

        return packageRepository.save(newPackage);
    }

    public void deletePackage(Long id) {
        if (!packageRepository.existsById(id)) {
            throw new RuntimeException("Package with ID " + id + " does not exist.");
        }
        packageRepository.deleteById(id);
        System.out.println("Package with ID " + id + " deleted successfully.");
    }

    public List<Package> searchPackages(String status, String destination) {
        if (status != null && destination != null) {
            return packageRepository.findByStatusAndDestination(
                    PackageStatus.valueOf(status.toUpperCase()), destination);
        } else if (status != null) {
            return packageRepository.findByStatus(PackageStatus.valueOf(status.toUpperCase()));
        } else if (destination != null) {
            return packageRepository.findByDestination(destination);
        } else {
            return packageRepository.findAll();
        }
    }
}
