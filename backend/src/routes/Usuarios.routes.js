import { Router } from "express";
import pool from "../config/db.js";
import bcrypt from "bcryptjs";

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

// Crear un usuario (se almacena contraseña hasheada)
router.post("/", async (req, res) => {
  const { documento, email, contraseña } = req.body;

  if (!documento || !email || !contraseña) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  try {
    const hashed = await bcrypt.hash(contraseña, 10);
    await pool.query(
      "INSERT INTO usuarios (documento, email, contraseña) VALUES ($1, $2, $3)",
      [documento, email, hashed]
    );
    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error: error.message });
  }
});

// Actualizar un usuario existente (hashea nueva contraseña si se provee)
router.put("/:documento", async (req, res) => {
  const { email, contraseña } = req.body;
  const { documento } = req.params;

  try {
    let updateQuery;
    let params;
    if (contraseña) {
      const hashed = await bcrypt.hash(contraseña, 10);
      updateQuery = "UPDATE usuarios SET email = $1, contraseña = $2 WHERE documento = $3";
      params = [email, hashed, documento];
    } else {
      updateQuery = "UPDATE usuarios SET email = $1 WHERE documento = $2";
      params = [email, documento];
    }

    const result = await pool.query(updateQuery, params);

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


// Ruta de login
router.post("/login", async (req, res) => {
  const { email, contraseña } = req.body;
  if (!email || !contraseña) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    // omitimos la contraseña en la respuesta
    const { contraseña: _, ...userSafe } = user;
    res.json(userSafe);
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
});

export default router;
