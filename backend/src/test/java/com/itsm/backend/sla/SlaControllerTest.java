package com.itsm.backend.sla;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itsm.backend.config.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SlaController.class)
@Import(GlobalExceptionHandler.class)
public class SlaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SlaService slaService;

    @Test
    @WithMockUser(roles = "USER")
    public void createSla_shouldReturn400_asUser_whenFieldsAreBlank() throws Exception {
        Sla invalidSla = new Sla();

        mockMvc.perform(post("/api/slas")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidSla)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void createSla_shouldReturn400_asAdmin_whenFieldsAreBlank() throws Exception {
        Sla invalidSla = new Sla();

        mockMvc.perform(post("/api/slas")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidSla)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    public void createSla_shouldReturnUnauthorized_whenNotLoggedIn() throws Exception {
        Sla sla = new Sla();
        sla.setName("Test");
        sla.setCustomerName("Customer");

        mockMvc.perform(post("/api/slas")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sla)))
                .andExpect(status().isUnauthorized()); // Should be 401 or 403 depending on config, but mostly 401
    }
}
