package com.itsm.backend.asset.mapper;

import com.itsm.backend.asset.entity.Asset;
import com.itsm.backend.asset.dto.AssetResponse;
import org.springframework.stereotype.Component;

@Component
public class AssetMapper {
    public AssetResponse toResponse(Asset asset) {
        if (asset == null) return null;
        return AssetResponse.builder()
                .id(asset.getId())
                .name(asset.getName())
                .type(asset.getType())
                .status(asset.getStatus())
                .serialNumber(asset.getSerialNumber())
                .model(asset.getModel())
                .manufacturer(asset.getManufacturer())
                .location(asset.getLocation())
                .specifications(asset.getSpecifications())
                .ownerId(asset.getOwner() != null ? asset.getOwner().getUserId() : null)
                .ownerName(asset.getOwner() != null ? asset.getOwner().getUserName() : null)
                .companyId(asset.getCompany() != null ? asset.getCompany().getCompanyId() : null)
                .createdAt(asset.getCreatedAt())
                .updatedAt(asset.getUpdatedAt())
                .build();
    }
}
