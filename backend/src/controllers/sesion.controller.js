import bcrypt from "bcrypt";

import conexion from "../../config/db.js";

export const iniciarSesion = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        const [usuarios] = await conexion.query(
            `SELECT
                id,
                nombre,
                correo,
                contrasena
             FROM usuarios
             WHERE correo = ?`,
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
        console.error(error);

        return res.status(500).json({
            mensaje: "Error al iniciar sesion"
        });
    }
};

export const obtenerPerfil = (req, res) => {
    return res.status(200).json({
        usuario: req.session.usuario
    });
};

export const cerrarSesion = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                mensaje: "No se pudo cerrar la sesion"
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            mensaje: "Sesion cerrada correctamente"
        });
    });
};