package com.itsm.backend.attachment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, String> {
    List<Attachment> findByRelatedEntityTypeAndRelatedEntityId(String relatedEntityType, String relatedEntityId);
}
