package com.itsm.backend.release.controller;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.release.dto.ReleaseResponse;
import com.itsm.backend.release.entity.Release;
import com.itsm.backend.release.service.ReleaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/releases")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReleaseController {

    private final ReleaseService releaseService;

    @GetMapping
    public List<ReleaseResponse> getReleases() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();

        if ("ROLE_ADMIN".equals(role)) {
            return releaseService.getAllReleases();
        } else {
            return releaseService.getReleasesByCompany(companyId);
        }
    }

    @PostMapping
    public ReleaseResponse createRelease(@RequestBody Release release) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return releaseService.createRelease(release, companyId);
    }

    @PatchMapping("/{id}/status")
    public ReleaseResponse updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        String role = SecurityUtils.getCurrentRole();
        String status = payload.get("status");
        return releaseService.updateStatus(id, status, companyId, role);
    }
}
