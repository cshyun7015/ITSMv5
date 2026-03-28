package com.itsm.backend.incident;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
import com.itsm.backend.notification.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock private IncidentRepository incidentRepository;
    @Mock private UserRepository userRepository;
    @Mock private NotificationService notificationService;
    @Mock private IncidentMapper incidentMapper;

    @InjectMocks
    private IncidentService incidentService;

    private User testUser;
    private Company testCompany;

    @BeforeEach
    void setUp() {
        testCompany = new Company();
        testCompany.setCompanyId("TEST_CO");
        testCompany.setCompanyName("Test Company");

        testUser = new User();
        testUser.setUserId("test_user");
        testUser.setUserName("Test User");
        testUser.setCompany(testCompany);
    }

    @Test
    @DisplayName("장애 생성 시 우선순위가 올바르게 계산되어야 함")
    void createIncident_PriorityCalculation() {
        // Given
        when(userRepository.findById("test_user")).thenReturn(Optional.of(testUser));
        when(incidentRepository.save(any(Incident.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(incidentMapper.toResponse(any(Incident.class))).thenAnswer(invocation -> {
            Incident inc = invocation.getArgument(0);
            return IncidentResponse.builder().priority(inc.getPriority()).status(inc.getStatus()).build();
        });

        // When & Then
        // 1. High Urgency + High Impact -> Critical
        IncidentResponse res1 = incidentService.createIncident("test_user", "Title", "Desc", "High", "High", "CAT", "Portal");
        assertEquals("Critical", res1.getPriority());

        // 2. High Urgency + Medium Impact -> High
        IncidentResponse res2 = incidentService.createIncident("test_user", "Title", "Desc", "High", "Medium", "CAT", "Portal");
        assertEquals("High", res2.getPriority());

        // 3. Low Urgency + Low Impact -> Low
        IncidentResponse res3 = incidentService.createIncident("test_user", "Title", "Desc", "Low", "Low", "CAT", "Portal");
        assertEquals("Low", res3.getPriority());
    }

    @Test
    @DisplayName("장애 업데이트 시 상태가 RESOLVED로 변경되면 해결일시가 설정되어야 함")
    void updateIncident_StatusResolved() {
        // Given
        Incident incident = new Incident();
        incident.setId(1L);
        incident.setStatus("INC_OPEN");
        
        when(incidentRepository.findById(1L)).thenReturn(Optional.of(incident));
        when(incidentRepository.save(any(Incident.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(incidentMapper.toResponse(any(Incident.class))).thenAnswer(invocation -> {
            Incident inc = invocation.getArgument(0);
            return IncidentResponse.builder().id(inc.getId()).status(inc.getStatus()).resolvedAt(inc.getResolvedAt()).build();
        });

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", "INC_RESOLVED");

        // When
        IncidentResponse result = incidentService.updateIncident(1L, updates);

        // Then
        assertEquals("INC_RESOLVED", result.getStatus());
        assertNotNull(result.getResolvedAt());
        verify(incidentRepository, times(1)).save(any(Incident.class));
    }

    @Test
    @DisplayName("존재하지 않는 장애 조회 시 예외가 발생해야 함")
    void getIncident_NotFound() {
        // Given
        when(incidentRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> incidentService.getIncident(99L));
    }

    @Test
    @DisplayName("장애 삭제가 성공해야 함")
    void deleteIncident_Success() {
        // When
        incidentService.deleteIncident(1L);

        // Then
        verify(incidentRepository, times(1)).deleteById(1L);
    }
}
