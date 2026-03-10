# CRUD de Clientes - Node.js + PostgreSQL

Aplicación web que implementa un **CRUD (Create, Read, Update, Delete)** de clientes utilizando **Node.js, Express y PostgreSQL**.  
Las consultas a la base de datos se realizan mediante **Query Objects con pg**, utilizando **consultas parametrizadas** para mejorar la seguridad y evitar SQL Injection.

El proyecto incluye además un **frontend simple** que permite interactuar con la API mediante formularios y visualizar los resultados en una tabla.

---

# Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- pg
- HTML
- CSS
- JavaScript (Fetch API)

---

# Funcionalidades

- Crear clientes
- Listar todos los clientes
- Buscar clientes por:
  - RUT
  - Nombre o prefijo
  - Edad
- Modificar el nombre de un cliente
- Eliminar clientes
- Prevención de eliminación masiva
- Respuestas JSON estandarizadas
- Validación básica de datos

---

# Estructura del proyecto

```
crud-clientes-node-pg
│
├── db.js
├── server.js
│
└── public
    ├── index.html
    ├── styles.css
    └── app.js
```

---

# Endpoints de la API

## Obtener clientes

Listar todos los clientes

```
GET /clientes
```

Buscar por RUT

```
GET /clientes?rut=12345678-9
```

Buscar por edad

```
GET /clientes?edad=30
```

Buscar por nombre o prefijo

```
GET /clientes?nombre=Ju
```

---

## Crear cliente

```
POST /clientes
```

Body JSON:

```
{
  "rut": "12345678-9",
  "nombre": "Juan",
  "edad": 30
}
```

Respuesta:

```
{
  "ok": true,
  "data": {
    "rut": "12345678-9",
    "nombre": "Juan",
    "edad": 30
  }
}
```

---

## Modificar cliente

Permite modificar **solo el nombre** del cliente.

```
PUT /clientes/:rut
```

Body JSON:

```
{
  "nombre": "Juan Pérez"
}
```

---

## Eliminar cliente

Eliminar por RUT

```
DELETE /clientes?rut=12345678-9
```

También se puede eliminar por **nombre o edad**, evitando eliminaciones masivas.  
Si existe más de un resultado, el sistema solicita refinar el criterio.

---

# Formato de respuestas

Las respuestas del servidor siguen un formato JSON estandarizado.

Consulta exitosa:

```
{
  "ok": true,
  "data": [...]
}
```

Actualización o eliminación:

```
{
  "ok": true,
  "rowCount": 1,
  "mensaje": "Actualizado correctamente"
}
```

Error:

```
{
  "ok": false,
  "mensaje": "Cliente no existe"
}
```

---

# Cómo ejecutar el proyecto

1. Instalar dependencias

```
npm install
```

2. Configurar la conexión a PostgreSQL en `db.js`.

3. Ejecutar el servidor

```
node server.js
```

4. Abrir en el navegador

```
http://localhost:3000
```

---

# Autor

Proyecto realizado como parte de una actividad práctica de **Backend con Node.js y PostgreSQL**.