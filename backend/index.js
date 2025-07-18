import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routerUsuarios from "./src/routes/Usuarios.routes.js";
import routerProductos from "./src/routes/Productos.routes.js";
import routerVentas from "./src/routes/Ventas.routes.js";
import routerDetalleventa from "./src/routes/Detalle_venta.routes.js";
import routerProveedores from "./src/routes/Proveedores.routes.js";

dotenv.config();

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
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
