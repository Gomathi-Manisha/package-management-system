// RegisterRequest.java
package com.ups.package_management.dto;

import lombok.*;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
}
