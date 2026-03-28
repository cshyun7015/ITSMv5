package com.itsm.backend.sla;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class SlaServiceTest {
    @Autowired
    private SlaService slaService;

    @Test
    public void testCreateAndGetSla() {
        Sla sla = new Sla();
        sla.setName("E-Commerce Web SLA");
        sla.setCustomerName("Retail Corp");
        sla.setStatus(SlaStatus.SLA_ACTIVE);
        sla.setServiceHours("24x7");
        sla.setStartDate(LocalDateTime.now());
        sla.setEndDate(LocalDateTime.now().plusYears(1));

        SlaMetric metric = new SlaMetric();
        metric.setName("Availability");
        metric.setTargetValue(99.9);
        metric.setUnit("%");
        sla.getMetrics().add(metric); // Use list directly

        SlaResponse saved = slaService.createSla(sla, "system");
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("E-Commerce Web SLA");
        assertThat(saved.getMetrics()).hasSize(1);

        SlaResponse fetched = slaService.getSla(saved.getId());
        assertThat(fetched.getCustomerName()).isEqualTo("Retail Corp");
    }

    @Test
    public void testUpdateSla() {
        Sla sla = new Sla();
        sla.setName("Initial SLA");
        sla.setCustomerName("Test Customer");
        SlaResponse saved = slaService.createSla(sla, "system");

        Sla updateRequest = new Sla();
        updateRequest.setName("Updated SLA Name");
        updateRequest.setCustomerName("Updated Customer");
        updateRequest.setStatus(SlaStatus.SLA_EXPIRED);
        
        SlaResponse updated = slaService.updateSla(saved.getId(), updateRequest);
        assertThat(updated.getName()).isEqualTo("Updated SLA Name");
        assertThat(updated.getStatus()).isEqualTo(SlaStatus.SLA_EXPIRED);
    }
}
