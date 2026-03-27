package com.itsm.backend.company.repository;

import com.itsm.backend.company.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserId(String userId);
    Page<User> findByUserNameContainingIgnoreCaseOrUserIdContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String id, String email, Pageable pageable);
}
