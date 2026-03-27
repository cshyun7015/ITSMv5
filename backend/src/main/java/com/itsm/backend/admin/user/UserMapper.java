package com.itsm.backend.admin.company.mapper;

import com.itsm.backend.admin.company.dto.UserResponse;
import com.itsm.backend.admin.company.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .companyId(user.getCompany() != null ? user.getCompany().getCompanyId() : null)
                .userName(user.getUserName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
