// Historia KAN-4: Interfaz de la calculadora
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Los botones van en una cuadrícula: dígitos 0-9, operadores y "=".
const FILAS = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '^', '+'],
  ['='],
];

const OPERADORES = ['+', '-', '*', '/', '^'];

// 'calcular' será la función que resuelva la operación. La recibimos por props para no mezclar
// la pantalla con la API (se conecta en KAN-1 y se usa al pulsar "=" en KAN-12).
export default function Calculadora({ calcular }) {
  const [entrada, setEntrada] = useState(''); // lo que el usuario va tecleando
  const [resultado, setResultado] = useState(''); // "operación = resultado" o un mensaje de error

  function pulsar(tecla) {
    if (tecla === '=') return; // el cálculo al pulsar "=" llega en KAN-12
    setEntrada((actual) => actual + tecla);
  }

  return (
    <View style={estilos.pantalla}>
      {/* Zona de arriba: primero lo que se escribe, abajo el resultado */}
      <View style={estilos.visor}>
        <Text testID="entrada" style={estilos.entrada} numberOfLines={1} adjustsFontSizeToFit>
          {entrada}
        </Text>
        <Text
          testID="resultado"
          style={estilos.resultado}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {resultado}
        </Text>
      </View>

      {FILAS.map((fila) => (
        <View key={fila[0]} style={estilos.fila}>
          {fila.map((tecla) => (
            <Pressable
              key={tecla}
              testID={`tecla-${tecla}`}
              accessibilityRole="button"
              accessibilityLabel={tecla}
              onPress={() => pulsar(tecla)}
              style={({ pressed }) => [
                estilos.boton,
                OPERADORES.includes(tecla) && estilos.operador,
                tecla === '=' && estilos.igual,
                pressed && estilos.presionado,
              ]}
            >
              <Text style={estilos.textoBoton}>{tecla}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, padding: 12, backgroundColor: '#111' },
  visor: { flex: 2, justifyContent: 'flex-end', padding: 12 },
  entrada: { color: '#fff', fontSize: 48, textAlign: 'right' },
  resultado: { color: '#9aa', fontSize: 28, textAlign: 'right', minHeight: 36 },
  fila: { flex: 1, flexDirection: 'row' },
  boton: {
    flex: 1,
    margin: 6,
    borderRadius: 16,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  operador: { backgroundColor: '#f09a37' },
  igual: { backgroundColor: '#2e9e5b' },
  presionado: { opacity: 0.6 },
  textoBoton: { color: '#fff', fontSize: 32 },
});
