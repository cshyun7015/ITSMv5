package com.itsm.backend.change;

import com.itsm.backend.auth.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/changes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChangeController {

    private final ChangeService changeService;

    @GetMapping
    public List<ChangeResponse> getChanges() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();

        if ("ROLE_ADMIN".equals(role)) {
            return changeService.getAllChanges();
        } else {
            return changeService.getChangesByCompany(companyId);
        }
    }

    @PostMapping
    public ChangeResponse createChange(@RequestBody Change changeRequest) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        String userId = SecurityUtils.getCurrentUserId();
        return changeService.createChange(changeRequest, companyId, userId);
    }

    @PatchMapping("/{id}/status")
    public ChangeResponse updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        String role = SecurityUtils.getCurrentRole();
        String status = payload.get("status");
        return changeService.updateStatus(id, status, companyId, role);
    }
}
