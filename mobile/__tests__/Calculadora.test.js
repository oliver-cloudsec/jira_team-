// Historia KAN-4: Interfaz de la calculadora
import { fireEvent, render, screen } from '@testing-library/react-native';
import Calculadora from '../src/Calculadora';

const pulsar = (...teclas) =>
  teclas.forEach((t) => fireEvent.press(screen.getByTestId(`tecla-${t}`)));

test('hay un botón para cada dígito, cada operador y "="', () => {
  render(<Calculadora />);
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '^', '='].forEach((t) =>
    expect(screen.getByTestId(`tecla-${t}`)).toBeTruthy()
  );
});

test('muestra la secuencia que el usuario va capturando', () => {
  render(<Calculadora />);
  pulsar('7', '+', '3', '^', '2');
  expect(screen.getByTestId('entrada')).toHaveTextContent('7+3^2');
});

test('existe el área de resultado y empieza vacía', () => {
  render(<Calculadora />);
  expect(screen.getByTestId('resultado')).toHaveTextContent('');
});
