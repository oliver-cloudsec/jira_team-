// Historia KAN-11: Requerimientos no funcionales (rendimiento y compatibilidad)
package com.equipo.calculadora.rendimiento;

import static org.junit.jupiter.api.Assertions.*;

import com.equipo.calculadora.motor.MotorCalculo;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

class MedidorTest {

    @Test
    void calculaPromedioYPercentil95() {
        List<Double> tiempos = new ArrayList<>();
        for (int i = 1; i <= 100; i++) tiempos.add((double) i); // 1..100 ms

        Medidor.Reporte r = Medidor.desde(tiempos);

        assertEquals(50.5, r.promedioMs(), 0.001);
        assertEquals(95.0, r.p95Ms(), 0.001);
        assertTrue(r.cumple());
    }

    @Test
    void rechazaLiberacionSiUnaOperacionExcedeUnSegundo() {
        Medidor.Reporte r = Medidor.desde(List.of(10.0, 20.0, 1500.0));
        assertFalse(r.cumple());
    }

    @Test
    void laOperacionCumpleElLimiteYGeneraReporte() throws Exception {
        // Cada vuelta resuelve las cinco operaciones con el motor real.
        Medidor.Reporte r = Medidor.medir(() -> {
            for (String op : new String[] {"8+2", "8-2", "8*2", "8/3", "2^3"}) MotorCalculo.calcular(op);
        }, 1000);

        Path archivo = Path.of("target", "reporte-rendimiento.txt");
        Files.createDirectories(archivo.getParent());
        Files.writeString(archivo, r.toString());

        assertTrue(r.cumple(), "Excede 1 s: " + r);
    }
}
