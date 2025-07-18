import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

// Obtener todos los proveedores
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM proveedores");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener proveedores", error });
  }
});

// Obtener un proveedor por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM proveedores WHERE id_proveedor = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar proveedor", error });
  }
});

// Crear un nuevo proveedor
router.post("/", async (req, res) => {
  const { nombre_proveedor, id_producto } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO proveedores (nombre_proveedor, id_producto) VALUES (?, ?)",
      [nombre_proveedor, id_producto || null]
    );
    res.status(201).json({ mensaje: "Proveedor creado", id: result.insertId });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear proveedor", error });
  }
});

// Actualizar un proveedor por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_proveedor, id_producto } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE proveedores SET nombre_proveedor = ?, id_producto = ? WHERE id_proveedor = ?",
      [nombre_proveedor, id_producto || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }
    res.json({ mensaje: "Proveedor actualizado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar proveedor", error });
  }
});

// Eliminar un proveedor por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM proveedores WHERE id_proveedor = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }
    res.json({ mensaje: "Proveedor eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar proveedor", error });
  }
});

export default router;
