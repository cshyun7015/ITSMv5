package com.itsm.backend.admin;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.User;
import com.itsm.backend.tenant.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final EntityManager em;
    private final UserRepository userRepository;
    private final TenantAdminRepository tenantRepository;

    public AdminController(EntityManager em, UserRepository userRepository, TenantAdminRepository tenantRepository) {
        this.em = em;
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
    }

    private void assertAdmin() {
        String role = SecurityUtils.getCurrentRole();
        if (!"ROLE_ADMIN".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
        }
    }

    // ===== TENANT MANAGEMENT =====

    @GetMapping("/tenants")
    public List<Tenant> getTenants() {
        assertAdmin();
        return tenantRepository.findAll();
    }

    @PostMapping("/tenants")
    @Transactional
    public Tenant createTenant(@RequestBody Map<String, Object> payload) {
        assertAdmin();
        Tenant tenant = new Tenant();
        tenant.setTenantId(payload.get("tenantId").toString());
        tenant.setTenantName(payload.get("tenantName").toString());
        tenant.setTier(payload.getOrDefault("tier", "Standard").toString());
        tenant.setIsActive(true);
        tenant.setCreatedAt(LocalDateTime.now());
        em.persist(tenant);
        return tenant;
    }

    @PatchMapping("/tenants/{tenantId}")
    public Tenant updateTenant(@PathVariable String tenantId, @RequestBody Map<String, Object> payload) {
        assertAdmin();
        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow();
        if (payload.containsKey("tenantName")) tenant.setTenantName(payload.get("tenantName").toString());
        if (payload.containsKey("tier")) tenant.setTier(payload.get("tier").toString());
        if (payload.containsKey("isActive")) tenant.setIsActive(Boolean.parseBoolean(payload.get("isActive").toString()));
        return tenantRepository.save(tenant);
    }

    // ===== USER MANAGEMENT =====

    @GetMapping("/users")
    public List<User> getUsers() {
        assertAdmin();
        return userRepository.findAll();
    }

    @PostMapping("/users")
    @Transactional
    public User createUser(@RequestBody Map<String, Object> payload) {
        assertAdmin();
        String tenantId = payload.get("tenantId").toString();
        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow();

        User user = new User();
        user.setUserId(payload.get("userId").toString());
        user.setTenant(tenant);
        user.setPassword("{noop}" + payload.get("password").toString());
        user.setUserName(payload.get("userName").toString());
        user.setEmail(payload.get("email").toString());
        user.setRole(payload.getOrDefault("role", "ROLE_USER").toString());

        return userRepository.save(user);
    }

    @PatchMapping("/users/{userId}/toggle")
    public Map<String, String> toggleUser(@PathVariable String userId) {
        assertAdmin();
        User user = userRepository.findById(userId).orElseThrow();
        // Simple toggle: rename role from active to deactivated
        String newRole = "ROLE_INACTIVE".equals(user.getRole()) ? "ROLE_USER" : "ROLE_INACTIVE";
        user.setRole(newRole);
        userRepository.save(user);
        return Map.of("userId", userId, "role", newRole);
    }
}
