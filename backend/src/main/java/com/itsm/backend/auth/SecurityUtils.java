package com.itsm.backend.auth;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility to extract companyId and userId from the JWT-populated SecurityContext.
 * Use this in ALL controllers instead of @RequestParam String companyId.
 */
@Component
public class SecurityUtils {

    public static String getCurrentCompanyId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof CompanyAwareAuthentication taa) {
            return taa.getCompanyId();
        }
        return "system"; // Default fallback
    }

    public static String getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return "anonymous"; // Default fallback for unauthenticated
    }

    public static String getCurrentRole() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities() != null && !auth.getAuthorities().isEmpty()) {
            return auth.getAuthorities().iterator().next().getAuthority();
        }
        return "ROLE_USER"; // Default fallback
    }
}
