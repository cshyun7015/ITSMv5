package com.itsm.backend.auth;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Custom Authentication that carries companyId from the JWT claim,
 * allowing downstream controllers to extract it server-side without
 * trusting any client-supplied parameter.
 */
public class CompanyAwareAuthentication extends UsernamePasswordAuthenticationToken {
    private final String companyId;

    public CompanyAwareAuthentication(Object principal, String companyId, Object credentials,
                                     Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
        this.companyId = companyId;
    }

    public String getCompanyId() {
        return companyId;
    }
}
