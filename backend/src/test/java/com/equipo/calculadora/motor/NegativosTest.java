// Historia KAN-7: Operaciones con números negativos
package com.equipo.calculadora.motor;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

class NegativosTest {

    // Negativos al inicio, después de un operador y mezclados (ejemplos de la historia)
    @ParameterizedTest
    @CsvSource({
        "-5+3,-2", "5*-3,-15", "-4+6--2,4", "-2.5+1.25,-1.25", "5--3,8", "-2/-4,0.5", "2^-1,0.5", "-2^2,4", "-0*5,0"
    })
    void operaConNegativos(String operacion, String esperado) {
        assertEquals(esperado, MotorCalculo.calcular(operacion));
    }

    // Varios números en una operación, con la prioridad normal (^, luego * /, luego + -)
    @ParameterizedTest
    @CsvSource({"1+2+3,6", "10-2-3,5", "8/2/2,2", "2+3*4,14", "2*3^2,18", "2^3^2,512"})
    void respetaLaPrioridad(String operacion, String esperado) {
        assertEquals(esperado, MotorCalculo.calcular(operacion));
    }

    // Secuencias de signos inválidas
    @ParameterizedTest
    @ValueSource(strings = {"5---3", "--3+1", "-+3", "5 - - - 3", "1+8/0", "-8^0.5"})
    void rechazaSignosInvalidos(String operacion) {
        assertThrows(IllegalArgumentException.class, () -> MotorCalculo.calcular(operacion));
    }
}