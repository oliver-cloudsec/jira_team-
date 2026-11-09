// Historia KAN-1: Realizar operaciones básicas
package com.equipo.calculadora.motor;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

class OperacionesBasicasTest {

    // Los ejemplos de la historia, más algunos de redondeo a 5 decimales
    @ParameterizedTest
    @CsvSource({
        "8+2,10", "8-2,6", "8*2,16", "8/2,4", "2^3,8", "1.5+2.5,4",
        "1/3,0.33333", "2/3,0.66667", "0.1+0.2,0.3", ".5+1,1.5", "2-8,-6"
    })
    void resuelveBien(String operacion, String esperado) {
        assertEquals(esperado, MotorCalculo.calcular(operacion));
    }

    // Operaciones inválidas (incluida la división entre cero): lanzan un error en vez de tumbar el servidor
    @ParameterizedTest
    @ValueSource(strings = {"8+", "+8", "", "abc", "1..2+3", "8//2", "8/0", "0/0", "9^9999999"})
    void rechazaOperacionesInvalidas(String operacion) {
        assertThrows(IllegalArgumentException.class, () -> MotorCalculo.calcular(operacion));
    }
}