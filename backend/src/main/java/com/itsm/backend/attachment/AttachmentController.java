package com.itsm.backend.attachment;

import com.itsm.backend.auth.CompanyAwareAuthentication;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Attachment> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("relatedEntityType") String relatedEntityType,
            @RequestParam("relatedEntityId") String relatedEntityId,
            Authentication authentication) {

        String uploaderId = authentication.getName();
        String companyId = ((CompanyAwareAuthentication) authentication).getCompanyId();

        Attachment attachment = attachmentService.storeFile(file, relatedEntityType, relatedEntityId, uploaderId, companyId);
        return ResponseEntity.ok(attachment);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Attachment>> listAttachments(
            @RequestParam("relatedEntityType") String relatedEntityType,
            @RequestParam("relatedEntityId") String relatedEntityId) {

        List<Attachment> attachments = attachmentService.getAttachmentsForEntity(relatedEntityType, relatedEntityId);
        return ResponseEntity.ok(attachments);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id, HttpServletRequest request) {
        Resource resource = attachmentService.loadFileAsResource(id);
        Attachment attachmentInfo = attachmentService.getAttachmentInfo(id);

        String contentType = attachmentInfo.getContentType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachmentInfo.getOriginalName() + "\"")
                .body(resource);
    }
}
