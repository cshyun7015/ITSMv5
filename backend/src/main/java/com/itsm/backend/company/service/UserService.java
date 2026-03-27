package com.itsm.backend.company.service;

import com.itsm.backend.company.dto.UserRequest;
import com.itsm.backend.company.dto.UserResponse;
import com.itsm.backend.company.entity.Company;
import com.itsm.backend.company.entity.User;
import com.itsm.backend.company.mapper.UserMapper;
import com.itsm.backend.company.repository.CompanyRepository;
import com.itsm.backend.company.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final UserMapper userMapper;

    public Page<UserResponse> getUsers(String search, Pageable pageable) {
        Page<User> users;
        if (search == null || search.isEmpty()) {
            users = userRepository.findAll(pageable);
        } else {
            users = userRepository.findByUserNameContainingIgnoreCaseOrUserIdContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, search, pageable);
        }
        return users.map(userMapper::toResponse);
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        User user = new User();
        user.setUserId(request.getUserId());
        user.setCompany(company);
        user.setPassword("{noop}" + request.getPassword());
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole() != null ? request.getRole() : "ROLE_USER");

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Transactional
    public UserResponse updateUser(String userId, UserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getUserName() != null) user.setUserName(request.getUserName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword("{noop}" + request.getPassword());
        }
        if (request.getCompanyId() != null) {
            Company company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            user.setCompany(company);
        }

        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse toggleUserStatus(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String newRole = "ROLE_INACTIVE".equals(user.getRole()) ? "ROLE_USER" : "ROLE_INACTIVE";
        user.setRole(newRole);
        
        return userMapper.toResponse(user);
    }

    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
