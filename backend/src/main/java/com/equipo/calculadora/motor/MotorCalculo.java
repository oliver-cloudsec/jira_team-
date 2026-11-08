// Historia KAN-1: Realizar operaciones básicas (también KAN-3)
package com.equipo.calculadora.motor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Motor de cálculo: resuelve una operación con dos números, por ejemplo "8+2" o "1.5*3".
 * Si la operación no es válida lanza IllegalArgumentException con un mensaje para el usuario.
 */
public class MotorCalculo {

    // Un número: entero ("8"), decimal ("1.5") o con punto al inicio/final (".5", "1.")
    private static final String NUMERO = "(?:\\d+(?:\\.\\d*)?|\\.\\d+)";
    // número, un operador, número. KAN-3: el primer número puede ser negativo, para poder
    // encadenar un resultado negativo (por ejemplo "-6+3" después de 2-8).
    private static final Pattern OPERACION =
            Pattern.compile("^(-?" + NUMERO + ")([+\\-*/^])(" + NUMERO + ")$");

    public static String calcular(String expresion) {
        Matcher m = OPERACION.matcher(expresion == null ? "" : expresion.trim());
        if (!m.matches()) {
            throw new IllegalArgumentException("Operación inválida");
        }

        double a = Double.parseDouble(m.group(1));
        double b = Double.parseDouble(m.group(3));

        double resultado = switch (m.group(2).charAt(0)) {
            case '+' -> a + b;
            case '-' -> a - b;
            case '*' -> a * b;
            case '/' -> {
                if (b == 0) throw new IllegalArgumentException("No se puede dividir entre cero");
                yield a / b;
            }
            default -> Math.pow(a, b); // '^'
        };

        // Un resultado enorme (por ejemplo 9^9999999) se vuelve infinito: lo tratamos como error.
        if (!Double.isFinite(resultado)) {
            throw new IllegalArgumentException("El resultado es demasiado grande");
        }

        // Máximo 5 decimales, y se quitan los ceros sobrantes (4.00000 -> 4).
        return BigDecimal.valueOf(resultado).setScale(5, RoundingMode.HALF_UP)
                .stripTrailingZeros().toPlainString();
    }
}
