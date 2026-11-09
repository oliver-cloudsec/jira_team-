// Historia KAN-11: Requerimientos no funcionales (rendimiento y compatibilidad)
const { conIndicador } = require('../src/conIndicador');

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

const tarda = (ms) => new Promise((ok) => setTimeout(() => ok('listo'), ms));

test('no muestra el indicador si responde rápido', async () => {
  const mostrar = jest.fn(), ocultar = jest.fn();
  const p = conIndicador(() => tarda(100), mostrar, ocultar);
  await jest.advanceTimersByTimeAsync(100);
  expect(await p).toBe('listo');
  expect(mostrar).not.toHaveBeenCalled();
  expect(ocultar).toHaveBeenCalledTimes(1);
});

test('muestra el indicador a los 200 ms si tarda más', async () => {
  const mostrar = jest.fn(), ocultar = jest.fn();
  const p = conIndicador(() => tarda(500), mostrar, ocultar);
  await jest.advanceTimersByTimeAsync(200);
  expect(mostrar).toHaveBeenCalledTimes(1);
  await jest.advanceTimersByTimeAsync(300);
  await p;
  expect(ocultar).toHaveBeenCalledTimes(1);
});

test('oculta el indicador aunque la operación falle', async () => {
  const ocultar = jest.fn();
  await expect(conIndicador(() => Promise.reject(new Error('x')), jest.fn(), ocultar)).rejects.toThrow('x');
  expect(ocultar).toHaveBeenCalledTimes(1);
});
