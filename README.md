# Challenge Cohorte I 2026: Shady Meadows B&B

Pruebas manuales y automatizadas sobre [Shady Meadows](https://automationintesting.online/), un sistema de reservas de un Bed & Breakfast.

## Integrantes

| Nombre | Email |
|--------|-------|
| _(completar)_ | _(completar)_ |

## Entregables

- **Tablero de bugs en Trello:** _(pegar link)_
- **Casos de prueba (Excel o Google Sheets):** _(pegar link)_. El archivo fuente está en [`docs/casos-de-prueba-shady-meadows.xlsx`](docs/casos-de-prueba-shady-meadows.xlsx).
- **Bugs en formato de tarjeta:** [`docs/bugs-trello.md`](docs/bugs-trello.md)

### Resumen

| Concepto | Cantidad |
|----------|----------|
| Casos de prueba | 25 (6 positivos, 12 negativos y 7 de borde) |
| Resultado | 9 OK, 14 Fail y 2 Blocked |
| Bugs reportados | 16 (1 crítico, 4 altos, 6 medios y 5 bajos) |

## Automatización con Cypress

```
cypress/
├── e2e/
│   └── myTestRestfulBooker.cy.js   # flujos 3.1, 3.2 y 3.3 del challenge
├── fixtures/
│   ├── huesped.json                # datos del huésped para la reserva
│   └── contacto.json               # datos del formulario de contacto
└── support/
    ├── commands.js                 # comandos personalizados
    └── e2e.js                      # carga los comandos y maneja el error de React #418
cypress.config.js
```

### Flujos cubiertos

| Flujo | Qué valida |
|-------|------------|
| 3.1 Reserva exitosa como invitado | Que la home muestre las habitaciones (comparadas con `GET /api/room`), y que una reserva con datos válidos muestre "Booking Confirmed" con las fechas. |
| 3.2 Validaciones de reserva | Que con el formulario vacío aparezcan los errores, no se muestre la confirmación y la API no cree la reserva (`cy.intercept`). |
| 3.3 Formulario de contacto | Que con datos válidos aparezca "Thanks for getting in touch {nombre}!" y `POST /api/message` responda 200. |

### Buenas prácticas aplicadas

- **Tests independientes:** cada test prepara sus datos. Las reservas usan fechas aleatorias en el futuro (`cy.fechasAleatorias`) para no chocar con otras reservas.
- **Comandos personalizados:** `fechasAleatorias`, `abrirFormularioReserva`, `completarFormularioReserva` y `completarContacto`.
- **Fixtures:** los datos de prueba están separados del código.
- **Aserciones de UI y de API:** `cy.request` para consultar el backend y `cy.intercept` para validar requests y responses.
- **Selectores estables:** se usan `data-testid` cuando la app los expone.

### Cómo ejecutar

```bash
npm install
npm test            # modo headless
npm run cy:open     # modo interactivo
```

## Nota sobre el estado de la app

El 30/10/2026, `GET /api/room/{id}` respondía **500**, así que la página de reserva se mostraba en blanco (ver BUG-01). Mientras siga así, los tests 3.1 (reserva) y 3.2 fallan por ese bug y no por el código. Los demás tests pasan.
