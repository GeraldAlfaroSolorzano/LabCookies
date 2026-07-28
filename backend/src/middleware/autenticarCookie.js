export function autenticarCookie(req, res, next) {
  try {
    const cookieUsuario = req.signedCookies.usuarioAutenticado;

    if (!cookieUsuario) {
      return res.status(401).json({
        mensaje: "Debe iniciar sesión para acceder a este recurso"
      });
    }

    const usuario = JSON.parse(cookieUsuario);

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "La cookie de autenticación no es válida"
    });
  }
}