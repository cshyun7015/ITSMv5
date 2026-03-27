package com.itsm.backend.asset.controller;

import com.itsm.backend.asset.dto.AssetResponse;
import com.itsm.backend.asset.entity.Asset;
import com.itsm.backend.asset.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    public List<AssetResponse> getAssets() {
        return assetService.getAllAssets();
    }

    @GetMapping("/{id}")
    public AssetResponse getAsset(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    @PostMapping
    public AssetResponse createAsset(@RequestBody Asset asset) {
        return assetService.createAsset(asset);
    }

    @PutMapping("/{id}")
    public AssetResponse updateAsset(@PathVariable Long id, @RequestBody Asset asset) {
        return assetService.updateAsset(id, asset);
    }

    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }
}
