package com.itsm.backend.sla;

import com.itsm.backend.auth.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/slas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SlaController {
    private final SlaService slaService;

    @GetMapping
    public List<SlaResponse> getSlas() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();
        
        if ("ROLE_ADMIN".equals(role)) {
            return slaService.getAllSlas();
        } else {
            return slaService.getSlasByCompany(companyId);
        }
    }

    @GetMapping("/{id}")
    public SlaResponse getSla(@PathVariable Long id) {
        return slaService.getSla(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SlaResponse createSla(@Valid @RequestBody Sla slaRequest) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return slaService.createSla(slaRequest, companyId);
    }

    @PutMapping("/{id}")
    public SlaResponse updateSla(@PathVariable Long id, @Valid @RequestBody Sla request) {
        return slaService.updateSla(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSla(@PathVariable Long id) {
        slaService.deleteSla(id);
    }
}
