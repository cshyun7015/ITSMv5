package com.itsm.backend.asset;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final CompanyRepository companyRepository;
    private final AssetMapper assetMapper;

    public List<AssetResponse> getAllAssets() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();

        List<Asset> assets;
        if ("ROLE_ADMIN".equals(role)) {
            assets = assetRepository.findAllByOrderByCreatedAtDesc();
        } else {
            assets = assetRepository.findByCompany_CompanyId(companyId);
        }
        
        return assets.stream()
                .map(assetMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AssetResponse getAssetById(Long id) {
        return assetRepository.findById(id)
                .map(assetMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
    }

    @Transactional
    public AssetResponse createAsset(Asset asset) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        Company company = companyRepository.findById(companyId).orElseThrow();
        asset.setCompany(company);
        return assetMapper.toResponse(assetRepository.save(asset));
    }

    @Transactional
    public AssetResponse updateAsset(Long id, Asset details) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        
        // Company Check
        String companyId = SecurityUtils.getCurrentCompanyId();
        String role = SecurityUtils.getCurrentRole();
        String assetCompanyId = asset.getCompany() != null ? asset.getCompany().getCompanyId() : null;
        
        if (!"ROLE_ADMIN".equals(role) && (assetCompanyId == null || !assetCompanyId.equals(companyId))) {
            throw new RuntimeException("Unauthorized to update this asset");
        }
        
        asset.setName(details.getName());
        asset.setType(details.getType());
        asset.setStatus(details.getStatus());
        asset.setLocation(details.getLocation());
        asset.setOwner(details.getOwner());
        asset.setSerialNumber(details.getSerialNumber());
        asset.setModel(details.getModel());
        asset.setManufacturer(details.getManufacturer());
        asset.setSpecifications(details.getSpecifications());
        
        return assetMapper.toResponse(assetRepository.save(asset));
    }

    @Transactional
    public void deleteAsset(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        
        // Company Check
        String companyId = SecurityUtils.getCurrentCompanyId();
        String role = SecurityUtils.getCurrentRole();
        String assetCompanyId = asset.getCompany() != null ? asset.getCompany().getCompanyId() : null;
        
        if (!"ROLE_ADMIN".equals(role) && (assetCompanyId == null || !assetCompanyId.equals(companyId))) {
            throw new RuntimeException("Unauthorized to delete this asset");
        }
        
        assetRepository.delete(asset);
    }
}
