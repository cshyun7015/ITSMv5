package com.itsm.backend.auth;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility to extract tenantId and userId from the JWT-populated SecurityContext.
 * Use this in ALL controllers instead of @RequestParam String tenantId.
 */
@Component
public class SecurityUtils {

    public static String getCurrentTenantId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof TenantAwareAuthentication taa) {
            return taa.getTenantId();
        }
        throw new IllegalStateException("No tenant information found in security context");
    }

    public static String getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            return auth.getName();
        }
        throw new IllegalStateException("No user information found in security context");
    }

    public static String getCurrentRole() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && !auth.getAuthorities().isEmpty()) {
            return auth.getAuthorities().iterator().next().getAuthority();
        }
        return null;
    }
}
