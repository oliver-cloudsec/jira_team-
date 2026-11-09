// Historia KAN-11: Requerimientos no funcionales (rendimiento y compatibilidad)
// Muestra un indicador de progreso si la operación tarda más de 200 ms (HU-01).
// 'mostrar' y 'ocultar' los pasa la pantalla (por ejemplo, para cambiar un estado).
async function conIndicador(operacion, mostrar, ocultar, esperaMs = 200) {
  const temporizador = setTimeout(mostrar, esperaMs);
  try {
    return await operacion();
  } finally {
    clearTimeout(temporizador); // si terminó rápido, el indicador nunca aparece
    ocultar();
  }
}

module.exports = { conIndicador };
