package com.itsm.backend.admin.commoncode;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommonCodeRequest {
    private String codeId;
    private String groupCode;
    private String codeName;
    private Integer sortOrder;
    private Boolean isUse;
}
