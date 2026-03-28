package com.itsm.backend.release;

import com.itsm.backend.auth.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/releases")
@RequiredArgsConstructor
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

    @GetMapping("/{id}")
    public ReleaseResponse getRelease(@PathVariable Long id) {
        return releaseService.getRelease(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReleaseResponse createRelease(@RequestBody Release releaseRequest) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return releaseService.createRelease(releaseRequest, companyId);
    }

    @PutMapping("/{id}")
    public ReleaseResponse updateRelease(@PathVariable Long id, @RequestBody Release releaseRequest) {
        return releaseService.updateRelease(id, releaseRequest);
    }

    @PatchMapping("/{id}/status")
    public ReleaseResponse updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        String role = SecurityUtils.getCurrentRole();
        String status = payload.get("status");
        return releaseService.updateStatus(id, status, companyId, role);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRelease(@PathVariable Long id) {
        releaseService.deleteRelease(id);
    }
}
