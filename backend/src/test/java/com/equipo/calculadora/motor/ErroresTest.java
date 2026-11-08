// Historia KAN-6: Detectar operaciones inválidas
package com.equipo.calculadora.motor;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class ErroresTest {

    @ParameterizedTest
    @ValueSource(strings = {"8/0", "0/0", "5/0.0", "1+8/0"})
    void divisionEntreCero(String operacion) {
        assertEquals("Error: división entre cero", mensajeDe(operacion));
    }

    // Termina en operador: falta el número que sigue
    @ParameterizedTest
    @ValueSource(strings = {"8*", "5-", "-", "5*-", "2^"})
    void operacionIncompleta(String operacion) {
        assertEquals("Operación incompleta", mensajeDe(operacion));
    }

    // Potencias sin valor definido
    @ParameterizedTest
    @ValueSource(strings = {"0^-1", "-8^0.5"})
    void resultadoIndefinido(String operacion) {
        assertEquals("Error: resultado indefinido", mensajeDe(operacion));
    }

    private static String mensajeDe(String operacion) {
        return assertThrows(IllegalArgumentException.class, () -> MotorCalculo.calcular(operacion)).getMessage();
    }
}
