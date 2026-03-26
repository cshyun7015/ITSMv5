package com.itsm.backend.code;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommonCodeRepository extends JpaRepository<CommonCode, String> {
    List<CommonCode> findByGroupCode(String groupCode);
    Page<CommonCode> findByCodeNameContainingIgnoreCaseOrCodeIdContainingIgnoreCaseOrGroupCodeContainingIgnoreCase(String name, String id, String group, Pageable pageable);
}
