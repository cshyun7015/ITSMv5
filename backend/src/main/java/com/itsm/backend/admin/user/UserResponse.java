package com.itsm.backend.admin.user;

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
