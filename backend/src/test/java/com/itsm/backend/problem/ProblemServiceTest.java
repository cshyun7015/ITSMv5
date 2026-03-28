package com.itsm.backend.problem;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProblemServiceTest {

    @Mock private ProblemRepository problemRepository;
    @Mock private CompanyRepository companyRepository;
    @Mock private ProblemMapper problemMapper;

    @InjectMocks
    private ProblemService problemService;

    private Company testCompany;

    @BeforeEach
    void setUp() {
        testCompany = new Company();
        testCompany.setCompanyId("TEST_CO");
        testCompany.setCompanyName("Test Company");
    }

    @Test
    @DisplayName("문제 생성 시 우선순위가 올바르게 계산되어야 함")
    void createProblem_PriorityCalculation() {
        // Given
        Problem problem = new Problem();
        problem.setUrgency("High");
        problem.setImpact("High");

        when(companyRepository.findById("TEST_CO")).thenReturn(Optional.of(testCompany));
        when(problemRepository.save(any(Problem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(problemMapper.toResponse(any(Problem.class))).thenAnswer(invocation -> {
            Problem p = invocation.getArgument(0);
            return ProblemResponse.builder().priority(p.getPriority()).status(p.getStatus()).build();
        });

        // When
        ProblemResponse response = problemService.createProblem(problem, "TEST_CO");

        // Then
        assertEquals("Critical", response.getPriority());
        assertEquals("PRB_NEW", response.getStatus());
        verify(problemRepository, times(1)).save(any(Problem.class));
    }

    @Test
    @DisplayName("문제 상태가 RESOLVED로 변경될 때 해결 일시가 설정되어야 함")
    void updateProblem_StatusResolved() {
        // Given
        Problem existing = new Problem();
        existing.setId(1L);
        existing.setStatus("PRB_NEW");

        Problem updates = new Problem();
        updates.setStatus("PRB_RESOLVED");

        when(problemRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(problemRepository.save(any(Problem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(problemMapper.toResponse(any(Problem.class))).thenAnswer(invocation -> {
            Problem p = invocation.getArgument(0);
            return ProblemResponse.builder().status(p.getStatus()).resolvedAt(p.getResolvedAt()).build();
        });

        // When
        ProblemResponse response = problemService.updateProblem(1L, updates);

        // Then
        assertEquals("PRB_RESOLVED", response.getStatus());
        assertNotNull(response.getResolvedAt());
    }

    @Test
    @DisplayName("문제 삭제가 성공적으로 이루어져야 함")
    void deleteProblem_Success() {
        // When
        problemService.deleteProblem(1L);

        // Then
        verify(problemRepository, times(1)).deleteById(1L);
    }
}
