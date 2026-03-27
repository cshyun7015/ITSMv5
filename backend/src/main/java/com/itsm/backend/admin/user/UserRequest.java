package com.itsm.backend.admin.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
    private String userId;
    private String companyId;
    private String password;
    private String userName;
    private String email;
    private String role;
}
