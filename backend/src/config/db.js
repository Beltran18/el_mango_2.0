import pkg from "pg";
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL no está definida en las variables de entorno");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
});

pool.on('connect', () => {
  console.log('✅ Conexión exitosa a PostgreSQL');
});

export default pool;