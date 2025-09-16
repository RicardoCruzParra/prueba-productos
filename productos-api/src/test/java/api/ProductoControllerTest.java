package api;

import org.evaluacion.model.Producto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc
class ProductoControllerTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    String token;

    @BeforeEach
    void login() throws Exception {
        var res = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"user\",\"password\":\"password\"}"))
                .andExpect(status().isOk()).andReturn();
        token = "Bearer " + om.readTree(res.getResponse().getContentAsString()).get("token").asText();
    }

    @Test
    void crearYListar() throws Exception {
        var p = new Producto(null,"Lápiz", 500.0);
        mvc.perform(post("/api/productos").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsString(p)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());

        mvc.perform(get("/api/productos").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Lápiz"));
    }
}