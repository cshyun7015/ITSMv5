package com.itsm.backend.problem.repository;

import com.itsm.backend.problem.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByCompanyCompanyIdOrderByCreatedAtDesc(String companyId);
    List<Problem> findAllByOrderByCreatedAtDesc();
}
