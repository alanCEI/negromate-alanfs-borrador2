# 🧪 Guía de Pruebas API - Negromate Creatives

## 📋 Información General

Este documento explica cómo usar el archivo `TESTS.REST` para probar todos los endpoints de la API.

## 🔐 Credenciales de Prueba

### Usuario Admin
- **Email:** `admin@negromate.com`
- **Password:** `admin123`
- **Role:** `admin`
- **ID:** `68f2b02519d5bd21cd46b6cc`

### Usuario Regular de Prueba
- **Email:** `test@example.com`
- **Password:** `password123`
- **Role:** `user`

## 🚀 Cómo Empezar

### 1. Asegúrate de que el servidor esté corriendo

```bash
cd backend
npm run dev
```

El servidor debe estar corriendo en `http://localhost:3000`

### 2. Obtener un Token Válido

Hay dos opciones:

#### Opción A: Usar el login de admin (ya configurado)
Ejecuta la petición de login para admin (líneas 15-24 de TESTS.REST):

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "admin@negromate.com",
    "password": "admin123"
}
```

#### Opción B: Registrar un nuevo usuario
Ejecuta la petición de registro (líneas 26-34 de TESTS.REST)

### 3. Copiar el Token

De la respuesta del login/registro, copia el valor del campo `token` que está dentro de `data`:

```json
{
    "msg": "Inicio de sesión exitoso",
    "data": {
        "_id": "68f2b02519d5bd21cd46b6cc",
        "username": "admin",
        "email": "admin@negromate.com",
        "role": "admin",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // <-- COPIA ESTO
    },
    "status": "ok"
}
```

### 4. Actualizar la Variable en TESTS.REST

Pega el token en la línea 5 del archivo:

```
@jwt_token = TU_TOKEN_AQUI
```

### 5. Ejecutar Pruebas

Ahora puedes ejecutar cualquier endpoint del archivo TESTS.REST. Los que tienen el comentario `(Solo Admin)` requieren que uses el token de un usuario con rol `admin`.

## 📝 Estructura de Variables

El archivo TESTS.REST usa variables para facilitar las pruebas:

```
@api_url = http://localhost:3000/api
@jwt_token = [TOKEN DEL USUARIO LOGUEADO]
@user_id = [ID DE USUARIO PARA PRUEBAS]
@product_id = [ID DE PRODUCTO PARA PRUEBAS]
@order_id = [ID DE ORDEN PARA PRUEBAS]
@content_id = [ID DE CONTENIDO PARA PRUEBAS]
```

## 🔑 Endpoints por Categoría

### Autenticación (No requieren token)
- ✅ POST `/api/auth/register` - Registrar usuario
- ✅ POST `/api/auth/login` - Iniciar sesión

### Autenticación (Requieren token)
- 🔒 GET `/api/auth/profile` - Obtener perfil del usuario

### Usuarios (Solo Admin)
- 🔒👑 GET `/api/users` - Obtener todos los usuarios
- 🔒👑 GET `/api/users/:id` - Obtener usuario por ID
- 🔒 PUT `/api/users/:id` - Actualizar usuario (Admin o propio usuario)
- 🔒👑 DELETE `/api/users/:id` - Eliminar usuario

### Productos
- ✅ GET `/api/products` - Obtener todos los productos (público)
- ✅ GET `/api/products?category=Murals` - Filtrar por categoría (público)
- ✅ GET `/api/products/:id` - Obtener producto por ID (público)
- 🔒👑 POST `/api/products` - Crear producto (Solo Admin)
- 🔒👑 PUT `/api/products/:id` - Actualizar producto (Solo Admin)
- 🔒👑 DELETE `/api/products/:id` - Eliminar producto (Solo Admin)

### Órdenes
- 🔒👑 GET `/api/orders` - Obtener todas las órdenes (Solo Admin)
- 🔒 GET `/api/orders/myorders` - Obtener mis órdenes
- 🔒 GET `/api/orders/:id` - Obtener orden por ID
- 🔒 POST `/api/orders` - Crear nueva orden
- 🔒👑 PUT `/api/orders/:id` - Actualizar estado de orden (Solo Admin)
- 🔒👑 DELETE `/api/orders/:id` - Eliminar orden (Solo Admin)

### Contenido
- 🔒👑 GET `/api/content` - Obtener todo el contenido (Solo Admin)
- ✅ GET `/api/content/:sectionName` - Obtener contenido por sección (público)
- 🔒👑 POST `/api/content` - Crear contenido (Solo Admin)
- 🔒👑 PUT `/api/content/:id` - Actualizar contenido (Solo Admin)
- 🔒👑 DELETE `/api/content/:id` - Eliminar contenido (Solo Admin)

**Leyenda:**
- ✅ = Público (no requiere autenticación)
- 🔒 = Requiere autenticación (cualquier usuario)
- 🔒👑 = Requiere autenticación + rol de admin

## 🛠️ Solución de Problemas

### Error: "No autorizado, token no proporcionado"
- Verifica que estés incluyendo el header `Authorization: Bearer {{jwt_token}}`
- Asegúrate de que la variable `@jwt_token` esté configurada

### Error: "No autorizado, token inválido"
- Tu token puede haber expirado (duración: 90 días)
- Ejecuta el login nuevamente para obtener un token fresco

### Error: "Acceso denegado, requiere rol de administrador"
- Estás intentando acceder a un endpoint de admin con un usuario regular
- Usa las credenciales de admin: `admin@negromate.com / admin123`

### Error: "Usuario no encontrado" o "Producto no encontrado"
- El ID en las variables (`@user_id`, `@product_id`, etc.) no es válido
- Actualiza la variable con un ID existente

## 🔄 Renovar Token de Admin

Si tu token de admin expira, simplemente ejecuta el login de admin nuevamente:

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "admin@negromate.com",
    "password": "admin123"
}
```

Y actualiza la variable `@jwt_token` con el nuevo token.

## 📚 Recursos Adicionales

### Crear un Nuevo Usuario Admin

Si necesitas crear otro usuario admin, ejecuta:

```bash
npm run create-admin
```

Y edita el archivo `backend/scripts/createAdmin.js` para cambiar las credenciales.

### Cambiar la Contraseña del Admin

1. Edita `backend/scripts/createAdmin.js`
2. Cambia el valor de `adminData.password`
3. Ejecuta `npm run create-admin`

## 🎯 Flujo de Prueba Recomendado

1. **Autenticación:**
   - ✅ Registrar usuario nuevo
   - ✅ Login con usuario regular
   - ✅ Login con admin
   - ✅ Obtener perfil

2. **Productos (como Admin):**
   - ✅ Ver todos los productos
   - ✅ Crear un producto
   - ✅ Actualizar el producto creado
   - ✅ Eliminar el producto

3. **Órdenes (como Usuario):**
   - ✅ Crear una orden
   - ✅ Ver mis órdenes
   - ✅ Ver orden específica

4. **Usuarios (como Admin):**
   - ✅ Ver todos los usuarios
   - ✅ Ver usuario específico
   - ✅ Actualizar usuario

5. **Contenido:**
   - ✅ Ver contenido público (aboutUs)
   - ✅ Crear contenido (como Admin)
   - ✅ Actualizar contenido (como Admin)

## 📊 Estado Actual de las Variables

```
✅ @api_url = http://localhost:3000/api
✅ @jwt_token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (ADMIN - Válido hasta 2026-01-15)
✅ @user_id = 68f2b02519d5bd21cd46b6cc (Usuario: admin)
✅ @product_id = 68f2b0c33f8ac5046f8e81de (Producto: "Producto de Prueba Admin")
✅ @order_id = 68f2b2973f8ac5046f8e81e3 (Orden: 2 unidades - Total: $199.98)
✅ @content_id = 68f2b2ab3f8ac5046f8e81e8 (Contenido: Sección "testSection")
```

### Datos de Prueba Creados

| Variable | ID | Descripción | Detalles |
|----------|----|-----------|-----------|
| `@user_id` | `68f2b02519d5bd21cd46b6cc` | Usuario Admin | Email: admin@negromate.com, Role: admin |
| `@product_id` | `68f2b0c33f8ac5046f8e81de` | Producto de Prueba | Categoría: GraphicDesign, Precio: $99.99 |
| `@order_id` | `68f2b2973f8ac5046f8e81e3` | Orden de Prueba | Total: $199.98 (2 unidades), Status: pending |
| `@content_id` | `68f2b2ab3f8ac5046f8e81e8` | Contenido de Prueba | Sección: testSection, Título: "Sección de Prueba ACTUALIZADA" |

## 📞 Soporte

Si encuentras algún problema, revisa:
- Los logs del servidor (`npm run dev`)
- La documentación en `CLAUDE.md`
- El middleware de autenticación en `backend/middlewares/auth.middleware.js`

Resumen: Usuario Admin Creado y Configurado
🎉 Lo que hemos logrado:
1. Usuario Admin Creado
✅ Email: admin@negromate.com
✅ Password: admin123
✅ Role: admin
✅ ID: 68f2b02519d5bd21cd46b6cc
2. Script de Creación de Admin
✅ Creado script en backend/scripts/createAdmin.js
✅ Agregado comando npm run create-admin al package.json
✅ Script adicional para hashear contraseñas: backend/scripts/hashPassword.js
3. Archivo TESTS.REST Actualizado
✅ Token de admin válido configurado (válido hasta 2025-11-16)
✅ Variable @user_id con el ID del admin
✅ Variable @product_id con un producto de prueba creado
✅ Agregada sección de login rápido para admin
4. Documentación Creada
✅ Guía completa en backend/TESTS-README.md
🧪 Pruebas Realizadas y Exitosas:
✅ Creación del usuario admin
✅ Login como admin
✅ Obtener todos los usuarios (endpoint solo-admin)
✅ Crear un producto (endpoint solo-admin)
✅ Obtener perfil del admin
📋 Cómo Usar Ahora:
Opción 1: Usar VS Code REST Client
Si tienes la extensión REST Client instalada:
Abre backend/TESTS.REST
Haz click en "Send Request" sobre cualquier petición
Las variables ya están configuradas y listas para usar
Opción 2: Usar Postman, Insomnia, etc.
Importa las peticiones del archivo TESTS.REST
Usa estos valores:
Base URL: http://localhost:3000/api
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjJiMDI1MTlkNWJkMjFjZDQ2YjZjYyIsImlhdCI6MTc2MDczNTI5NiwiZXhwIjoxNzYzMzI3Mjk2fQ.cJFse_ho-VkOHuvJVI8DtrlCaSFoq8itWzT6S1JhlBs
Opción 3: Usando curl
Ejemplo para obtener el perfil:
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjJiMDI1MTlkNWJkMjFjZDQ2YjZjYyIsImlhdCI6MTc2MDczNTI5NiwiZXhwIjoxNzYzMzI3Mjk2fQ.cJFse_ho-VkOHuvJVI8DtrlCaSFoq8itWzT6S1JhlBs"
🔄 Renovar Token (cuando expire)
Cuando el token expire en 30 días, simplemente ejecuta en TESTS.REST:
### Iniciar sesión como ADMIN
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "admin@negromate.com",
    "password": "admin123"
}
Y actualiza la variable @jwt_token con el nuevo token.
📚 Archivos Importantes:
backend/TESTS.REST - Archivo con todas las pruebas
backend/TESTS-README.md - Guía completa de uso
backend/scripts/createAdmin.js - Script para crear admin
backend/scripts/hashPassword.js - Utilidad para hashear contraseñas

Guía Completa: Crear Usuario Admin
Método 1: Usando el Script Automático (RECOMENDADO ⭐)
Este es el método más fácil y rápido. Ya creé el script para ti.
Pasos:
Ejecuta el comando:
cd backend
npm run create-admin
Verás este resultado:
✅ Conectado a MongoDB Atlas
DB: tu-nombre-de-base-de-datos
✅ Usuario admin creado exitosamente!
=======================================
ID: 675abc123def456789012345
Username: admin
Email: admin@negromate.com
Role: admin
=======================================

🔐 Credenciales de acceso:
Email: admin@negromate.com
Password: admin123

⚠️ IMPORTANTE: Cambia la contraseña después del primer login
Ahora ya puedes usar estas credenciales en TESTS.REST:
### Iniciar sesión como admin
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "admin@negromate.com",
    "password": "admin123"
}
Copia el token de la respuesta y actualiza tu variable:
@jwt_token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NWFiYzEyM2RlZjQ1Njc4OTAxMjM0NSIsImlhdCI6MTczNDAwMDAwMCwiZXhwIjoxNzM2NTkyMDAwfQ.xxxxxxxx
Ahora puedes probar los endpoints de admin:
### Crear un nuevo producto (Solo Admin)
POST http://localhost:3000/api/products
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "name": "Producto de Prueba",
    "category": "GraphicDesign",
    "price": 99.99,
    "imageUrl": "https://example.com/image.jpg",
    "description": "Descripción del producto de prueba",
    "details": ["Detalle 1", "Detalle 2"]
}
Método 2: Modificar un Usuario Existente (Usando MongoDB Compass o CLI)
Si ya tienes un usuario y quieres convertirlo en admin:
Opción A: Usando MongoDB Compass (GUI)
Abre MongoDB Compass
Conecta a tu cluster usando la URL:
mongodb+srv://TU_DB_USER:TU_DB_PASS@TU_CLUSTER/TU_DATABASE
Ve a la colección users
Encuentra tu usuario (por email, por ejemplo: test@example.com)
Edita el documento y cambia:
"role": "admin"
Guarda los cambios
Opción B: Usando MongoDB Shell
Conecta a MongoDB:
mongosh "mongodb+srv://TU_CLUSTER/TU_DATABASE" --username TU_DB_USER
Ejecuta el comando:
db.users.updateOne(
    { email: "test@example.com" },
    { $set: { role: "admin" } }
)
Verifica el cambio:
db.users.findOne({ email: "test@example.com" })
Método 3: Crear Admin Directamente en MongoDB
Usando MongoDB Compass:
Abre la colección users
Click en "ADD DATA" → "Insert Document"
Pega este JSON (pero primero necesitas hashear la contraseña):
NOTA: No puedes pegar la contraseña en texto plano. Necesitas hasheada. Para obtener una contraseña hasheada, crea un archivo temporal:
Write c:\Users\alan_\Documents\GitHub\negromate-alanfs-borrador2\backend\scripts\hashPassword.js
⎿
19 lines
import bcrypt from 'bcrypt';

// Cambia esto por la contraseña que quieras
const plainPassword = 'admin123';

const hashPassword = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    console.log('=======================================');
    console.log('Contraseña en texto plano:', plainPassword);
    console.log('Contraseña hasheada:', hashedPassword);
    console.log('=======================================');
    console.log('\nUsa este valor en el campo "password" de MongoDB:');
    console.log(hashedPassword);
};

hashPassword();
Ejecuta:
node scripts/hashPassword.js
Y obtendrás el hash para insertar manualmente en MongoDB.
📝 Resumen de Recomendaciones
✅ MÉTODO 1 (Más fácil)
npm run create-admin
Ventajas: Automático, rápido, seguro
Ideal para: Desarrollo local y primeras pruebas
⚙️ MÉTODO 2 (Modificar existente)
Ventajas: No crea nuevo usuario, usa uno existente
Ideal para: Cuando ya tienes un usuario y solo necesitas cambiar el rol
🔧 MÉTODO 3 (Manual)
Ventajas: Control total
Ideal para: Entornos de producción o cuando necesitas crear usuarios específicos
🧪 Verificar que el Admin Funciona
Después de crear el admin, prueba estos endpoints en TESTS.REST:
### 1. Login como admin
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "admin@negromate.com",
    "password": "admin123"
}

### 2. Ver perfil (debe mostrar role: "admin")
GET http://localhost:3000/api/auth/profile
Authorization: Bearer {{jwt_token}}

### 3. Prueba endpoint solo-admin (obtener todos los usuarios)
GET http://localhost:3000/api/users
Authorization: Bearer {{jwt_token}}

### 4. Crear un producto (solo admin)
POST http://localhost:3000/api/products
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "name": "Test Product",
    "category": "GraphicDesign",
    "price": 99.99,
    "imageUrl": "https://example.com/test.jpg",
    "description": "Producto de prueba",
    "details": ["Detalle 1"]
}
🎯 Próximos Pasos
Ejecuta: npm run create-admin
Haz login con las credenciales: admin@negromate.com / admin123
Copia el token de la respuesta
Actualiza @jwt_token en tu archivo TESTS.REST
Prueba todos los endpoints protegidos


# Crear nuevo usuario admin
npm run create-admin

# Hashear una contraseña
node scripts/hashPassword.js

# Iniciar servidor de desarrollo
npm run dev

