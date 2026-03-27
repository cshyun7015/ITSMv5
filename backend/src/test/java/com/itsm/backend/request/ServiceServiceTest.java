package com.itsm.backend.request;

import com.itsm.backend.servicecatalog.ServiceCatalog;
import com.itsm.backend.servicecatalog.ServiceCatalogRepository;
import com.itsm.backend.notification.NotificationService;
import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.User;
import com.itsm.backend.tenant.UserRepository;
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
class ServiceRequestServiceTest {

    @Mock private ServiceRequestRepository requestRepository;
    @Mock private ServiceCatalogRepository catalogRepository;
    @Mock private UserRepository userRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks
    private ServiceRequestService serviceRequestService;

    @Test
    void createRequest_Success() {
        // Given
        String userId = "user1";
        Map<String, Object> payload = new HashMap<>();
        payload.put("catalogId", "1");
        payload.put("title", "New Laptop");
        payload.put("description", "Need for dev work");
        payload.put("formData", "{}");

        Tenant tenant = new Tenant();
        tenant.setTenantId("T1");
        User user = new User();
        user.setUserId(userId);
        user.setTenant(tenant);

        ServiceCatalog catalog = new ServiceCatalog();
        catalog.setId(1L);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(catalogRepository.findById(1L)).thenReturn(Optional.of(catalog));
        when(requestRepository.save(any(ServiceRequest.class))).thenAnswer(i -> {
            ServiceRequest sr = (ServiceRequest) i.getArguments()[0];
            sr.setId(100L);
            return sr;
        });

        // When
        ServiceRequest result = serviceRequestService.createRequest(userId, payload);

        // Then
        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals("REQ_STATUS_OPEN", result.getStatus());
        verify(notificationService, times(1)).sendNotification(eq(user), anyString(), anyString(), eq("SUCCESS"));
    }
}
