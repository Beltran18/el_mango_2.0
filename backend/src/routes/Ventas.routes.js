// src/routes/ventas.routes.js
import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

// Obtener todas las ventas
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM ventas");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ventas" });
  }
});

// Obtener una venta por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM ventas WHERE id_venta = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la venta" });
  }
});

// Crear una nueva venta
router.post("/", async (req, res) => {
  const { total } = req.body;

  if (total === undefined) {
    return res.status(400).json({ error: "El campo total es obligatorio" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO ventas (total) VALUES (?)",
      [total]
    );
    res.status(201).json({ message: "Venta creada correctamente", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la venta" });
  }
});

// Actualizar una venta
router.put("/:id", async (req, res) => {
  const { total } = req.body;
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE ventas SET total = ? WHERE id_venta = ?",
      [total, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Venta no encontrada" });

    res.json({ message: "Venta actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la venta" });
  }
});

// Eliminar una venta
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM ventas WHERE id_venta = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Venta no encontrada" });

    res.json({ message: "Venta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la venta" });
  }
});

export default router;
