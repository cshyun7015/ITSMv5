package com.itsm.backend.change.repository;

import com.itsm.backend.change.entity.Change;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChangeRepository extends JpaRepository<Change, Long> {
    List<Change> findByCompanyIdOrderByCreatedAtDesc(String companyId);
    List<Change> findAllByOrderByCreatedAtDesc();
}
