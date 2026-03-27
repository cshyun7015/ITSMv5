package com.itsm.backend.asset;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class AssetResponse {
    private Long id;
    private String name;
    private String type;
    private String status;
    private String serialNumber;
    private String model;
    private String manufacturer;
    private String location;
    private String specifications;
    private String ownerId;
    private String ownerName;
    private String companyId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
