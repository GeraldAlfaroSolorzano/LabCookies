import crypto from "crypto";

import conexion from "../../config/db.js";

export const registrarAplicacion = async (req, res) => {
    try {
        const {
            nombre,
            descripcion
        } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({
                mensaje: "Nombre y descripcion son requeridos"
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const usuarioId = req.session.usuario.id;

        const [resultado] = await conexion.query(
            `
                INSERT INTO aplicaciones (
                    usuario_id,
                    nombre,
                    descripcion,
                    token_hash
                )
                VALUES (?, ?, ?, ?)
            `,
            [
                usuarioId,
                nombre,
                descripcion,
                tokenHash
            ]
        );

        return res.status(201).json({
            mensaje: "Aplicacion registrada correctamente",
            aplicacion: {
                id: resultado.insertId,
                nombre,
                descripcion,
                token
            }
        });
    } catch (error) {
        console.error(
            "Error registrando aplicacion:",
            error.message
        );

        return res.status(500).json({
            mensaje: "Error al registrar la aplicacion"
        });
    }
};

export const consultarAplicaciones = async (req, res) => {
    try {
        const usuarioId = req.session.usuario.id;

        const [aplicaciones] = await conexion.query(
            `
                SELECT
                    id,
                    nombre,
                    descripcion,
                    estado,
                    fecha_creacion,
                    ultimo_acceso
                FROM aplicaciones
                WHERE usuario_id = ?
            `,
            [usuarioId]
        );

        return res.status(200).json({
            aplicaciones
        });
    } catch (error) {
        console.error(
            "Error consultando aplicaciones:",
            error.message
        );

        return res.status(500).json({
            mensaje: "Error al consultar las aplicaciones"
        });
    }
};

export const desactivarAplicacion = async (req, res) => {
    try {
        const aplicacionId = req.params.id;
        const usuarioId = req.session.usuario.id;

        const [resultado] = await conexion.query(
            `
                UPDATE aplicaciones
                SET estado = 'inactiva'
                WHERE id = ?
                AND usuario_id = ?
            `,
            [
                aplicacionId,
                usuarioId
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Aplicacion no encontrada"
            });
        }

        return res.status(200).json({
            mensaje: "Aplicacion desactivada correctamente"
        });
    } catch (error) {
        console.error(
            "Error desactivando aplicacion:",
            error.message
        );

        return res.status(500).json({
            mensaje: "Error al desactivar la aplicacion"
        });
    }
};