// src/routes/detalle_venta.routes.js
import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

// Obtener todos los detalles de venta
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM detalle_venta");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los detalles de venta" });
  }
});

// Obtener detalle de una venta específica solo muestra una 
router.get("/:id_venta", async (req, res) => {
  const { id_venta } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM detalle_venta WHERE id_venta = $1",
      [id_venta]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No hay detalles para esta venta" });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el detalle de venta" });
  }
});

// Crear un nuevo detalle de venta
router.post("/", async (req, res) => {
  const { id_venta, id_producto, cantidad } = req.body;

  if (!id_venta || !id_producto || cantidad === undefined) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    await pool.query(
      "INSERT INTO detalle_venta (id_venta, id_producto, cantidad) VALUES ($1, $2, $3)",
      [id_venta, id_producto, cantidad]
    );
    res.status(201).json({ message: "Detalle de venta registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al insertar detalle de venta", error });
  }
});

// Actualizar la cantidad de un producto en una venta
router.put("/:id_venta/:id_producto", async (req, res) => {
  const { id_venta, id_producto } = req.params;
  const { cantidad } = req.body;

  if (cantidad === undefined) {
    return res.status(400).json({ message: "El campo cantidad es obligatorio" });
  }

  try {
    const result = await pool.query(
      "UPDATE detalle_venta SET cantidad = $1 WHERE id_venta = $2 AND id_producto = $3",
      [cantidad, id_venta, id_producto]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Detalle no encontrado" });
    }

    res.json({ message: "Detalle de venta actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el detalle de venta" });
  }
});

// Eliminar un producto del detalle de venta
router.delete("/:id_venta/:id_producto", async (req, res) => {
  const { id_venta, id_producto } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM detalle_venta WHERE id_venta = $1 AND id_producto = $2",
      [id_venta, id_producto]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Detalle no encontrado" });
    }

    res.json({ message: "Detalle de venta eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el detalle de venta" });
  }
});

export default router;
