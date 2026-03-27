package com.itsm.backend.admin.commoncode;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommonCodeService {

    private final CommonCodeRepository commonCodeRepository;
    private final CommonCodeMapper commonCodeMapper;

    public Page<CommonCodeResponse> getCodes(String search, Pageable pageable) {
        Page<CommonCode> codes;
        if (search == null || search.isEmpty()) {
            codes = commonCodeRepository.findAll(pageable);
        } else {
            codes = commonCodeRepository.findByCodeNameContainingIgnoreCaseOrCodeIdContainingIgnoreCaseOrGroupCodeContainingIgnoreCase(search, search, search, pageable);
        }
        return codes.map(commonCodeMapper::toResponse);
    }

    public List<CommonCodeResponse> getCodesByGroup(String groupCode) {
        return commonCodeRepository.findByGroupCodeAndIsUseOrderBySortOrderAsc(groupCode, true)
                .stream()
                .map(commonCodeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommonCodeResponse saveCode(CommonCodeRequest request) {
        CommonCode code = commonCodeRepository.findById(request.getCodeId())
                .orElse(new CommonCode());
        
        code.setCodeId(request.getCodeId());
        code.setGroupCode(request.getGroupCode());
        code.setCodeName(request.getCodeName());
        code.setSortOrder(request.getSortOrder());
        code.setIsUse(request.getIsUse() != null ? request.getIsUse() : true);
        
        CommonCode saved = commonCodeRepository.save(code);
        return commonCodeMapper.toResponse(saved);
    }

    @Transactional
    public void deleteCode(String codeId) {
        commonCodeRepository.deleteById(codeId);
    }
}
