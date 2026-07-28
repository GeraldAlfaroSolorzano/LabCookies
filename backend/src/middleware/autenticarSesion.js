export function autenticarSesion(req, res, next){
    if (!req.session || !req.session.usuario) {
        return res.status(401).json({
            mensaje: "Debe iniciar sesion para acceder a este recurso"
        });
    }

    req.usuario = req.session.usuario;

    next();
}