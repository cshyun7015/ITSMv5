package com.itsm.backend.attachment;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final Path fileStorageLocation;

    public AttachmentService(AttachmentRepository attachmentRepository,
                             UserRepository userRepository,
                             @Value("${app.upload.dir:./data/attachments}") String uploadDir) {
        this.attachmentRepository = attachmentRepository;
        this.userRepository = userRepository;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public Attachment storeFile(MultipartFile file, String relatedEntityType, String relatedEntityId, String uploaderId, String companyId) {
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String uuid = UUID.randomUUID().toString();
        String targetFileName = uuid + fileExtension;

        try {
            if (originalFileName != null && originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(targetFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            User uploader = userRepository.findById(uploaderId).orElseThrow(() -> new RuntimeException("User not found"));
            Company company = uploader.getCompany();

            Attachment attachment = new Attachment();
            attachment.setId(uuid);
            attachment.setOriginalName(originalFileName);
            attachment.setFilePath(targetLocation.toString());
            attachment.setFileSize(file.getSize());
            attachment.setContentType(file.getContentType());
            attachment.setRelatedEntityType(relatedEntityType);
            attachment.setRelatedEntityId(relatedEntityId);
            attachment.setUploadedBy(uploader);
            attachment.setCompany(company);

            return attachmentRepository.save(attachment);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String attachmentId) {
        try {
            Attachment attachment = attachmentRepository.findById(attachmentId)
                    .orElseThrow(() -> new RuntimeException("Attachment not found with id " + attachmentId));

            Path filePath = Paths.get(attachment.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + attachmentId);
            }
        } catch (Exception ex) {
            throw new RuntimeException("File not found " + attachmentId, ex);
        }
    }

    public Attachment getAttachmentInfo(String attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
    }

    public List<Attachment> getAttachmentsForEntity(String entityType, String entityId) {
        return attachmentRepository.findByRelatedEntityTypeAndRelatedEntityId(entityType, entityId);
    }
}
