package com.itsm.backend.admin.commoncode;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/codes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommonCodeController {

    private final CommonCodeService commonCodeService;

    @GetMapping
    public ResponseEntity<Page<CommonCodeResponse>> getCodes(
            @PageableDefault(size = 15, sort = {"groupCode", "sortOrder"}, direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(commonCodeService.getCodes(search, pageable));
    }

    @GetMapping("/group/{groupCode}")
    public ResponseEntity<List<CommonCodeResponse>> getCodesByGroup(@PathVariable String groupCode) {
        return ResponseEntity.ok(commonCodeService.getCodesByGroup(groupCode));
    }

    @PostMapping
    public ResponseEntity<CommonCodeResponse> saveCode(@RequestBody CommonCodeRequest request) {
        return ResponseEntity.ok(commonCodeService.saveCode(request));
    }

    @PatchMapping("/{codeId}")
    public ResponseEntity<CommonCodeResponse> updateCode(@PathVariable String codeId, @RequestBody CommonCodeRequest request) {
        request.setCodeId(codeId);
        return ResponseEntity.ok(commonCodeService.saveCode(request));
    }

    @DeleteMapping("/{codeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCode(@PathVariable String codeId) {
        commonCodeService.deleteCode(codeId);
    }
}
