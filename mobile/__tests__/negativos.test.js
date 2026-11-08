// Historia KAN-7: Operaciones con números negativos
import { fireEvent, render, screen } from '@testing-library/react-native';
import Calculadora from '../src/Calculadora';

const pulsar = (...teclas) =>
  teclas.forEach((t) => fireEvent.press(screen.getByTestId(`tecla-${t}`)));

test('se puede capturar el signo negativo al inicio y después de un operador', async () => {
  const calcular = jest.fn().mockResolvedValue('-17');
  render(<Calculadora calcular={calcular} />);
  pulsar('-', '2', '+', '5', '*', '-', '3');
  expect(screen.getByTestId('entrada')).toHaveTextContent('−2+5×−3'); // con el signo − a la vista
  pulsar('=');
  await screen.findByText('−2+5×−3 = −17'); // y también en el resultado
  expect(calcular).toHaveBeenCalledWith('-2+5*-3');
});

test('un resultado negativo se puede reutilizar en una operación encadenada', async () => {
  const calcular = jest.fn().mockResolvedValueOnce('-2').mockResolvedValueOnce('-1');
  render(<Calculadora calcular={calcular} />);
  pulsar('-', '5', '+', '3', '=');
  await screen.findByText('−5+3 = −2');
  pulsar('+', '1');
  expect(screen.getByTestId('entrada')).toHaveTextContent('−2+1');
  pulsar('=');
  await screen.findByText('−2+1 = −1');
  expect(calcular).toHaveBeenLastCalledWith('-2+1');
});

test('si el backend rechaza los signos, se muestra el error y la app sigue', async () => {
  const calcular = jest.fn().mockRejectedValue(new Error('Operación inválida'));
  render(<Calculadora calcular={calcular} />);
  pulsar('5', '-', '-', '3', '-', '=');
  expect(await screen.findByText('Operación inválida')).toBeTruthy();
  pulsar('2');
  expect(screen.getByTestId('entrada')).toHaveTextContent('2');
});