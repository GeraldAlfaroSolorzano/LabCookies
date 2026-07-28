import pool from "../../config/db.js";
import bcrypt from "bcrypt";

export async function agregarUsuario(req, res) {
  try {
    const { nombre, correo, contrasena, confirmacion } = req.body;

    if (!nombre || nombre.trim() == "") {
      return res.status(400).json({ error: 'El nombre no es valido' });
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo)) {
      return res.status(400).json({ error: 'El correo electronico no es valido' });
    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!regexPassword.test(contrasena)) {
      return res.status(400).json({ error: 'La contraseña no es valida' });
    }

    if (contrasena !== confirmacion) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    const [result] = await pool.execute(
      `INSERT INTO usuarios
      (nombre, correo, contrasena)
      VALUES (?, ?, ?)`,
      [
        nombre,
        correo,
        await bcrypt.hash(contrasena, 10)
      ]
    );

    return res.json({
      id: result.insertId,
      nombre: nombre,
      correo: correo,
      mensaje: "Usuario registrado correctamente"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.sqlMessage
    });

  }
}

export async function listarUsuarios(req, res) {
  try {
    const [result] = await pool.execute(
      `SELECT * FROM usuarios`
    );

    res.json({
      result: result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.sqlMessage
    });
  }
}

export async function buscarUsuario(req, res) {
  try {
    const id = req.params.id;
    const [result] = await pool.execute(
      `SELECT * FROM usuarios where id=?`
      ,
      [id]
    );

    if (result.length === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" })

    return res.json(
      result[0]
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.sqlMessage
    });
  }
}

export async function eliminarUsuario(req, res) {
  try {
    const id = req.params.id;
    const [result] = await pool.execute(
      `DELETE usuarios FROM usuarios where id=?`
      ,
      [id]
    );


    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" })

    return res.json(
      { mensaje: "Usuario eliminado" }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.sqlMessage
    });
  }
}

export async function cambiarContrasena(req, res) {
  try {
    let { id, contrasena, nueva, confirmacion } = req.body;
    const [resultSelect] = await pool.execute(
      `select * from usuarios where id=?`
      ,
      [id]
    );

    if (resultSelect.length === 0)
      return res.status(404).json({ mensaje: "Usuario no encontrado" })

    if (!await bcrypt.compare(contrasena, resultSelect[0].contrasena))
      return res.status(404).json({ mensaje: "La contrasena es incorrecta" })

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!regexPassword.test(nueva)) {
      return res.status(400).json({ error: 'La nueva contraseña no es valida' });
    }

    if (nueva !== confirmacion) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    nueva = await bcrypt.hash(nueva, 10)

    const [result] = await pool.execute(
      `UPDATE usuarios set contrasena=? where id=?`
      ,
      [nueva, id]
    );


    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" })

    return res.json(
      { mensaje: "Contrasena actualizada" }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.sqlMessage
    });
  }
}


export async function autenticar(req, res) {
  try {
    const { correo, contrasena } = req.body;

    const [result] = await pool.execute(
      `select id,nombre,correo,contrasena from usuarios where correo=?`
      ,
      [correo]
    );

    if (result.length === 0 ||
      !await bcrypt.compare(contrasena, result[0].contrasena))
      return res.status(404).json({ mensaje: "Correo y/o contraseña incorrectos" })

    const usuario = {
      id: result[0].id,
      nombre: result[0].nombre,
      correo: result[0].correo
    }

    req.session.regenerate((error) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          mensaje: "No fue posible crear la sesión"
        });
      }

      req.session.usuario = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      };

      req.session.inicio = new Date().toISOString();
      req.session.visitas = 0;

      //guardar la sesión y enviar la respuesta
      req.session.save((error) => {
        if (error) {
          console.error(error);

          return res.status(500).json({
            mensaje: "No fue posible guardar la sesión"
          });
        }


        return res.json({
          usuario: req.session.usuario,
          mensaje: "Acceso autorizado"
        });

      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.sqlMessage
    });
  }
}

export function obtenerSesion(req, res) {
  req.session.visitas = (req.session.visitas || 0) + 1;

  return res.json({
    usuario: req.session.usuario,
    inicio: req.session.inicio,
    visitas: req.session.visitas,
    expiraEn: req.session.cookie.maxAge,
    mensaje: "Sesión activa"
  });
}

export function cerrarSesion(req, res) {
  if (!req.session) {
    return res.status(200).json({
      mensaje: "No existe una sesion activa"
    });
  }

  req.session.destroy((error) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: "No fue posible cerrar la sesion"
      });
    }
    res.clearCookie("parqueo.sid", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/"
    });

    return res.json({
      mensaje: "Sesion cerrada correctamente"
    });
  });
}