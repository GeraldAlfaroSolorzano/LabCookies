import bcrypt from "bcrypt";

import conexion from "../../config/db.js";

export const iniciarSesion = async (req, res) => {
    try {
        const {
            correo,
            contrasena
        } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({
                mensaje: "Correo y contrasena son requeridos"
            });
        }

        const [usuarios] = await conexion.query(
            `
                SELECT
                    id,
                    nombre,
                    correo,
                    contrasena
                FROM usuarios
                WHERE correo = ?
            `,
            [correo]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const usuario = usuarios[0];

        const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        if (!contrasenaCorrecta) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo
        };

        return res.status(200).json({
            mensaje: "Inicio de sesion correcto",
            usuario: req.session.usuario
        });
    } catch (error) {
        console.error(
            "Error iniciando sesion:",
            error.message
        );

        return res.status(500).json({
            mensaje: "Error al iniciar sesion"
        });
    }
};