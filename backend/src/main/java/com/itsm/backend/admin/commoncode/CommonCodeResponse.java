package com.itsm.backend.admin.commoncode;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommonCodeResponse {
    private String codeId;
    private String groupCode;
    private String codeName;
    private Integer sortOrder;
    private Boolean isUse;
}
