package com.itsm.backend.asset;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByCompany_CompanyId(String companyId);
    List<Asset> findByCompany_CompanyIdAndType(String companyId, String type);
    List<Asset> findAllByOrderByCreatedAtDesc();
}
