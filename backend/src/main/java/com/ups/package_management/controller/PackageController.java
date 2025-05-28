package com.ups.package_management.controller;

import com.ups.package_management.dto.PackageRequestDTO;
import com.ups.package_management.model.Package;
import com.ups.package_management.service.PackageService;
import com.ups.package_management.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class PackageController {

    private final PackageService packageService;
    private final PackageRepository packageRepository;

    @PostMapping
    public ResponseEntity<Package> createPackage(@RequestBody PackageRequestDTO dto) {
        Package created = packageService.createPackage(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Package>> getAllPackages() {
        return ResponseEntity.ok(packageRepository.findAll());
    }



    @GetMapping("/{trackingNumber}")
    public ResponseEntity<Package> getPackageByTrackingNumber(@PathVariable String trackingNumber) {
        Optional<Package> optionalPackage = packageRepository.findByTrackingNumber(trackingNumber);
        return optionalPackage
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public ResponseEntity<Package> updatePackage(
            @PathVariable Long id,
            @RequestBody Package updatedPackage
    ) {
        return packageRepository.findById(id)
                .map(pkg -> {
                    pkg.setSender(updatedPackage.getSender());
                    pkg.setReceiver(updatedPackage.getReceiver());
                    pkg.setDestination(updatedPackage.getDestination());
                    pkg.setStatus(updatedPackage.getStatus());
                    pkg.setWeight(updatedPackage.getWeight());
                    pkg.setDimensions(updatedPackage.getDimensions());
                    return ResponseEntity.ok(packageRepository.save(pkg));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePackage(@PathVariable Long id) {
        if (!packageRepository.existsById(id)) {
            return ResponseEntity.ok("Package with id " + id + " not found");

            //return ResponseEntity.notFound().build();
        }
        packageRepository.deleteById(id);
        return ResponseEntity.ok("Package " + id + " deleted successfully");
        //return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Package>> searchPackages(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String destination
    ) {
        return ResponseEntity.ok(packageService.searchPackages(status, destination));
    }

    @GetMapping("/report")
    public ResponseEntity<List<Package>> generateReport() {
        return ResponseEntity.ok(packageService.getAllPackages());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummaryStatistics() {
        Map<String, Object> summary = new HashMap<>();
        List<Package> allPackages = packageService.getAllPackages();

        long total = allPackages.size();
        long delivered = allPackages.stream().filter(p -> p.getStatus().name().equals("DELIVERED")).count();
        long pending = allPackages.stream().filter(p -> p.getStatus().name().equals("PENDING")).count();

        summary.put("totalPackages", total);
        summary.put("deliveredPackages", delivered);
        summary.put("pendingPackages", pending);

        return ResponseEntity.ok(summary);
    }










}
