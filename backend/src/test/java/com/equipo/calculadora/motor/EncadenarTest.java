// Historia KAN-3: Operaciones consecuentes
package com.equipo.calculadora.motor;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class EncadenarTest {

    // Para encadenar, el primer número puede venir negativo o ya redondeado del resultado anterior
    @ParameterizedTest
    @CsvSource({"-6+3,-3", "-1.5*2,-3", "7.5*2,15", "10/3,3.33333", "0.33333*3,0.99999"})
    void usaElResultadoAnterior(String operacion, String esperado) {
        assertEquals(esperado, MotorCalculo.calcular(operacion));
    }
}
