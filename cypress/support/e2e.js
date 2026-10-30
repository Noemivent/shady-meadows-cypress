// Se carga antes de cada archivo de test: registra los comandos personalizados.
import './commands';

// La app lanza "Minified React error #418" (error de hidratación de Next.js) al cargar
// cualquier página. Es un bug de la aplicación (reportado en Trello), no de nuestros tests,
// así que ignoramos SOLO ese error. Cualquier otra excepción sí hace fallar el test.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Minified React error #418')) {
    return false;
  }
});
