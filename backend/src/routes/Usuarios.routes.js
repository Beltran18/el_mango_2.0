import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
});

// Obtener un usuario por documento
router.get("/:documento", async (req, res) => {
  const { documento } = req.params;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE documento = $1", [documento]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
});

// Crear un usuario
router.post("/", async (req, res) => {
  const { documento, email, contraseña } = req.body;

  if (!documento || !email || !contraseña) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  try {
    await pool.query(
      "INSERT INTO usuarios (documento, email, contraseña) VALUES ($1, $2, $3)",
      [documento, email, contraseña]
    );
    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});

// Actualizar un usuario existente
router.put("/:documento", async (req, res) => {
  const { email, contraseña } = req.body;
  const { documento } = req.params;

  try {
    const result = await pool.query(
      "UPDATE usuarios SET email = $1, contraseña = $2 WHERE documento = $3",
      [email, contraseña, documento]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

// Eliminar un usuario
router.delete("/:documento", async (req, res) => {
  const { documento } = req.params;
  try {
    const result = await pool.query("DELETE FROM usuarios WHERE documento = $1", [documento]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

export default router;
