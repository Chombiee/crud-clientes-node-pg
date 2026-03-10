// Importamos las librerías necesarias
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // conexión a PostgreSQL
// Creamos la aplicación Express
const app = express();
// Middleware para recibir JSON en las peticiones
app.use(express.json());
// Permite que el frontend pueda conectarse al backend
app.use(cors());
app.use(express.static("public"));

//   GET /clientes
app.get("/clientes", async (req, res) => {
  // obtenemos los parámetros de la URL
  const { rut, edad, nombre } = req.query;

  try {
    let query;
    // Buscar cliente por RUT
    if (rut) {
      query = {
        text: "SELECT rut, nombre, edad FROM clientes WHERE rut = $1",
        values: [rut]
      };
    }

    // Buscar clientes por edad
    else if (edad) {
      // Validamos que edad sea número
      if (isNaN(edad)) {
        return res.status(400).json({
          ok: false,
          mensaje: "La edad debe ser numérica"
        });
      }

      query = {
        text: "SELECT rut, nombre, edad FROM clientes WHERE edad = $1",
        values: [edad]
      };
    }

    // Buscar clientes por nombre o prefijo
    else if (nombre) {
      query = {
        text: "SELECT rut, nombre, edad FROM clientes WHERE nombre ILIKE $1",
        values: [`${nombre}%`]
      };
    }

    // Si no envían parámetros, listar todos
    else {
      query = {
        text: "SELECT rut, nombre, edad FROM clientes",
        values: []
      };
    }

    // Ejecutamos la consulta
    const { rows } = await pool.query(query);

    // Respuesta exitosa
    res.status(200).json({
      ok: true,
      data: rows
    });

  } catch (error) {
    // Error del servidor
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor"
    });
  }
});

//   POST /clientes
//   Inserta un nuevo cliente
app.post("/clientes", async (req, res) => {
  // Obtenemos datos enviados en el body
  const { rut, nombre, edad } = req.body;

  // Validación básica
  if (!rut || !nombre || !edad) {
    return res.status(400).json({
      ok: false,
      mensaje: "Debe enviar rut, nombre y edad"
    });
  }

  // Validamos que edad sea número
  if (isNaN(edad)) {
    return res.status(400).json({
      ok: false,
      mensaje: "Edad debe ser numérica"
    });
  }

  try {
    const query = {
      text: "INSERT INTO clientes (rut, nombre, edad) VALUES ($1,$2,$3) RETURNING *",
      values: [rut, nombre, edad]
    };

    const { rows } = await pool.query(query);

    // Respuesta de creación exitosa
    res.status(201).json({
      ok: true,
      data: rows[0]
    });

  } catch (error) {
    // Error si el rut ya existe (PRIMARY KEY)
    if (error.code === "23505") {
      return res.status(409).json({
        ok: false,
        mensaje: "El rut ya existe"
      });
    }

    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor"
    });
  }
});

//   PUT /clientes/:rut
//   Modifica SOLO el nombre del cliente
app.put("/clientes/:rut", async (req, res) => {
  // rut viene en la URL
  const { rut } = req.params;

  // nombre viene en el body
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({
      ok: false,
      mensaje: "Debe enviar el nuevo nombre"
    });
  }

  try {
    const query = {
      text: "UPDATE clientes SET nombre = $1 WHERE rut = $2",
      values: [nombre, rut]
    };

    const result = await pool.query(query);

    // Si no encontró cliente
    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Cliente no existe"
      });
    }

    // Respuesta exitosa
    res.status(200).json({
      ok: true,
      rowCount: result.rowCount,
      mensaje: "Actualizado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor"
    });
  }
});

// DELETE /clientes
//   Elimina por rut, nombre o edad
//   NO permite eliminar más de un registro
app.delete("/clientes", async (req, res) => {
  const { rut, nombre, edad } = req.query;

  try {
    let selectQuery;

    // Buscar por rut
    if (rut) {
      selectQuery = {
        text: "SELECT * FROM clientes WHERE rut = $1",
        values: [rut]
      };
    }

    // Buscar por nombre
    else if (nombre) {
      selectQuery = {
        text: "SELECT * FROM clientes WHERE nombre = $1",
        values: [nombre]
      };
    }

    // Buscar por edad
    else if (edad) {
      if (isNaN(edad)) {
        return res.status(400).json({
          ok: false,
          mensaje: "Edad debe ser numérica"
        });
      }

      selectQuery = {
        text: "SELECT * FROM clientes WHERE edad = $1",
        values: [edad]
      };
    }

    else {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe indicar rut, nombre o edad"
      });
    }

    // Ejecutamos búsqueda
    const { rows } = await pool.query(selectQuery);

    // Si hay más de un resultado
    if (rows.length > 1) {
      return res.status(400).json({
        ok: false,
        mensaje: "Más de un cliente encontrado, refine el criterio"
      });
    }

    // Si no existe
    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Cliente no existe"
      });
    }

    // Eliminamos usando el rut encontrado
    const deleteQuery = {
      text: "DELETE FROM clientes WHERE rut = $1",
      values: [rows[0].rut]
    };

    const result = await pool.query(deleteQuery);

    res.status(200).json({
      ok: true,
      rowCount: result.rowCount,
      mensaje: "Cliente eliminado"
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor"
    });
  }
});

// Iniciamos el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});