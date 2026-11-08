// Historia KAN-2: Funcionalidad del botón AC
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import Calculadora from '../src/Calculadora';

const pulsar = (...teclas) =>
  teclas.forEach((t) => fireEvent.press(screen.getByTestId(`tecla-${t}`)));

test('AC limpia la captura y el resultado', async () => {
  const calcular = jest.fn().mockResolvedValue('10');
  render(<Calculadora calcular={calcular} />);
  pulsar('7', '+', '3', '=');
  await screen.findByText('7+3 = 10');
  pulsar('5', 'AC');
  expect(screen.getByTestId('entrada')).toHaveTextContent('');
  expect(screen.getByTestId('resultado')).toHaveTextContent('');
});

test('AC hace desaparecer el mensaje de error', async () => {
  const calcular = jest.fn().mockRejectedValue(new Error('Operación inválida'));
  render(<Calculadora calcular={calcular} />);
  pulsar('8', '+', '=');
  await screen.findByText('Operación inválida');
  pulsar('AC');
  expect(screen.getByTestId('resultado')).toHaveTextContent('');
});

test('AC con la calculadora vacía no cambia nada ni marca error', () => {
  render(<Calculadora />);
  pulsar('AC', 'AC');
  expect(screen.getByTestId('entrada')).toHaveTextContent('');
  expect(screen.getByTestId('resultado')).toHaveTextContent('');
});

test('si se pulsa AC mientras se calcula, el resultado tardío no aparece', async () => {
  let responder;
  const calcular = jest.fn(() => new Promise((ok) => (responder = ok)));
  render(<Calculadora calcular={calcular} />);
  pulsar('7', '+', '3', '=', 'AC');
  await act(async () => responder('10'));
  expect(screen.getByTestId('resultado')).toHaveTextContent('');
});