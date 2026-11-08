// Historia KAN-4: Interfaz de la calculadora (también KAN-1, KAN-12, KAN-13 y KAN-14)
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Los botones van en una cuadrícula: dígitos 0-9, punto decimal, operadores, borrar y "=".
const FILAS = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '^', '+'],
  ['borrar', '='],
];

const OPERADORES = ['+', '-', '*', '/', '^'];

// KAN-13: en pantalla se ven × ÷ −, pero al backend se le manda * / - (lo que entiende el motor).
const SIMBOLO = { '*': '×', '/': '÷', '-': '−' };
const mostrar = (texto) => texto.replace(/[*/-]/g, (c) => SIMBOLO[c]);

// KAN-14: el botón de borrar se dibuja con el símbolo ⌫.
const etiqueta = (tecla) => (tecla === 'borrar' ? '⌫' : mostrar(tecla));

// KAN-1: el número que se está escribiendo es lo que queda después del último operador.
const numeroActual = (texto) => texto.split(/[+\-*/^]/).pop();

// 'calcular' es la función que resuelve la operación (App.js la toma de api.js, que le pregunta
// al backend). La recibimos por props para no mezclar la pantalla con la API.
export default function Calculadora({ calcular }) {
  const [entrada, setEntrada] = useState(''); // lo que el usuario va tecleando
  const [resultado, setResultado] = useState(''); // "operación = resultado" o un mensaje de error
  const [hayError, setHayError] = useState(false); // KAN-12: el mensaje de error se pinta en rojo

  // KAN-12: al pulsar "=" se calcula, se muestra el resultado y se limpia la captura.
  async function igual() {
    if (!calcular || !entrada) return; // sin nada capturado, "=" no hace nada
    const operacion = entrada;
    setEntrada('');
    try {
      const valor = await calcular(operacion);
      setResultado(`${mostrar(operacion)} = ${valor}`); // KAN-13: con los símbolos × ÷ −
      setHayError(false);
    } catch (error) {
      // Cualquier fallo (operación inválida, sin conexión...) se muestra sin cerrar la app.
      setResultado(error.message);
      setHayError(true);
    }
  }

  function pulsar(tecla) {
    if (tecla === '=') return igual();
    // KAN-14: borra solo el último carácter; si la captura está vacía, no pasa nada.
    if (tecla === 'borrar') return setEntrada((actual) => actual.slice(0, -1));
    // KAN-1: solo se permite un punto decimal por número; si ya hay uno, se ignora el nuevo.
    setEntrada((actual) =>
      tecla === '.' && numeroActual(actual).includes('.') ? actual : actual + tecla
    );
  }

  return (
    <View style={estilos.pantalla}>
      {/* Zona de arriba: primero lo que se escribe, abajo el resultado */}
      <View style={estilos.visor}>
        <Text testID="entrada" style={estilos.entrada} numberOfLines={1} adjustsFontSizeToFit>
          {mostrar(entrada)}
        </Text>
        <Text
          testID="resultado"
          style={[estilos.resultado, hayError && estilos.error]}
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
              accessibilityLabel={tecla === 'borrar' ? 'Borrar último carácter' : mostrar(tecla)}
              onPress={() => pulsar(tecla)}
              style={({ pressed }) => [
                estilos.boton,
                OPERADORES.includes(tecla) && estilos.operador,
                tecla === 'borrar' && estilos.borrar,
                tecla === '=' && estilos.igual,
                pressed && estilos.presionado,
              ]}
            >
              <Text style={estilos.textoBoton}>{etiqueta(tecla)}</Text>
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
  error: { color: '#ff6b6b' },
  fila: { flex: 1, flexDirection: 'row' },
  boton: {
    flex: 1,
    minHeight: 56, // KAN-13: mínimo cómodo para el dedo (las guías piden 44 pt o más)
    margin: 6,
    borderRadius: 16,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  operador: { backgroundColor: '#f09a37' },
  borrar: { backgroundColor: '#5a5a5a' },
  igual: { backgroundColor: '#2e9e5b', flex: 2 }, // el "=" ocupa más lugar que los otros botones de su fila
  presionado: { opacity: 0.6 },
  textoBoton: { color: '#fff', fontSize: 32 },
});
