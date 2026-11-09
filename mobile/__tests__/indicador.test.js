// Historia KAN-11: Requerimientos no funcionales (rendimiento y compatibilidad)
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import Calculadora from '../src/Calculadora';

const pulsar = (...teclas) =>
  teclas.forEach((t) => fireEvent.press(screen.getByTestId(`tecla-${t}`)));

test('si el cálculo tarda más de 200 ms muestra el indicador de progreso', async () => {
  jest.useFakeTimers();
  try {
    let responder;
    const calcular = jest.fn(() => new Promise((ok) => (responder = ok)));
    render(<Calculadora calcular={calcular} />);
    pulsar('7', '+', '3', '=');
    expect(screen.queryByTestId('cargando')).toBeNull(); // todavía no pasan 200 ms
    await act(async () => jest.advanceTimersByTimeAsync(200));
    expect(screen.getByTestId('cargando')).toBeTruthy();
    await act(async () => responder('10'));
    expect(screen.queryByTestId('cargando')).toBeNull(); // al llegar el resultado desaparece
    expect(screen.getByTestId('resultado')).toHaveTextContent('7+3 = 10');
  } finally {
    jest.useRealTimers();
  }
});

test('si responde rápido, el indicador nunca aparece', async () => {
  const calcular = jest.fn().mockResolvedValue('10');
  render(<Calculadora calcular={calcular} />);
  pulsar('7', '+', '3', '=');
  await screen.findByText('7+3 = 10');
  expect(screen.queryByTestId('cargando')).toBeNull();
});

test('AC quita el indicador de progreso', async () => {
  jest.useFakeTimers();
  try {
    render(<Calculadora calcular={() => new Promise(() => {})} />);
    pulsar('7', '+', '3', '=');
    await act(async () => jest.advanceTimersByTimeAsync(200));
    expect(screen.getByTestId('cargando')).toBeTruthy();
    pulsar('AC');
    expect(screen.queryByTestId('cargando')).toBeNull();
  } finally {
    jest.useRealTimers();
  }
});
