// Historia KAN-1: Realizar operaciones básicas
package com.equipo.calculadora.api;

import com.equipo.calculadora.motor.MotorCalculo;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** API REST: la app manda la operación y recibe el resultado (o un mensaje de error). */
@RestController
@RequestMapping("/api")
public class CalculadoraController {

    // Lo que manda la app: {"expresion": "8+2"}
    public record Peticion(String expresion) {}

    @PostMapping("/calcular")
    public ResponseEntity<Map<String, String>> calcular(@RequestBody Peticion peticion) {
        try {
            return ResponseEntity.ok(Map.of("resultado", MotorCalculo.calcular(peticion.expresion())));
        } catch (IllegalArgumentException e) {
            // 400 = la operación es inválida; el servidor sigue funcionando normal
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}