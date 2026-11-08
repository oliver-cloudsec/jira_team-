// Historia KAN-14: Botón para borrar el último carácter
import { fireEvent, render, screen } from '@testing-library/react-native';
import Calculadora from '../src/Calculadora';

const pulsar = (...teclas) =>
  teclas.forEach((t) => fireEvent.press(screen.getByTestId(`tecla-${t}`)));

test('borrar quita solo el último carácter', () => {
  render(<Calculadora />);
  pulsar('1', '2', '+', '3', 'borrar');
  expect(screen.getByTestId('entrada')).toHaveTextContent('12+');
  pulsar('borrar', 'borrar');
  expect(screen.getByTestId('entrada')).toHaveTextContent('1');
});

test('borrar con la captura vacía no hace nada ni marca error', () => {
  render(<Calculadora />);
  pulsar('borrar', 'borrar');
  expect(screen.getByTestId('entrada')).toHaveTextContent('');
  expect(screen.getByTestId('resultado')).toHaveTextContent('');
});

test('borrar no toca el resultado anterior', async () => {
  const calcular = jest.fn().mockResolvedValue('10');
  render(<Calculadora calcular={calcular} />);
  pulsar('7', '+', '3', '=');
  await screen.findByText('7+3 = 10');
  pulsar('5', 'borrar');
  expect(screen.getByTestId('resultado')).toHaveTextContent('7+3 = 10');
});
