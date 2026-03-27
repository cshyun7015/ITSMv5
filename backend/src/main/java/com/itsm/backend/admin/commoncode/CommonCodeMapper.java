package com.itsm.backend.admin.commoncode;

import org.springframework.stereotype.Component;

@Component
public class CommonCodeMapper {
    public CommonCodeResponse toResponse(CommonCode code) {
        return CommonCodeResponse.builder()
                .codeId(code.getCodeId())
                .groupCode(code.getGroupCode())
                .codeName(code.getCodeName())
                .sortOrder(code.getSortOrder())
                .isUse(code.getIsUse())
                .build();
    }
}
