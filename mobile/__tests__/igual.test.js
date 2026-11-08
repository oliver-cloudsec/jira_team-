// Historia KAN-12: Calcular y mostrar el resultado al presionar igual
import { fireEvent, render, screen } from '@testing-library/react-native';
import Calculadora from '../src/Calculadora';

const pulsar = (...teclas) =>
  teclas.forEach((t) => fireEvent.press(screen.getByTestId(`tecla-${t}`)));

test('al pulsar "=" muestra operación y resultado, y limpia la captura', async () => {
  const calcular = jest.fn().mockResolvedValue('10');
  render(<Calculadora calcular={calcular} />);
  pulsar('7', '+', '3', '=');
  expect(await screen.findByText('7+3 = 10')).toBeTruthy();
  expect(calcular).toHaveBeenCalledWith('7+3');
  expect(screen.getByTestId('entrada')).toHaveTextContent('');
});

test('si la operación falla muestra el mensaje y la app sigue funcionando', async () => {
  const calcular = jest.fn().mockRejectedValue(new Error('Operación inválida'));
  render(<Calculadora calcular={calcular} />);
  pulsar('7', '+', '3', '=');
  expect(await screen.findByText('Operación inválida')).toBeTruthy();
  pulsar('2'); // se puede seguir capturando
  expect(screen.getByTestId('entrada')).toHaveTextContent('2');
});

test('"=" sin nada capturado no calcula', () => {
  const calcular = jest.fn();
  render(<Calculadora calcular={calcular} />);
  pulsar('=');
  expect(calcular).not.toHaveBeenCalled();
});
