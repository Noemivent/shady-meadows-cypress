# Reporte de bugs para Trello

Una sección por tarjeta. Copia el **título** como nombre de la tarjeta y el resto en la descripción.
Columnas del tablero: **Backlog de bugs → En progreso → Listo para revisar → Cerrado**.
Etiquetas sugeridas: severidad (Crítica / Alta / Media / Baja). Adjunta la captura o el video como evidencia.

## [BUG-01] La página de reserva se muestra en blanco: GET /api/room/{id} responde 500

- **ID:** BUG-01
- **Módulo:** Reservas / API
- **Severidad:** Crítica
- **Prioridad:** P1 - Urgente

**Descripción**  
Al abrir el detalle de cualquier habitación el backend responde 500 y el frontend no puede renderizar el formulario de reserva. Bloquea todo el flujo de reserva desde la UI.

**Pasos para reproducir**

1. Abrir https://automationintesting.online
2. Click en "Book now" de cualquier habitación
(o: curl https://automationintesting.online/api/room/1)

**Resultado esperado**  
Se muestra la habitación, el calendario y el botón "Reserve Now"

**Resultado actual**  
Página en blanco. API 500 "Internal Server Error"; consola: SyntaxError Unexpected token 'I', "Internal S"... is not valid JSON. Visto el 30/10/2026 entre 01:00 y 01:40 UTC

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-02] Error de React #418 (hidratación) en cada carga de página

- **ID:** BUG-02
- **Módulo:** General / Frontend
- **Severidad:** Baja
- **Prioridad:** P3 - Media

**Descripción**  
Cada carga de la página lanza "Minified React error #418": el HTML del servidor no coincide con el del cliente. Hace fallar cualquier test E2E que no lo maneje.

**Pasos para reproducir**

1. Abrir la home con DevTools > Consola abiertas
2. Recargar

**Resultado esperado**  
Sin errores en consola

**Resultado actual**  
Uncaught Error: Minified React error #418; args[]=HTML

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-03] Check availability muestra habitaciones ya reservadas

- **ID:** BUG-03
- **Módulo:** Disponibilidad
- **Severidad:** Alta
- **Prioridad:** P1 - Urgente

**Descripción**  
La búsqueda de disponibilidad no excluye habitaciones con reservas en el rango; el usuario elige una habitación que luego falla al reservar.

**Pasos para reproducir**

1. POST /api/booking roomid 1, 2027-03-10 a 2027-03-12 (201)
2. GET /api/room?checkin=2027-03-10&checkout=2027-03-12

**Resultado esperado**  
La habitación 1 no aparece

**Resultado actual**  
Aparecen las habitaciones 1, 2 y 3; reservar la 1 otra vez da 409

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-04] Se puede reservar una habitación inexistente

- **ID:** BUG-04
- **Módulo:** Reservas (API)
- **Severidad:** Alta
- **Prioridad:** P1 - Urgente

**Descripción**  
El backend no valida que el roomid exista.

**Pasos para reproducir**

1. POST /api/booking con roomid 999, fechas 2027-06-10 a 2027-06-12 y datos válidos

**Resultado esperado**  
400 o 404

**Resultado actual**  
201 {"bookingid":6,...,"roomid":999}

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-05] Se aceptan reservas en fechas pasadas

- **ID:** BUG-05
- **Módulo:** Reservas (API)
- **Severidad:** Alta
- **Prioridad:** P2 - Alta

**Descripción**  
El backend permite crear reservas con fechas anteriores a hoy.

**Pasos para reproducir**

1. POST /api/booking roomid 2, checkin 2020-01-10, checkout 2020-01-12

**Resultado esperado**  
400 "fecha en el pasado"

**Resultado actual**  
201: reserva creada

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-06] Fechas invertidas o iguales devuelven 409 en lugar de 400

- **ID:** BUG-06
- **Módulo:** Reservas (API)
- **Severidad:** Media
- **Prioridad:** P2 - Alta

**Descripción**  
La validación de fechas responde con el mismo error que una reserva duplicada, así que el cliente no puede distinguir el motivo.

**Pasos para reproducir**

1. POST /api/booking con checkin 2027-04-12 y checkout 2027-04-10
2. Repetir con checkin = checkout

**Resultado esperado**  
400 con mensaje de validación de fechas

**Resultado actual**  
409 {"error":"Failed to create booking"}

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-07] Check availability acepta checkout anterior al checkin

- **ID:** BUG-07
- **Módulo:** Home / Disponibilidad
- **Severidad:** Media
- **Prioridad:** P2 - Alta

**Descripción**  
La UI no valida el rango de fechas y genera enlaces de reserva con fechas invertidas.

**Pasos para reproducir**

1. En la home, Check In 20/11/2026, Check Out 10/11/2026
2. Click "Check Availability"

**Resultado esperado**  
Mensaje de error y no se listan habitaciones

**Resultado actual**  
Sin mensaje; los "Book now" apuntan a ?checkin=2026-11-20&checkout=2026-11-10

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-08] Fechas no válidas en disponibilidad devuelven 500

- **ID:** BUG-08
- **Módulo:** Disponibilidad (API)
- **Severidad:** Media
- **Prioridad:** P3 - Media

**Descripción**  
Parámetros de fecha no válidos provocan un error interno en lugar de una validación.

**Pasos para reproducir**

1. GET /api/room?checkin=foo&checkout=bar

**Resultado esperado**  
400 Bad Request

**Resultado actual**  
500 Internal Server Error

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-09] Reserva sin bookingdates devuelve 500

- **ID:** BUG-09
- **Módulo:** Reservas (API)
- **Severidad:** Media
- **Prioridad:** P2 - Alta

**Descripción**  
Falta validar que bookingdates sea obligatorio.

**Pasos para reproducir**

1. POST /api/booking con datos válidos pero sin el objeto bookingdates

**Resultado esperado**  
400 "bookingdates es obligatorio"

**Resultado actual**  
500 {"errors":["Failed to create booking"]}

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-10] El teléfono de la reserva acepta letras y el nombre acepta HTML

- **ID:** BUG-10
- **Módulo:** Reservas (API)
- **Severidad:** Media
- **Prioridad:** P2 - Alta

**Descripción**  
Solo se valida la longitud del teléfono; el nombre con etiquetas HTML se guarda sin sanitizar.

**Pasos para reproducir**

1. POST /api/booking con phone "abcdefghijkl" y firstname "<b>Ana</b>"

**Resultado esperado**  
400 por formato de teléfono y nombre inválido

**Resultado actual**  
201: reserva creada con esos valores

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-11] Los errores de validación de reserva no indican el campo

- **ID:** BUG-11
- **Módulo:** Reservas (API)
- **Severidad:** Baja
- **Prioridad:** P3 - Media

**Descripción**  
Los mensajes no dicen a qué campo corresponden y llegan en orden variable.

**Pasos para reproducir**

1. POST /api/booking con firstname "A" y lastname "B"

**Resultado esperado**  
Errores tipo "Firstname must be between 3 and 18 characters"

**Resultado actual**  
400 {"errors":["size must be between 3 and 30","size must be between 3 and 18"]}

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-12] Contacto: nombre de 300 caracteres devuelve 500

- **ID:** BUG-12
- **Módulo:** Contacto
- **Severidad:** Alta
- **Prioridad:** P2 - Alta

**Descripción**  
No hay validación de longitud máxima del nombre; la base de datos falla.

**Pasos para reproducir**

1. En Contact, Name con 300 letras "A" y el resto válido
2. Submit

**Resultado esperado**  
400 con límite de longitud

**Resultado actual**  
500 {"error":"Failed to create message"}

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-13] Contacto: el teléfono acepta letras

- **ID:** BUG-13
- **Módulo:** Contacto
- **Severidad:** Media
- **Prioridad:** P2 - Alta

**Descripción**  
Solo se valida la longitud del teléfono.

**Pasos para reproducir**

1. En Contact, Phone = abcdefghijk y el resto válido
2. Submit

**Resultado esperado**  
Error de formato de teléfono

**Resultado actual**  
200 y mensaje "Thanks for getting in touch..."

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-14] Contacto: acepta email "a@b" y nombre de 1 carácter

- **ID:** BUG-14
- **Módulo:** Contacto
- **Severidad:** Baja
- **Prioridad:** P3 - Media

**Descripción**  
Validación de email y de longitud mínima del nombre insuficiente.

**Pasos para reproducir**

1. POST /api/message con name "A" y email "a@b" (resto válido)

**Resultado esperado**  
400 con errores de nombre y email

**Resultado actual**  
200 {"success":true}

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-15] Navbar: "Amenities" no lleva a ninguna sección

- **ID:** BUG-15
- **Módulo:** Navegación
- **Severidad:** Baja
- **Prioridad:** P3 - Media

**Descripción**  
El link apunta a /#amenities pero la sección no existe.

**Pasos para reproducir**

1. En la home, click en "Amenities"

**Resultado esperado**  
Navega a la sección Amenities

**Resultado actual**  
No ocurre nada; /amenities da 404

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---

## [BUG-16] Footer: Quick Links e iconos sociales rotos

- **ID:** BUG-16
- **Módulo:** Navegación
- **Severidad:** Baja
- **Prioridad:** P4 - Baja

**Descripción**  
Todos los enlaces del footer tienen href="#".

**Pasos para reproducir**

1. En el footer, click en Home, Rooms, Booking, Contact y en los iconos sociales

**Resultado esperado**  
Cada link navega a su destino

**Resultado actual**  
No navegan (href="#")

**Evidencia**  
_(adjuntar captura de pantalla o video en la tarjeta)_

---
