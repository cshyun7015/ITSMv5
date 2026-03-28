package com.itsm.backend.release;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReleaseServiceTest {

    @Mock private ReleaseRepository releaseRepository;
    @Mock private CompanyRepository companyRepository;
    @Mock private ReleaseMapper releaseMapper;

    @InjectMocks
    private ReleaseService releaseService;

    private Company testCompany;

    @BeforeEach
    void setUp() {
        testCompany = new Company();
        testCompany.setCompanyId("TEST_CO");
    }

    @Test
    @DisplayName("릴리스 계획 생성 시 초기 상태가 REL_PLANNING으로 설정되어야 함")
    void createRelease_InitialStatus() {
        // Given
        Release release = new Release();
        release.setTitle("v1.0.0 Release");

        when(companyRepository.findById("TEST_CO")).thenReturn(Optional.of(testCompany));
        when(releaseRepository.save(any(Release.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(releaseMapper.toResponse(any(Release.class))).thenAnswer(invocation -> {
            Release r = invocation.getArgument(0);
            return ReleaseResponse.builder().status(r.getStatus()).build();
        });

        // When
        ReleaseResponse response = releaseService.createRelease(release, "TEST_CO");

        // Then
        assertEquals("REL_PLANNING", response.getStatus());
        verify(releaseRepository, times(1)).save(any(Release.class));
    }

    @Test
    @DisplayName("릴리스 상세 정보 수정 시 필드들이 올바르게 업데이트되어야 함")
    void updateRelease_FieldsUpdated() {
        // Given
        Release existing = new Release();
        existing.setId(1L);
        existing.setTitle("Old Title");

        Release updates = new Release();
        updates.setTitle("New v1.1.0");
        updates.setVersion("1.1.0");
        updates.setBackoutPlan("Rollback steps...");

        when(releaseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(releaseRepository.save(any(Release.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(releaseMapper.toResponse(any(Release.class))).thenAnswer(invocation -> {
            Release r = invocation.getArgument(0);
            return ReleaseResponse.builder()
                    .title(r.getTitle())
                    .version(r.getVersion())
                    .backoutPlan(r.getBackoutPlan())
                    .build();
        });

        // When
        ReleaseResponse response = releaseService.updateRelease(1L, updates);

        // Then
        assertEquals("New v1.1.0", response.getTitle());
        assertEquals("1.1.0", response.getVersion());
        assertEquals("Rollback steps...", response.getBackoutPlan());
    }

    @Test
    @DisplayName("상태 변경 시 권한 체크 및 상태 업데이트가 정상 동작해야 함")
    void updateStatus_Authorized() {
        // Given
        Release existing = new Release();
        existing.setId(1L);
        existing.setCompanyId("TEST_CO");

        when(releaseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(releaseRepository.save(any(Release.class))).thenReturn(existing);

        // When
        releaseService.updateStatus(1L, "REL_ROLLOUT", "TEST_CO", "ROLE_USER");

        // Then
        assertEquals("REL_ROLLOUT", existing.getStatus());
        verify(releaseRepository, times(1)).save(existing);
    }
}
