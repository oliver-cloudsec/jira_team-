// Historia KAN-6: Detectar operaciones inválidas
import { fireEvent, render, screen } from '@testing-library/react-native';
import Calculadora from '../src/Calculadora';

const pulsar = (...teclas) =>
  teclas.forEach((t) => fireEvent.press(screen.getByTestId(`tecla-${t}`)));

test('un operador nuevo reemplaza al anterior', () => {
  render(<Calculadora />);
  pulsar('8', '*', '+', '/');
  expect(screen.getByTestId('entrada')).toHaveTextContent('8÷');
});

test('después de un operador, "-" es el signo del número que sigue', () => {
  render(<Calculadora />);
  pulsar('8', '*', '-');
  expect(screen.getByTestId('entrada')).toHaveTextContent('8×−');
  pulsar('+'); // un operador distinto reemplaza al operador y a su signo
  expect(screen.getByTestId('entrada')).toHaveTextContent('8+');
});

test('no se pueden escribir tres signos seguidos', () => {
  render(<Calculadora />);
  pulsar('5', '-', '-', '-', '3');
  expect(screen.getByTestId('entrada')).toHaveTextContent('5−−3'); // el tercer − se ignora
});

test('sin ningún número solo se acepta el signo "-"', () => {
  render(<Calculadora />);
  pulsar('*', '+', '^');
  expect(screen.getByTestId('entrada')).toHaveTextContent('');
  pulsar('-');
  expect(screen.getByTestId('entrada')).toHaveTextContent('−');
});

test('muestra "Operación incompleta" y después del error se puede seguir', async () => {
  const calcular = jest.fn().mockRejectedValue(new Error('Operación incompleta'));
  render(<Calculadora calcular={calcular} />);
  pulsar('8', '*', '=');
  expect(await screen.findByText('Operación incompleta')).toBeTruthy();
  pulsar('+'); // no hay nada que continuar: no queda un operador suelto
  expect(screen.getByTestId('entrada')).toHaveTextContent('');
  pulsar('2');
  expect(screen.getByTestId('entrada')).toHaveTextContent('2');
});
