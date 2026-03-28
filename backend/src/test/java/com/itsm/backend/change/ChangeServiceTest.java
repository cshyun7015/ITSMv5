package com.itsm.backend.change;

import com.itsm.backend.notification.NotificationService;
import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChangeServiceTest {

    @Mock private ChangeRepository changeRepository;
    @Mock private CompanyRepository companyRepository;
    @Mock private UserRepository userRepository;
    @Mock private NotificationService notificationService;
    @Mock private ChangeMapper changeMapper;

    @InjectMocks
    private ChangeService changeService;

    private Company testCompany;
    private User testUser;

    @BeforeEach
    void setUp() {
        testCompany = new Company();
        testCompany.setCompanyId("TEST_CO");
        
        testUser = new User();
        testUser.setUserId("test_user");
    }

    @Test
    @DisplayName("변경 요청 생성 시 초기 상태가 CHG_DRAFT로 설정되어야 함")
    void createChange_InitialStatus() {
        // Given
        Change change = new Change();
        change.setTitle("Test Title");

        when(companyRepository.findById("TEST_CO")).thenReturn(Optional.of(testCompany));
        when(userRepository.findById("test_user")).thenReturn(Optional.of(testUser));
        when(changeRepository.save(any(Change.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(changeMapper.toResponse(any(Change.class))).thenAnswer(invocation -> {
            Change c = invocation.getArgument(0);
            return ChangeResponse.builder().status(c.getStatus()).build();
        });

        // When
        ChangeResponse response = changeService.createChange(change, "TEST_CO", "test_user");

        // Then
        assertEquals("CHG_DRAFT", response.getStatus());
        verify(changeRepository, times(1)).save(any(Change.class));
    }

    @Test
    @DisplayName("상태 변경 시 알림이 전송되어야 함")
    void updateStatus_SendsNotification() {
        // Given
        Change existing = new Change();
        existing.setId(1L);
        existing.setTitle("Test Change");
        existing.setCompanyId("TEST_CO");
        existing.setRequester(testUser);

        when(changeRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(changeRepository.save(any(Change.class))).thenReturn(existing);

        // When
        changeService.updateStatus(1L, "CHG_AUTHORIZATION", "TEST_CO", "ROLE_USER");

        // Then
        assertEquals("CHG_AUTHORIZATION", existing.getStatus());
        verify(notificationService, times(1)).sendNotification(eq(testUser), anyString(), anyString(), eq("INFO"));
    }

    @Test
    @DisplayName("변경 요청 수정 시 필드들이 올바르게 업데이트되어야 함")
    void updateChange_FieldsUpdated() {
        // Given
        Change existing = new Change();
        existing.setId(1L);
        existing.setTitle("Old Title");

        Change updates = new Change();
        updates.setTitle("New Title");
        updates.setRollbackPlan("Rollback procedure...");

        when(changeRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(changeRepository.save(any(Change.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(changeMapper.toResponse(any(Change.class))).thenAnswer(invocation -> {
            Change c = invocation.getArgument(0);
            return ChangeResponse.builder().title(c.getTitle()).rollbackPlan(c.getRollbackPlan()).build();
        });

        // When
        ChangeResponse response = changeService.updateChange(1L, updates);

        // Then
        assertEquals("New Title", response.getTitle());
        assertEquals("Rollback procedure...", response.getRollbackPlan());
    }
}
