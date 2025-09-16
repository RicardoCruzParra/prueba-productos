# Backend — productos-pi (Spring Boot 3 + Java 17)

**API REST** con **JWT**, **Lombok**, **JPA/Hibernate** y **H2** en memoria.  
Paquete raíz del código: **`org.evaluacion`**.  
Incluye pruebas unitarias con **Spring Boot Test** y **MockMvc**.

## Requisitos
- Java 17+
- Maven 3.9+ (o el wrapper incluido: `./mvnw`)
- (Opcional) cURL o Postman para probar endpoints

## Tecnologías
- Spring Boot: Web, Data JPA, Validation, Security
- H2 Database (en memoria)
- JWT (io.jsonwebtoken: jjwt)
- Lombok
- JUnit 5, Spring Security Test

## Estructura de paquetes (sugerida)

src/main/java/org/evaluacion
- config # Seguridad, CORS, etc.
- auth # DTOs y servicio JWT
- api # Controladores REST
- service # Lógica de negocio
- repo # Repositorios JPA
- model # Entidades JPA

- src/test/java/org/evaluacion # Tests unitarios y de capa web (MockMvc)

```yaml
## Configuración

Crea/edita `src/main/resources/application.yml`:

  ```yaml
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
  # Usa un secreto de al menos 256 bits. En prod, muévelo a una variable de entorno.
  secret: "cambia-este-secreto-por-uno-de-256-bits"
  expiration-minutes: 120

server:
  port: 8080
```

## Consola H2 (opcional): http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:productosdb
- User: sa — Password: (vacío)

Lombok: habilita annotation processing en tu IDE.

```bash
# Linux/Mac
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

```bash
./mvnw -DskipTests package
java -jar target/*.jar
```

## Endpoints (ejemplo)
Autenticación:
- POST /api/auth/login
    * Body: {"username":"user","password":"password"}
    * Respuesta: {"token":"<JWT>"}
    * CRUD protegido (Bearer token):
- GET /api/productos
- POST /api/productos
- PUT /api/productos/{id}
- DELETE /api/productos/{id}


## Ejemplos cURL
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"password"}' | jq -r .token)

# Listar productos (requiere token)
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/productos

# Crear
curl -X POST http://localhost:8080/api/productos \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"nombre":"Lápiz","precio":500.0}'
```

## Pruebas
Ejecutar:
```bash
./mvnw test
```
Incluye pruebas de:
- Autenticación y obtención de token.
- Operaciones CRUD con MockMvc.

## Notas de despliegue
- Usa variables de entorno para jwt.secret y otras credenciales:
```bash
export JWT_SECRET="valor-seguro-y-largo"
```
- Configura logs y perfiles (spring.profiles.active=prod) para ambientes no locales.
- Si mueves el paquete raíz, ajusta la anotación @SpringBootApplication o el scanBasePackages.
