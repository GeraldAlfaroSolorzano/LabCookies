import bcrypt from "bcrypt";

import conexion from "../../config/db.js";

export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;

        const [usuarios] = await conexion.query(
            `SELECT id
             FROM usuarios
             WHERE correo = ?`,
            [correo]
        );

        if (usuarios.length > 0) {
            return res.status(409).json({
                mensaje: "El correo ya se encuentra registrado"
            });
        }

        const contrasenaCifrada = await bcrypt.hash(
            contrasena,
            10
        );

        await conexion.query(
            `INSERT INTO usuarios (
                nombre,
                correo,
                contrasena
            )
            VALUES (?, ?, ?)`,
            [
                nombre,
                correo,
                contrasenaCifrada
            ]
        );

        return res.status(201).json({
            mensaje: "Usuario registrado correctamente"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensaje: "Error al registrar el usuario"
        });
    }
};