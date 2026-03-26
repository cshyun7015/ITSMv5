package com.itsm.backend.code;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/codes")
@RequiredArgsConstructor
public class CommonCodeController {
    private final CommonCodeService service;

    @GetMapping
    public org.springframework.http.ResponseEntity<org.springframework.data.domain.Page<CommonCode>> getAllCodes(
            @org.springframework.data.web.PageableDefault(size = 15, sort = {"groupCode", "sortOrder"}, direction = org.springframework.data.domain.Sort.Direction.ASC) org.springframework.data.domain.Pageable pageable,
            @RequestParam(defaultValue = "") String search) {
        if (search == null || search.isEmpty()) {
            return org.springframework.http.ResponseEntity.ok(service.getAllCodes(pageable));
        }
        return org.springframework.http.ResponseEntity.ok(service.searchCodes(search, pageable));
    }

    @GetMapping("/group/{groupCode}")
    public ResponseEntity<List<CommonCode>> getCodesByGroup(@PathVariable String groupCode) {
        return ResponseEntity.ok(service.getCodesByGroup(groupCode));
    }

    @PostMapping
    public ResponseEntity<CommonCode> saveCode(@RequestBody CommonCode code) {
        return ResponseEntity.ok(service.saveCode(code));
    }

    @PatchMapping("/{codeId}")
    public ResponseEntity<CommonCode> updateCode(@PathVariable String codeId, @RequestBody CommonCode code) {
        code.setCodeId(codeId);
        return ResponseEntity.ok(service.saveCode(code));
    }

    @DeleteMapping("/{codeId}")
    public ResponseEntity<Void> deleteCode(@PathVariable String codeId) {
        service.deleteCode(codeId);
        return ResponseEntity.noContent().build();
    }
}
