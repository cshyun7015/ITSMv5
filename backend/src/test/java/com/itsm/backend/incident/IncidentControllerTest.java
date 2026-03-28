package com.itsm.backend.incident;

import com.itsm.backend.auth.SecurityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentControllerTest {

    @Mock
    private IncidentService incidentService;

    @InjectMocks
    private IncidentController incidentController;

    private MockedStatic<SecurityUtils> mockedSecurityUtils;

    @BeforeEach
    void setUp() {
        mockedSecurityUtils = mockStatic(SecurityUtils.class);
        mockedSecurityUtils.when(SecurityUtils::getCurrentUserId).thenReturn("test_user");
        mockedSecurityUtils.when(SecurityUtils::getCurrentRole).thenReturn("ROLE_ADMIN");
        mockedSecurityUtils.when(SecurityUtils::getCurrentCompanyId).thenReturn("TEST_CO");
    }

    @AfterEach
    void tearDown() {
        mockedSecurityUtils.close();
    }

    @Test
    @DisplayName("장애 목록 조회가 성공해야 함")
    void getIncidents_Success() {
        // Given
        when(incidentService.getAllIncidents()).thenReturn(Collections.emptyList());

        // When
        List<IncidentResponse> result = incidentController.getIncidents();

        // Then
        assertNotNull(result);
        verify(incidentService, times(1)).getAllIncidents();
    }

    @Test
    @DisplayName("장애 단건 조회가 성공해야 함")
    void getIncident_Success() {
        // Given
        IncidentResponse response = IncidentResponse.builder().id(1L).title("Test").build();
        when(incidentService.getIncident(1L)).thenReturn(response);

        // When
        IncidentResponse result = incidentController.getIncident(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test", result.getTitle());
    }

    @Test
    @DisplayName("장애 생성이 성공해야 함")
    void createIncident_Success() {
        // Given
        IncidentResponse response = IncidentResponse.builder().id(1L).title("New Incident").build();
        when(incidentService.createIncident(anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString()))
                .thenReturn(response);

        Map<String, Object> payload = new HashMap<>();
        payload.put("title", "New Incident");
        payload.put("description", "Test description");

        // When
        IncidentResponse result = incidentController.createIncident(payload);

        // Then
        assertNotNull(result);
        assertEquals("New Incident", result.getTitle());
        verify(incidentService, times(1)).createIncident(anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
    }
}
