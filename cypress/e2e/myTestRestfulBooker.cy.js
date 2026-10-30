/// <reference types="cypress" />

// Challenge final - Shady Meadows B&B (https://automationintesting.online)
// Cubre: 3.1 reserva exitosa, 3.2 validaciones de reserva y 3.3 formulario de contacto.
// Cada test prepara sus propios datos, así que pueden correr solos y en cualquier orden.

describe('Shady Meadows B&B', () => {
  context('3.1 Reserva exitosa como usuario invitado', () => {
    beforeEach(() => {
      cy.fixture('huesped').as('huesped');
    });

    it('muestra habitaciones disponibles en la página principal', () => {
      // UI: la sección "Our Rooms" debe listar al menos una habitación reservable
      cy.visit('/');
      cy.get('#rooms').within(() => {
        cy.contains('h2', 'Our Rooms').should('be.visible');
        cy.get('.room-card').should('have.length.greaterThan', 0);
        cy.get('.room-card').first().within(() => {
          cy.get('.card-title').invoke('text').should('not.be.empty');
          cy.contains('a', 'Book now').should('have.attr', 'href').and('include', '/reservation/');
        });
      });

      // API: lo que muestra la UI coincide con lo que devuelve el backend
      cy.request('/api/room').then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.rooms).to.be.an('array').and.not.be.empty;
        cy.get('.room-card').should('have.length', body.rooms.length);
      });
    });

    it('reserva una habitación con datos válidos y muestra la confirmación', function () {
      // Seleccionar la primera habitación desde la home (como lo haría un usuario)
      cy.visit('/');
      cy.get('.room-card').first().contains('a', 'Book now').invoke('attr', 'href').then((href) => {
        const roomId = href.match(/reservation\/(\d+)/)[1];

        cy.fechasAleatorias(2).then((fechas) => {
          cy.intercept('POST', '/api/booking').as('crearReserva');

          cy.abrirFormularioReserva(roomId, fechas);
          cy.completarFormularioReserva(this.huesped);
          cy.contains('button', 'Reserve Now').click();

          // API: el backend acepta la reserva
          cy.wait('@crearReserva').its('response.statusCode').should('be.oneOf', [200, 201]);

          // UI: mensaje de éxito con las fechas reservadas
          cy.contains('Booking Confirmed').should('be.visible');
          cy.contains(`${fechas.checkin} - ${fechas.checkout}`).should('be.visible');
        });
      });
    });
  });

  context('3.2 Validaciones del formulario de reserva', () => {
    it('no permite reservar con el formulario vacío y muestra los errores', () => {
      cy.fechasAleatorias(2).then((fechas) => {
        cy.intercept('POST', '/api/booking').as('crearReserva');

        cy.abrirFormularioReserva(1, fechas);
        cy.contains('button', 'Reserve Now').click();

        // UI: aparecen los mensajes de error de cada campo obligatorio
        cy.get('.alert-danger')
          .should('be.visible')
          .and('contain', 'Firstname should not be blank')
          .and('contain', 'Lastname should not be blank')
          .and('contain', 'must not be empty');

        // No se realizó la reserva: no hay confirmación...
        cy.contains('Booking Confirmed').should('not.exist');

        // ...y si el frontend llegó a llamar a la API, el backend la rechazó
        cy.get('@crearReserva.all').then((llamadas) => {
          llamadas.forEach((llamada) => {
            expect(llamada.response.statusCode).to.eq(400);
          });
        });
      });
    });
  });

  context('3.3 Formulario de contacto', () => {
    beforeEach(() => {
      cy.fixture('contacto').as('contacto');
      cy.visit('/');
    });

    it('envía un mensaje con datos válidos y muestra la confirmación', function () {
      cy.intercept('POST', '/api/message').as('enviarMensaje');

      cy.completarContacto(this.contacto);
      cy.get('#contact').contains('button', 'Submit').click();

      // API: el mensaje se guardó correctamente
      cy.wait('@enviarMensaje').then(({ request, response }) => {
        expect(response.statusCode).to.eq(200);
        expect(request.body).to.include({ name: this.contacto.name, subject: this.contacto.subject });
      });

      // UI: confirmación personalizada con el nombre y el asunto
      cy.contains(`Thanks for getting in touch ${this.contacto.name}!`).should('be.visible');
      cy.contains(this.contacto.subject).should('be.visible');
    });
  });
});
