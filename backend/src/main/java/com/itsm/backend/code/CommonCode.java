package com.itsm.backend.code;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tb_common_code")
@Getter @Setter
public class CommonCode {
    @Id
    private String codeId;
    
    private String groupCode;
    private String codeName;
    private Integer sortOrder;
    private Boolean isUse;
}
