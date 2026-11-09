// Historia KAN-1: Realizar operaciones básicas (también KAN-11: tiempo límite de la petición)
import { Platform } from 'react-native';

// El emulador de Android ve la computadora como 10.0.2.2; el simulador de iPhone, como localhost.
// Si prueban en un celular real, cambien el host por la IP de la computadora que corre el backend.
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const URL = `http://${HOST}:8080/api/calcular`;

// Si el servidor no responde en este tiempo, se cancela y se avisa al usuario.
const LIMITE_MS = 5000;

// Manda la operación al backend. Devuelve el resultado o lanza un Error con un mensaje para mostrar.
export async function calcular(expresion) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), LIMITE_MS);
  try {
    let respuesta;
    try {
      respuesta = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expresion }),
        signal: controlador.signal,
      });
    } catch (error) {
      throw new Error(
        error.name === 'AbortError'
          ? 'El servidor tardó demasiado en responder'
          : 'No se pudo conectar con el servidor'
      );
    }
    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok || datos.resultado === undefined) throw new Error(datos.error || 'Operación inválida');
    return datos.resultado;
  } finally {
    clearTimeout(temporizador); // ya respondió (o falló): el temporizador sobra
  }
}
