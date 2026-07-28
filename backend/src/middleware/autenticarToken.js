import crypto from "crypto";

import conexion from "../../config/db.js";

export const autenticarToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                mensaje: "Token requerido"
            });
        }

        const partes = authorization.split(" ");

        if (
            partes.length !== 2 ||
            partes[0] !== "Bearer" ||
            !partes[1]
        ) {
            return res.status(401).json({
                mensaje: "Token invalido"
            });
        }

        const token = partes[1];

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const [aplicaciones] = await conexion.query(
            `
                SELECT id
                FROM aplicaciones
                WHERE token_hash = ?
                AND estado = 'activa'
            `,
            [tokenHash]
        );

        if (aplicaciones.length === 0) {
            return res.status(401).json({
                mensaje: "Token invalido"
            });
        }

        await conexion.query(
            `
                UPDATE aplicaciones
                SET ultimo_acceso = NOW()
                WHERE id = ?
            `,
            [aplicaciones[0].id]
        );

        next();
    } catch (error) {
        console.error(
            "Error validando token:",
            error.message
        );

        return res.status(500).json({
            mensaje: "Error al validar el token"
        });
    }
};