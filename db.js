const { Pool } = require("pg");
require("dotenv").config(); 
// carga las variables del archivo .env

// creamos la conexión usando variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

module.exports = pool;