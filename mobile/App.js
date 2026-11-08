// Historia KAN-4: Interfaz de la calculadora (conexión con la API: KAN-1)
import { SafeAreaView } from 'react-native-safe-area-context';
import { calcular } from './src/api';
import Calculadora from './src/Calculadora';

// SafeAreaView evita que la calculadora quede tapada por el notch o la barra inferior.
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
      <Calculadora calcular={calcular} />
    </SafeAreaView>
  );
}