package com.itsm.backend.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = resolveToken(request);
        if (token != null && jwtTokenProvider.validateToken(token)) {
            var claims = jwtTokenProvider.getClaims(token);
            String userId = claims.getSubject();
            String role = claims.get("role", String.class);
            String companyId = claims.get("companyId", String.class);

            if (role != null && !role.isEmpty()) {
                // [SECURITY DEBUG] Setting authorities for role
                var authorities = List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(role));
                
                CompanyAwareAuthentication auth = new CompanyAwareAuthentication(
                        userId, companyId, null, authorities);
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                org.springframework.security.core.context.SecurityContext context = org.springframework.security.core.context.SecurityContextHolder.getContext();
                context.setAuthentication(auth);
                
                System.out.println("[SECURITY DEBUG] " + request.getMethod() + " " + request.getRequestURI() + " - Auth success: " + userId + " (" + role + ")");
            }
        }
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
