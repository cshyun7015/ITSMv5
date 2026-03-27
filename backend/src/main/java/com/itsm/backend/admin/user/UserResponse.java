package com.itsm.backend.admin.company.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {
    private String userId;
    private String companyId;
    private String userName;
    private String email;
    private String role;
}
