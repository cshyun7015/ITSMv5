package com.itsm.backend.code;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommonCodeService {
    private final CommonCodeRepository repository;

    public org.springframework.data.domain.Page<CommonCode> getAllCodes(org.springframework.data.domain.Pageable pageable) {
        return repository.findAll(pageable);
    }

    public org.springframework.data.domain.Page<CommonCode> searchCodes(String keyword, org.springframework.data.domain.Pageable pageable) {
        return repository.findByCodeNameContainingIgnoreCaseOrCodeIdContainingIgnoreCaseOrGroupCodeContainingIgnoreCase(keyword, keyword, keyword, pageable);
    }

    public List<CommonCode> getCodesByGroup(String groupCode) {
        return repository.findByGroupCode(groupCode);
    }

    public CommonCode saveCode(CommonCode code) {
        return repository.save(code);
    }

    public void deleteCode(String codeId) {
        repository.deleteById(codeId);
    }
}
