package com.itsm.backend.auth;

import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
import com.itsm.backend.admin.company.Company;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUserId(request.getUserId());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Phase 1: Raw password check or handling '{noop}' inserted by Flyway script
            String rawDbPassword = user.getPassword().replace("{noop}", "");
            if (rawDbPassword.equals(request.getPassword()) || user.getPassword().equals(request.getPassword())) {
                Company company = user.getCompany();
                if (company == null) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "User has no assigned company. Contact administrator."));
                }
                
                String token = jwtTokenProvider.createToken(user.getUserId(), user.getRole(), company.getCompanyId());
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "userId", user.getUserId(),
                    "userName", user.getUserName(),
                    "role", user.getRole(),
                    "companyId", company.getCompanyId()
                ));
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
    }
}
