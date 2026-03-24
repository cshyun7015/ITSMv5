package com.itsm.backend.auth;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Custom Authentication that carries tenantId from the JWT claim,
 * allowing downstream controllers to extract it server-side without
 * trusting any client-supplied parameter.
 */
public class TenantAwareAuthentication extends UsernamePasswordAuthenticationToken {
    private final String tenantId;

    public TenantAwareAuthentication(Object principal, String tenantId, Object credentials,
                                     Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
        this.tenantId = tenantId;
    }

    public String getTenantId() {
        return tenantId;
    }
}
