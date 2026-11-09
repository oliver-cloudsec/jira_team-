// Historia KAN-1: Realizar operaciones básicas
package com.equipo.calculadora.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CalculadoraController.class)
class CalculadoraControllerTest {

    @Autowired
    MockMvc mvc;

    private org.springframework.test.web.servlet.ResultActions enviar(String expresion) throws Exception {
        return mvc.perform(post("/api/calcular")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"expresion\":\"" + expresion + "\"}"));
    }

    @Test
    void operacionValidaDevuelveResultado() throws Exception {
        enviar("8+2").andExpect(status().isOk()).andExpect(jsonPath("$.resultado").value("10"));
    }

    @Test
    void operacionInvalidaDevuelveError400() throws Exception {
        // el texto exacto de cada mensaje se revisa en las pruebas del motor
        enviar("8/0").andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").exists());
    }
}