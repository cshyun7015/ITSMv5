package com.itsm.backend.admin.company.controller;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.admin.company.dto.UserRequest;
import com.itsm.backend.admin.company.dto.UserResponse;
import com.itsm.backend.admin.company.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserAdminController {

    private final UserService userService;

    private void assertAdmin() {
        if (!"ROLE_ADMIN".equals(SecurityUtils.getCurrentRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
        }
    }

    @GetMapping
    public Page<UserResponse> getUsers(
            @PageableDefault(sort = "userId", direction = org.springframework.data.domain.Sort.Direction.ASC) Pageable pageable,
            @RequestParam(defaultValue = "") String search) {
        assertAdmin();
        return userService.getUsers(search, pageable);
    }

    @PostMapping
    public UserResponse createUser(@RequestBody UserRequest request) {
        assertAdmin();
        return userService.createUser(request);
    }

    @PatchMapping("/{userId}/toggle")
    public UserResponse toggleUser(@PathVariable String userId) {
        assertAdmin();
        return userService.toggleUserStatus(userId);
    }

    @PatchMapping("/{userId}")
    public UserResponse updateUser(@PathVariable String userId, @RequestBody UserRequest request) {
        assertAdmin();
        return userService.updateUser(userId, request);
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable String userId) {
        assertAdmin();
        userService.deleteUser(userId);
    }
}
