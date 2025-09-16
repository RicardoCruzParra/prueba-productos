# productos-app (Angular Standalone)

Frontend para consumir la API `productos-pi`: login (JWT) + CRUD de productos.
Incluye interceptor JWT, servicios, componentes y pruebas unitarias.

## Requisitos
- Node.js 18+ (Angular 16) ó 20+ (Angular 17/20)
- npm 9+ (o 10+)
- (Opcional) nvm para gestionar versiones

## Crear el proyecto base
```bash
npx @angular/cli@latest new productos-app --routing --style=scss --standalone
cd productos-app