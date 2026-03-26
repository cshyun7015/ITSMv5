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

    public List<CommonCode> getAllCodes() {
        return repository.findAll();
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
