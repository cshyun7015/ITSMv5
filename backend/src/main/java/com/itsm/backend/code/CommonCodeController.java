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
    public ResponseEntity<List<CommonCode>> getAllCodes() {
        return ResponseEntity.ok(service.getAllCodes());
    }

    @GetMapping("/group/{groupCode}")
    public ResponseEntity<List<CommonCode>> getCodesByGroup(@PathVariable String groupCode) {
        return ResponseEntity.ok(service.getCodesByGroup(groupCode));
    }

    @PostMapping
    public ResponseEntity<CommonCode> saveCode(@RequestBody CommonCode code) {
        return ResponseEntity.ok(service.saveCode(code));
    }

    @DeleteMapping("/{codeId}")
    public ResponseEntity<Void> deleteCode(@PathVariable String codeId) {
        service.deleteCode(codeId);
        return ResponseEntity.noContent().build();
    }
}
