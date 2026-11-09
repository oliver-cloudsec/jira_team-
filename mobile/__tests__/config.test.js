// Historia KAN-11: Requerimientos no funcionales (rendimiento y compatibilidad)
// Verifica la compatibilidad mínima de HU-03 y HU-04 en app.json.
const { expo } = require('../app.json');
const props = expo.plugins.find((p) => p[0] === 'expo-build-properties')[1];

test('Android 10 o superior (API 29)', () => {
  expect(props.android.minSdkVersion).toBeGreaterThanOrEqual(29);
});

// 16.4 es lo mínimo que acepta la versión de Expo que usamos (con 15.1 la app no arranca).
test('iOS 16.4 o superior', () => {
  expect(parseFloat(props.ios.deploymentTarget)).toBeGreaterThanOrEqual(16.4);
});

test('funciona en iPad', () => {
  expect(expo.ios.supportsTablet).toBe(true);
});
