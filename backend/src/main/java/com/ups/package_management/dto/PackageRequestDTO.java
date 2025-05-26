package com.ups.package_management.dto;

import com.ups.package_management.model.PackageStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackageRequestDTO {
    private String trackingNumber;
    private String sender;
    private String receiver;
    private String destination;
    private PackageStatus status;
    private Double weight;
    private String dimensions;
}
