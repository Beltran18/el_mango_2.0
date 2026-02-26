// src/routes/productos.routes.js
import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos");
    res.json(result.rows);
  } catch (error) {
  console.error("ERROR REAL:", error);
  res.status(500).json({ error: error.message });
}
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM productos WHERE id_producto = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: "El nombre y precio son obligatorios" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING id_producto",
      [nombre, descripcion || null, precio]
    );
    res.status(201).json({ message: "Producto creado correctamente", id: result.rows[0].id_producto });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// Actualizar un producto
router.put("/:id", async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE productos SET nombre = $1, descripcion = $2, precio = $3 WHERE id_producto = $4",
      [nombre, descripcion || null, precio, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM productos WHERE id_producto = $1",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
