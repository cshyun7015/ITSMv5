package com.itsm.backend.admin.company;

import com.itsm.backend.auth.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/companies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompanyAdminController {

    private final CompanyService companyService;

    private void assertAdmin() {
        if (!"ROLE_ADMIN".equals(SecurityUtils.getCurrentRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
        }
    }

    @GetMapping
    public Page<CompanyResponse> getCompanies(
            @PageableDefault(sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable,
            @RequestParam(defaultValue = "") String search) {
        assertAdmin();
        return companyService.getCompanies(search, pageable);
    }

    @PostMapping
    public CompanyResponse createCompany(@RequestBody CompanyRequest request) {
        assertAdmin();
        return companyService.createCompany(request);
    }

    @PatchMapping("/{companyId}")
    public CompanyResponse updateCompany(@PathVariable String companyId, @RequestBody CompanyRequest request) {
        assertAdmin();
        return companyService.updateCompany(companyId, request);
    }

    @DeleteMapping("/{companyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCompany(@PathVariable String companyId) {
        assertAdmin();
        companyService.deleteCompany(companyId);
    }
}
