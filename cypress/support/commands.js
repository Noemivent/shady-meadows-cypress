// Comandos personalizados para Shady Meadows.
// Encapsulan pasos que se repiten entre tests para no duplicar código.

/**
 * Genera un rango de fechas futuro y aleatorio (YYYY-MM-DD).
 * Por qué: la app rechaza reservas que se cruzan con otras existentes,
 * así que cada test usa fechas distintas para poder correr de forma independiente.
 */
Cypress.Commands.add('fechasAleatorias', (noches = 2) => {
  const diasAdelante = Cypress._.random(400, 3000);
  const checkin = new Date();
  checkin.setDate(checkin.getDate() + diasAdelante);
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + noches);
  const iso = (d) => d.toISOString().slice(0, 10);
  return cy.wrap({ checkin: iso(checkin), checkout: iso(checkout) });
});

/**
 * Abre la página de reserva de una habitación y despliega el formulario.
 * Las fechas viajan en la URL, igual que cuando el usuario hace click en "Book now".
 */
Cypress.Commands.add('abrirFormularioReserva', (roomId, { checkin, checkout }) => {
  cy.visit(`/reservation/${roomId}?checkin=${checkin}&checkout=${checkout}`);
  cy.contains('button', 'Reserve Now').click();
  cy.get('input[placeholder="Firstname"]').should('be.visible');
});

/** Llena el formulario de reserva con los datos del huésped. */
Cypress.Commands.add('completarFormularioReserva', (huesped) => {
  cy.get('input[placeholder="Firstname"]').clear().type(huesped.firstname);
  cy.get('input[placeholder="Lastname"]').clear().type(huesped.lastname);
  cy.get('input[placeholder="Email"]').clear().type(huesped.email);
  cy.get('input[placeholder="Phone"]').clear().type(huesped.phone);
});

/** Llena el formulario de contacto de la página principal. */
Cypress.Commands.add('completarContacto', (contacto) => {
  cy.get('[data-testid="ContactName"]').clear().type(contacto.name);
  cy.get('[data-testid="ContactEmail"]').clear().type(contacto.email);
  cy.get('[data-testid="ContactPhone"]').clear().type(contacto.phone);
  cy.get('[data-testid="ContactSubject"]').clear().type(contacto.subject);
  cy.get('[data-testid="ContactDescription"]').clear().type(contacto.description);
});
