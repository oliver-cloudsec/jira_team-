// Historia KAN-1: Realizar operaciones básicas
import { fireEvent, render, screen } from '@testing-library/react-native';
import Calculadora from '../src/Calculadora';

const pulsar = (...teclas) =>
  teclas.forEach((t) => fireEvent.press(screen.getByTestId(`tecla-${t}`)));

test('hay botón de punto decimal y solo se permite un punto por número', () => {
  render(<Calculadora />);
  pulsar('1', '.', '5', '.', '5', '+', '2', '.', '5', '.');
  // el segundo punto de "1.5" se ignora; "2.5" es otro número, así que sí admite su punto
  expect(screen.getByTestId('entrada')).toHaveTextContent('1.55+2.5');
});