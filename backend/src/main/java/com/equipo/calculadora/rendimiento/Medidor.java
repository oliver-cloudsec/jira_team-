// Historia KAN-11: Requerimientos no funcionales (rendimiento y compatibilidad)
package com.equipo.calculadora.rendimiento;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** Mide cuánto tarda una operación y calcula promedio y percentil 95 (HU-02). */
public class Medidor {

    /** Límite de RNF-02: ninguna operación debe pasar de 1 segundo. */
    public static final double LIMITE_MS = 1000;

    public record Reporte(double promedioMs, double p95Ms, double maxMs) {
        /** La liberación se aprueba solo si ninguna operación excede el límite. */
        public boolean cumple() {
            return maxMs < LIMITE_MS;
        }

        @Override
        public String toString() {
            return String.format("promedio=%.3f ms, p95=%.3f ms, max=%.3f ms, %s",
                    promedioMs, p95Ms, maxMs, cumple() ? "APROBADO" : "RECHAZADO");
        }
    }

    /** Ejecuta la operación 'veces' veces y devuelve el reporte de tiempos. */
    public static Reporte medir(Runnable operacion, int veces) {
        List<Double> tiempos = new ArrayList<>();
        for (int i = 0; i < veces; i++) {
            long inicio = System.nanoTime();
            operacion.run();
            tiempos.add((System.nanoTime() - inicio) / 1_000_000.0);
        }
        return desde(tiempos);
    }

    /** Calcula el reporte a partir de tiempos ya medidos (en milisegundos). */
    public static Reporte desde(List<Double> tiemposMs) {
        List<Double> orden = new ArrayList<>(tiemposMs);
        Collections.sort(orden);
        double promedio = orden.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        // Percentil 95: el valor bajo el cual queda el 95 % de las mediciones.
        int posicion = (int) Math.ceil(0.95 * orden.size()) - 1;
        return new Reporte(promedio, orden.get(posicion), orden.get(orden.size() - 1));
    }
}
