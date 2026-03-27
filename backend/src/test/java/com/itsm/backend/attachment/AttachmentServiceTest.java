package com.itsm.backend.attachment;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttachmentServiceTest {

    @Mock
    private AttachmentRepository attachmentRepository;

    @Mock
    private UserRepository userRepository;

    private AttachmentService attachmentService;

    private final String uploadDir = "./test-attachments";

    @BeforeEach
    void setUp() {
        attachmentService = new AttachmentService(attachmentRepository, userRepository, uploadDir);
        attachmentService.init();
    }

    @Test
    void storeFile_Success() throws IOException {
        // Given
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "Hello".getBytes());
        String uploaderId = "user1";
        String companyId = "tenant1";
        
        Company company = new Company();
        company.setCompanyId(companyId);
        User uploader = new User();
        uploader.setUserId(uploaderId);
        uploader.setCompany(company);

        when(userRepository.findById(uploaderId)).thenReturn(Optional.of(uploader));
        when(attachmentRepository.save(any(Attachment.class))).thenAnswer(i -> i.getArguments()[0]);

        // When
        Attachment stored = attachmentService.storeFile(file, "SERVICE_REQUEST", "SR-001", uploaderId, companyId);

        // Then
        assertNotNull(stored);
        assertEquals("test.txt", stored.getOriginalName());
        assertTrue(Files.exists(Paths.get(stored.getFilePath())));
        
        // Cleanup
        Files.deleteIfExists(Paths.get(stored.getFilePath()));
    }

    @Test
    void loadFileAsResource_Success() throws IOException {
        // Given
        String attachmentId = "uuid-123";
        Path tempFile = Files.createTempFile("itsm-test", ".txt");
        Files.writeString(tempFile, "Content");

        Attachment attachment = new Attachment();
        attachment.setId(attachmentId);
        attachment.setFilePath(tempFile.toString());

        when(attachmentRepository.findById(attachmentId)).thenReturn(Optional.of(attachment));

        // When
        Resource resource = attachmentService.loadFileAsResource(attachmentId);

        // Then
        assertTrue(resource.exists());
        assertEquals(tempFile.toUri(), resource.getURI());

        // Cleanup
        Files.deleteIfExists(tempFile);
    }
}
