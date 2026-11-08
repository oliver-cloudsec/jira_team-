// Historia KAN-3: Operaciones consecuentes
import { fireEvent, render, screen } from '@testing-library/react-native';
import Calculadora from '../src/Calculadora';

const pulsar = (...teclas) =>
  teclas.forEach((t) => fireEvent.press(screen.getByTestId(`tecla-${t}`)));

async function conResultado(valor) {
  const calcular = jest.fn().mockResolvedValue(valor);
  render(<Calculadora calcular={calcular} />);
  pulsar('6', '+', '6', '=');
  await screen.findByText(`6+6 = ${valor}`);
  return calcular;
}

test('después del resultado, un operador sigue con ese valor', async () => {
  await conResultado('12');
  pulsar('+', '3');
  expect(screen.getByTestId('entrada')).toHaveTextContent('12+3');
});

test('después del resultado, un dígito empieza una operación nueva', async () => {
  await conResultado('12');
  pulsar('5');
  expect(screen.getByTestId('entrada')).toHaveTextContent('5');
});

test('el resultado con decimales se conserva al encadenar', async () => {
  const calcular = await conResultado('7.5');
  pulsar('*', '2', '=');
  expect(calcular).toHaveBeenLastCalledWith('7.5*2');
});

test('se pueden encadenar varias operaciones seguidas', async () => {
  const calcular = jest.fn().mockResolvedValueOnce('2').mockResolvedValueOnce('4').mockResolvedValueOnce('12');
  render(<Calculadora calcular={calcular} />);
  pulsar('1', '+', '1', '=');
  await screen.findByText('1+1 = 2');
  pulsar('+', '2', '=');
  await screen.findByText('2+2 = 4');
  pulsar('*', '3', '=');
  await screen.findByText('4×3 = 12');
  expect(calcular).toHaveBeenNthCalledWith(3, '4*3');
});

test('después de AC ya no se puede encadenar el resultado anterior', async () => {
  await conResultado('12');
  pulsar('AC', '-');
  expect(screen.getByTestId('entrada')).toHaveTextContent('−'); // y no "12−"
});
