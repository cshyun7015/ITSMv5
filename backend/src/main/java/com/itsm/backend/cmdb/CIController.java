package com.itsm.backend.cmdb;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cmdb")
@CrossOrigin(origins = "*")
public class CIController {

    private final CIService ciService;

    public CIController(CIService ciService) {
        this.ciService = ciService;
    }

    @GetMapping
    public List<ConfigurationItem> getCIs() {
        return ciService.getAllCIs();
    }

    @GetMapping("/{id}")
    public ConfigurationItem getCI(@PathVariable Long id) {
        return ciService.getCIById(id);
    }

    @PostMapping
    public ConfigurationItem createCI(@RequestBody ConfigurationItem ci) {
        return ciService.createCI(ci);
    }
}
