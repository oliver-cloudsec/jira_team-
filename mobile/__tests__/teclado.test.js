// Historia KAN-13: Restringir la captura a números y operadores válidos
import { fireEvent, render, screen } from '@testing-library/react-native';
import Calculadora from '../src/Calculadora';

const pulsar = (...teclas) =>
  teclas.forEach((t) => fireEvent.press(screen.getByTestId(`tecla-${t}`)));
import { StyleSheet } from 'react-native';

test('el teclado solo tiene dígitos, punto, operadores y botones de control', () => {
  render(<Calculadora />);
  const permitidas = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '^', '=', 'AC', 'borrar'];
  const teclas = screen.getAllByTestId(/^tecla-/).map((b) => b.props.testID.replace('tecla-', ''));
  teclas.forEach((t) => expect(permitidas).toContain(t));
});

test('en pantalla se ven × ÷ − pero al calcular se manda * / -', async () => {
  const calcular = jest.fn().mockResolvedValue('15');
  render(<Calculadora calcular={calcular} />);
  pulsar('8', '*', '4', '/', '2', '-', '1');
  expect(screen.getByTestId('entrada')).toHaveTextContent('8×4÷2−1');
  pulsar('=');
  expect(await screen.findByText('8×4÷2−1 = 15')).toBeTruthy();
  expect(calcular).toHaveBeenCalledWith('8*4/2-1');
});

test('los botones tienen un tamaño cómodo para el dedo', () => {
  render(<Calculadora />);
  const estilo = StyleSheet.flatten(screen.getByTestId('tecla-7').props.style);
  expect(estilo.minHeight).toBeGreaterThanOrEqual(44);
});
