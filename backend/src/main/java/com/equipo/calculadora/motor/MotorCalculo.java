// Historia KAN-1: Realizar operaciones básicas (también KAN-3 y KAN-7)
package com.equipo.calculadora.motor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Motor de cálculo: resuelve operaciones como "8+2", "1.5*3" o "-4+6--2".
 * Si la operación no es válida lanza IllegalArgumentException con un mensaje para el usuario.
 */
public class MotorCalculo {

    // Un número: entero ("8"), decimal ("1.5") o con punto al inicio/final (".5", "1."),
    // con un signo "-" opcional pegado al inicio. Ese "-" es el signo del número (KAN-7).
    private static final String NUMERO = "-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)";
    private static final String OPERADOR = "[+\\-*/^]";

    // Forma válida: un número y luego cualquier cantidad de "operador número".
    // Así "5--3" vale (5 menos -3), pero "5---3" o "5-" no.
    private static final Pattern VALIDA =
            Pattern.compile("^" + NUMERO + "(?:" + OPERADOR + NUMERO + ")*$");

    // Para recorrerla pieza por pieza: primero un número, después pares operador+número.
    private static final Pattern PIEZA =
            Pattern.compile("^(" + NUMERO + ")|(" + OPERADOR + ")(" + NUMERO + ")");

    public static String calcular(String expresion) {
        String texto = expresion == null ? "" : expresion.trim();
        if (!VALIDA.matcher(texto).matches()) {
            throw new IllegalArgumentException("Operación inválida");
        }

        // Separamos la operación en dos listas: los números y los operadores entre ellos.
        List<Double> numeros = new ArrayList<>();
        List<Character> operadores = new ArrayList<>();
        Matcher m = PIEZA.matcher(texto);
        while (m.find()) {
            if (m.group(1) != null) {
                numeros.add(Double.parseDouble(m.group(1)));
            } else {
                operadores.add(m.group(2).charAt(0));
                numeros.add(Double.parseDouble(m.group(3)));
            }
        }

        // Prioridad normal: primero potencias (de derecha a izquierda), luego * y /, luego + y -.
        for (int i = operadores.size() - 1; i >= 0; i--) {
            if (operadores.get(i) == '^') resolver(numeros, operadores, i);
        }
        pasada(numeros, operadores, "*/");
        pasada(numeros, operadores, "+-");

        // Máximo 5 decimales, y se quitan los ceros sobrantes (4.00000 -> 4).
        return BigDecimal.valueOf(numeros.get(0)).setScale(5, RoundingMode.HALF_UP)
                .stripTrailingZeros().toPlainString();
    }

    // Resuelve, de izquierda a derecha, los operadores que estén en 'grupo' (por ejemplo multiplicar y dividir).
    private static void pasada(List<Double> numeros, List<Character> operadores, String grupo) {
        int i = 0;
        while (i < operadores.size()) {
            if (grupo.indexOf(operadores.get(i)) >= 0) resolver(numeros, operadores, i);
            else i++;
        }
    }

    /** Calcula el operador en la posición i con sus dos números y deja solo el resultado. */
    private static void resolver(List<Double> numeros, List<Character> operadores, int i) {
        char operador = operadores.remove(i);
        double b = numeros.remove(i + 1);
        numeros.set(i, aplicar(operador, numeros.get(i), b));
    }

    private static double aplicar(char operador, double a, double b) {
        if (operador == '/' && b == 0) {
            throw new IllegalArgumentException("No se puede dividir entre cero");
        }
        double r = switch (operador) {
            case '+' -> a + b;
            case '-' -> a - b;
            case '*' -> a * b;
            case '/' -> a / b;
            default -> Math.pow(a, b); // '^'
        };
        // Ejemplos: 9^9999999 se vuelve infinito; -8^0.5 no existe entre los números reales.
        if (Double.isInfinite(r)) throw new IllegalArgumentException("El resultado es demasiado grande");
        if (Double.isNaN(r)) throw new IllegalArgumentException("El resultado no es un número real");
        return r;
    }
}