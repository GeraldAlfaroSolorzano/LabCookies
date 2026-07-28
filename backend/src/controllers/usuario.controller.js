import bcrypt from "bcrypt";

import conexion from "../../config/db.js";

export const registrarUsuario = async (req, res) => {
    try {
        const {
            nombre,
            correo,
            contrasena
        } = req.body;

        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({
                mensaje: "Nombre, correo y contrasena son requeridos"
            });
        }

        const [usuarios] = await conexion.query(
            `
                SELECT id
                FROM usuarios
                WHERE correo = ?
            `,
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

        const [resultado] = await conexion.query(
            `
                INSERT INTO usuarios (
                    nombre,
                    correo,
                    contrasena
                )
                VALUES (?, ?, ?)
            `,
            [
                nombre,
                correo,
                contrasenaCifrada
            ]
        );

        return res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
                id: resultado.insertId,
                nombre,
                correo
            }
        });
    } catch (error) {
        console.error(
            "Error registrando usuario:",
            error.message
        );

        return res.status(500).json({
            mensaje: "Error al registrar el usuario"
        });
    }
};