# Guía de Deployment en Vercel

## Problema Resuelto

Se corrigió un error crítico donde las llamadas al backend no incluían el prefijo `/api/` en las rutas. Esto causaba que páginas como "Sobre Nosotros" no cargaran correctamente en producción.

## Solución Implementada

El archivo `frontend/src/services/api.js` ahora **agrega automáticamente** el prefijo `/api/` a todas las rutas, independientemente de si la variable de entorno `VITE_API_URL` lo incluye o no.

### Cambios Realizados

1. **frontend/src/services/api.js**:
   - La función `apiRequest()` ahora verifica si la URL base incluye `/api`
   - Si no lo incluye, lo agrega automáticamente
   - Todos los métodos de `api.*` ahora aceptan un parámetro `options` para AbortController y otras opciones de fetch

2. **frontend/.env**:
   - Cambiado de `http://localhost:3000/api` a `http://localhost:3000`
   - El prefijo `/api` se agrega automáticamente en el código

3. **frontend/.env.production**:
   - Configurado como plantilla para la URL del backend en producción
   - Debe actualizarse con la URL real del backend desplegado

## Configuración para Deployment

### 1. Deploy del Backend

1. Ve a [Vercel](https://vercel.com)
2. Crea un nuevo proyecto y selecciona la carpeta `backend`
3. Configura las variables de entorno en Vercel:
   ```
   DB_USER=alansmallpage9428
   DB_PASS=sthHYqx7GTxIXfas
   CLUSTER=cei.v7murmu.mongodb.net
   DATABASE=cei-full
   JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOTQyMTk5NDE5NjEiLCJuYW1lIjoibmVncm9tYXRlIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.MgibxCifAvQyftRIMv9KvLlf3Wn4Efhft4pIkpS80NU
   ```
4. Despliega el backend
5. **Copia la URL del backend desplegado** (ejemplo: `https://negromate-backend.vercel.app`)

### 2. Deploy del Frontend

1. **ANTES de desplegar**, actualiza `frontend/.env.production`:
   ```
   VITE_API_URL=https://TU-BACKEND-URL-AQUI.vercel.app
   ```
   **IMPORTANTE**:
   - NO incluyas `/api/` al final de la URL
   - Usa la URL del backend que copiaste en el paso anterior
   - Ejemplo correcto: `VITE_API_URL=https://negromate-backend.vercel.app`
   - Ejemplo INCORRECTO: `VITE_API_URL=https://negromate-backend.vercel.app/api`

2. En Vercel, crea otro proyecto para el `frontend`
3. Configura la variable de entorno:
   ```
   VITE_API_URL=https://TU-BACKEND-URL-AQUI.vercel.app
   ```
4. Despliega el frontend

### 3. Verificación

Después del deployment, verifica que funcionen las siguientes páginas:
- `/about` (Sobre Nosotros) - debe cargar contenido dinámico
- `/graphic-design` - debe cargar productos y galería
- `/custom-clothing` - debe cargar productos y galería
- `/murals` - debe cargar productos y galería

## Estructura de URLs

### Desarrollo Local
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- API Endpoints: `http://localhost:3000/api/*`

### Producción
- Frontend: `https://tu-frontend.vercel.app`
- Backend: `https://tu-backend.vercel.app`
- API Endpoints: `https://tu-backend.vercel.app/api/*`

## Endpoints Disponibles

Todos los endpoints tienen el prefijo `/api/`:

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Obtener perfil (requiere token)
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto por ID
- `GET /api/content/:sectionName` - Obtener contenido dinámico
- `POST /api/orders` - Crear orden (requiere token)
- `GET /api/orders/myorders` - Obtener mis órdenes (requiere token)
- `GET /api/users` - Listar usuarios (requiere admin)

## Troubleshooting

### Error: "No se pudo cargar el contenido"
- Verifica que `VITE_API_URL` en Vercel apunte a la URL correcta del backend
- Verifica que el backend esté funcionando: visita `https://tu-backend.vercel.app/api`
- Revisa los logs en Vercel Dashboard

### Error: CORS
- El backend ya tiene CORS habilitado globalmente
- Si persiste, verifica que la URL del frontend esté permitida

### Error 404 en /api/*
- Este era el problema original: ahora está resuelto
- El código automáticamente agrega `/api/` a todas las rutas

## Notas Adicionales

- El código ahora es resiliente: funciona con o sin `/api/` en la variable de entorno
- No es necesario modificar el código para cambiar entre desarrollo y producción
- Solo debes actualizar `VITE_API_URL` según el ambiente
