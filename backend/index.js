import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde el archivo .env ANTES de cualquier otra cosa
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });

if (result.error && result.error.code !== 'ENOENT') {
  console.error('❌ Error leyendo archivo .env:', result.error);
}

console.log("📝 Variables de entorno cargadas:");
console.log("  PORT:", process.env.PORT || "no definida");
console.log("  DATABASE_URL:", process.env.DATABASE_URL ? "✅ Definida" : "❌ No definida");

// Importar las rutas DESPUÉS de cargar las variables de entorno
const routerUsuarios = await import("./src/routes/Usuarios.routes.js").then(m => m.default);
const routerProductos = await import("./src/routes/Productos.routes.js").then(m => m.default);
const routerVentas = await import("./src/routes/Ventas.routes.js").then(m => m.default);
const routerDetalleventa = await import("./src/routes/Detalle_venta.routes.js").then(m => m.default);
const routerProveedores = await import("./src/routes/Proveedores.routes.js").then(m => m.default);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🟢 Servidor backend de ElMango2.0 funcionando correctamente.");
});

app.use("/api/usuarios", routerUsuarios);
app.use("/api/productos", routerProductos);
app.use("/api/ventas", routerVentas);
app.use("/api/detalle_venta", routerDetalleventa);
app.use("/api/proveedores", routerProveedores);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});