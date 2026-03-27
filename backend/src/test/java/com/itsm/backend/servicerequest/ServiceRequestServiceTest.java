package com.itsm.backend.servicerequest;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.servicecatalog.ServiceCatalog;
import com.itsm.backend.servicecatalog.ServiceCatalogRepository;
import com.itsm.backend.notification.NotificationService;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
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
class ServiceRequestServiceTest {

    @Mock private ServiceRequestRepository serviceRequestRepository;
    @Mock private ServiceCatalogRepository serviceCatalogRepository;
    @Mock private UserRepository userRepository;
    @Mock private NotificationService notificationService;
    @Mock private ServiceRequestMapper mapper;

    @InjectMocks
    private ServiceRequestService serviceRequestService;

    @Test
    void createRequest_Success() {
        // Given
        String userId = "user1";
        CreateServiceRequestDTO dto = new CreateServiceRequestDTO();
        dto.setCatalogId(1L);
        dto.setTitle("Laptop Request");
        dto.setPriority("HIGH");

        Company company = new Company();
        company.setCompanyId("C1");
        
        User user = new User();
        user.setUserId(userId);
        user.setCompany(company);

        ServiceCatalog catalog = new ServiceCatalog();
        catalog.setId(1L);
        catalog.setCatalogName("Laptop");

        ServiceRequest savedRequest = new ServiceRequest();
        savedRequest.setId(100L);
        savedRequest.setStatus("OPEN");

        ServiceRequestResponse response = ServiceRequestResponse.builder()
                .id(100L)
                .status("OPEN")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(serviceCatalogRepository.findById(1L)).thenReturn(Optional.of(catalog));
        when(serviceRequestRepository.save(any(ServiceRequest.class))).thenReturn(savedRequest);
        when(mapper.toResponse(any(ServiceRequest.class))).thenReturn(response);

        // When
        ServiceRequestResponse result = serviceRequestService.createRequest(userId, dto);

        // Then
        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals("OPEN", result.getStatus());
        verify(serviceRequestRepository, times(1)).save(any(ServiceRequest.class));
    }
}
