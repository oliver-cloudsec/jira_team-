// Historia KAN-1: Realizar operaciones básicas
import { calcular } from '../src/api';

afterEach(() => jest.restoreAllMocks());

const responder = (ok, cuerpo) =>
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok, json: async () => cuerpo });

test('devuelve el resultado que manda el backend', async () => {
  responder(true, { resultado: '10' });
  expect(await calcular('8+2')).toBe('10');
});

test('lanza el mensaje de error que manda el backend', async () => {
  responder(false, { error: 'Operación inválida' });
  await expect(calcular('8+')).rejects.toThrow('Operación inválida');
});

test('si no hay conexión avisa con un mensaje claro', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('network'));
  await expect(calcular('8+2')).rejects.toThrow('No se pudo conectar con el servidor');
});