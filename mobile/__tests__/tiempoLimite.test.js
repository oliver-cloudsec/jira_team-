// Historia KAN-11: Requerimientos no funcionales (rendimiento y compatibilidad)
import { calcular } from '../src/api';

afterEach(() => jest.restoreAllMocks());

test('si el servidor no responde a tiempo, avisa y no se queda esperando', async () => {
  jest.useFakeTimers();
  try {
    // fetch que nunca responde, pero se cancela cuando se le avisa con 'signal'
    jest.spyOn(global, 'fetch').mockImplementation(
      (_url, { signal }) =>
        new Promise((_ok, rechazar) =>
          signal.addEventListener('abort', () =>
            rechazar(Object.assign(new Error('cancelado'), { name: 'AbortError' }))
          )
        )
    );
    const prueba = expect(calcular('8+2')).rejects.toThrow('El servidor tardó demasiado en responder');
    await jest.advanceTimersByTimeAsync(5000);
    await prueba;
  } finally {
    jest.useRealTimers();
  }
});
