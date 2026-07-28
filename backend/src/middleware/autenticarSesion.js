export const autenticarSesion = (req, res, next) => {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensaje: "Usuario no autenticado"
        });
    }

    next();
};