# Prueba Full-Stack — **productos-pi** (Backend) + **productos-app** (Frontend)

Esta guía deja ambos proyectos listos para ejecutar, probar y evaluar:
- **Backend (productos-pi)**: Spring Boot 3 + Java 17, JWT, Lombok, JPA/Hibernate, H2 en memoria.
- **Frontend (productos-app)**: Angular (standalone), login con JWT y CRUD de productos.

> **Importante**
> - El **JWT secret** es **solo del backend**. El frontend **no** debe contenerlo.
> - **H2** se levanta automáticamente al iniciar el backend (modo memoria).

---

## 🧱 0) Requisitos

**Backend**
- Java **17+**
- Maven **3.9+** (o el wrapper `./mvnw`)
- (Opcional) cURL/Postman para probar endpoints

**Frontend**
- Node.js **18+** (Angular 16) o **20+** (Angular 20)
- npm **9+/10+**
- (Opcional) Angular CLI global (`npm i -g @angular/cli@latest`) — si no, usa `npx`

---

## 🚀 1) Quick Start

### Backend
```bash
# En la carpeta del backend (productos-pi):
./mvnw spring-boot:run
# Windows: mvnw.cmd spring-boot:run
Frontend
# En la carpeta del frontend (productos-app):
npm i
npm start -- --open
# (equivalente a: npx ng serve -o)
Usuario Demo (login)
username: user
password: password
```

## 🛠️ 2) Backend — productos-pi (Spring Boot 3 + Java 17)

API REST con JWT, Lombok, JPA/Hibernate y H2 en memoria.
Paquete raíz del código: org.evaluacion.
Incluye pruebas unitarias con Spring Boot Test y MockMvc.

### Tecnologías
- Spring Boot: Web, Data JPA, Validation, Security
- H2 Database (memoria)
- JWT (io.jsonwebtoken: jjwt)
- Lombok
- JUnit 5, Spring Security Test

### Estructura de paquetes
src/main/java/org/evaluacion
├─ config          # Seguridad, CORS, etc.
├─ auth            # DTOs y servicio JWT
├─ api             # Controladores REST
├─ service         # Lógica de negocio
├─ repo            # Repositorios JPA
└─ model           # Entidades JPA

src/test/java/org/evaluacion  

## Tests unitarios y de capa web (MockMvc)
Configuración (src/main/resources/application.yml)

```yalm
spring:
  datasource:
    url: jdbc:h2:mem:productosdb;DB_CLOSE_DELAY=-1
    driverClassName: org.h2.Driver
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  h2:
    console:
      enabled: true

jwt:
  * Para pruebas puedes dejarlo inline (32 bytes / 256 bits ENCODED).
  * En producción usa variable de entorno: ${JWT_SECRET}
  secret: "cambia-este-secreto-por-uno-de-256-bits"
  expiration-minutes: 120

server:
  port: 8080
```

H2: se inicia automáticamente al levantar la app.
Consola H2: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:productosdb
User: sa — Password: (vacío)
Lombok: habilita annotation processing en tu IDE.

Ejecutar backend
```bash
./mvnw spring-boot:run
# Windows: mvnw.cmd spring-boot:run
Empaquetar JAR:
./mvnw -DskipTests package
java -jar target/*.jar
```

### Endpoints (autenticación y CRUD protegido)


Login
```raw
POST /api/auth/login
Body:
{"username":"user","password":"password"}
Respuesta:
{"token":"<JWT>"}
```

CRUD (requiere header Authorization: Bearer <token>):
- GET /api/productos
- POST /api/productos
- PUT /api/productos/{id}
- DELETE /api/productos/{id}

Ejemplos cURL

```bash
# Login → captura token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"password"}' | jq -r .token)

# Listar
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/productos

# Crear
curl -X POST http://localhost:8080/api/productos \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"nombre":"Lápiz","precio":500.0}'
Pruebas backend
./mvnw test
```

Incluye:
Autenticación y obtención de token
Operaciones CRUD con MockMvc
Notas de despliegue
Variables de entorno recomendadas:
export JWT_SECRET="valor-seguro-y-largo-en-base64"
En application.yml:

```yaml
jwt:
  secret: ${JWT_SECRET}
Perfiles y logs: spring.profiles.active=prod, etc.
```

## 🧩 3) Frontend — productos-app (Angular standalone)
Login, almacenamiento del token (localStorage) e interceptor para adjuntar Authorization: Bearer.
Rutas: /login y /productos (CRUD).
Crear (si fuera desde cero)

```mvn
npx @angular/cli@latest new productos-app --routing --style=scss --standalone
cd productos-app
Ejecutar
npm i
npm start -- --open
# o: npx ng serve -o
Configurar URL del backend
src/environments/environment.ts:
export const environment = {
  apiBase: 'http://localhost:8080'
};
```

En AuthService usa la base:
private readonly api = `${environment.apiBase}/api/auth`;
Flujo en la UI
Abrir http://localhost:4200.
Login con user / password.
El front guarda el token en localStorage y navega a /productos.
En Productos, listar/crear/eliminar (todas las llamadas usan el token).
Pruebas frontend
```bash
npm test
# o
npx ng test
```

## 🔁 4) Prueba end-to-end (paso a paso)
Levantar backend en :8080:

```bash
./mvnw spring-boot:run
(Opcional) Verifica H2: http://localhost:8080/h2-console
```

Levantar frontend en :4200:

```bash
npm start -- --open
Login en la app Angular (user / password).
```

En Productos, prueba:
Crear (e.g., Lápiz $500)
Listar (deberías ver lo creado)
Eliminar


## 🧯 5) Troubleshooting
Angular: NG0908: Angular requires Zone.js
Tienes dos alternativas:
A) Con Zone.js 

### Instala e importa al inicio de src/main.ts:

```bash
import 'zone.js';
```
Limpia caché:

```bash
rm -rf .angular
npm start -- --open
```

B) Sin Zone.js (zoneless)
No importes zone.js.
En src/app/app.config.ts:

```bash
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
export const appConfig: ApplicationConfig = {
  providers: [
    /* router, http, interceptor, ... */
    provideZonelessChangeDetection(),
  ],
};
```
Limpia caché y arranca.

“zsh: command not found: ng”
Usa npx:
```bash
npx ng serve -o
```
O instala CLI global:
```bash
npm i -g @angular/cli@latest
```
### CORS
Si ves errores CORS en el navegador, asegúrate de:
@CrossOrigin("*") en el controller (o)
Configurar CORS en la seguridad del backend.

## 🔒 6) Notas de seguridad (contexto de prueba)
Está bien usar localStorage para esta prueba; en producción considera cookies HttpOnly.
El secreto JWT jamás va en el frontend; guárdalo en el backend (variables de entorno o vault).
Rota el secreto si sospechas filtración.

## 📚 7) Resumen
Backend: ./mvnw spring-boot:run → H2 se levanta solo → login user/password.
Frontend: npm start -- --open → login → CRUD de productos con token.
Todo listo para evaluar autenticación, consumo de API y flujo CRUD.
