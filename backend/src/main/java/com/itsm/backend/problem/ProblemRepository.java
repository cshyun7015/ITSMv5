package com.itsm.backend.problem;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByCompanyCompanyIdOrderByCreatedAtDesc(String companyId);
    List<Problem> findAllByOrderByCreatedAtDesc();
}
