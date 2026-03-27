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
        throw new IllegalStateException("No company information found in security context");
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
