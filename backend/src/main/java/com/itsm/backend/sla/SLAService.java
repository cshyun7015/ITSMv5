package com.itsm.backend.sla;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SlaService {
    private final SlaRepository slaRepository;

    public List<SlaResponse> getAllSlas() {
        return slaRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<SlaResponse> getSlasByCompany(String companyId) {
        return slaRepository.findByCompanyId(companyId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public SlaResponse getSla(Long id) {
        Sla sla = slaRepository.findById(id).orElseThrow(() -> new RuntimeException("SLA not found"));
        return mapToResponse(sla);
    }

    @Transactional
    public SlaResponse createSla(Sla slaRequest, String companyId) {
        slaRequest.setCompanyId(companyId);
        if (slaRequest.getMetrics() != null) {
            slaRequest.getMetrics().forEach(m -> m.setSla(slaRequest));
        }
        Sla saved = slaRepository.save(slaRequest);
        return mapToResponse(saved);
    }

    @Transactional
    public SlaResponse updateSla(Long id, Sla request) {
        Sla sla = slaRepository.findById(id).orElseThrow(() -> new RuntimeException("SLA not found"));
        sla.setName(request.getName());
        sla.setDescription(request.getDescription());
        sla.setCustomerName(request.getCustomerName());
        sla.setStatus(request.getStatus());
        sla.setServiceHours(request.getServiceHours());
        sla.setStartDate(request.getStartDate());
        sla.setEndDate(request.getEndDate());
        
        // Sync metrics
        if (request.getMetrics() != null) {
            sla.getMetrics().clear();
            request.getMetrics().forEach(m -> {
                m.setSla(sla);
                sla.getMetrics().add(m);
            });
        }

        return mapToResponse(slaRepository.save(sla));
    }

    @Transactional
    public void deleteSla(Long id) {
        slaRepository.deleteById(id);
    }

    private SlaResponse mapToResponse(Sla sla) {
        SlaResponse res = new SlaResponse();
        res.setId(sla.getId());
        res.setName(sla.getName());
        res.setDescription(sla.getDescription());
        res.setCustomerName(sla.getCustomerName());
        res.setStatus(sla.getStatus());
        res.setServiceHours(sla.getServiceHours());
        res.setStartDate(sla.getStartDate());
        res.setEndDate(sla.getEndDate());
        res.setCompanyId(sla.getCompanyId());
        res.setCreatedAt(sla.getCreatedAt());
        res.setUpdatedAt(sla.getUpdatedAt());
        
        if (sla.getMetrics() != null) {
            res.setMetrics(sla.getMetrics().stream().map(m -> {
                SlaMetricResponse mr = new SlaMetricResponse();
                mr.setId(m.getId());
                mr.setName(m.getName());
                mr.setDescription(m.getDescription());
                mr.setTargetValue(m.getTargetValue());
                mr.setUnit(m.getUnit());
                mr.setWarningThreshold(m.getWarningThreshold());
                mr.setCriticalThreshold(m.getCriticalThreshold());
                mr.setFrequency(m.getFrequency());
                mr.setActive(m.isActive());
                return mr;
            }).collect(Collectors.toList()));
        }
        return res;
    }
}
