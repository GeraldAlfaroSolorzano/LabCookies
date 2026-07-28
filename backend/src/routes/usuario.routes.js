import { Router } from "express";

import {
    agregarUsuario,
    listarUsuarios,
    buscarUsuario,
    eliminarUsuario,
    cambiarContrasena,
    autenticar,
    obtenerSesion,
    cerrarSesion
} from "../controllers/usuario.controller.js";

import { autenticarCookie } from "../middleware/autenticarCookie.js";

import { autenticarSesion } from "../middleware/autenticarSesion.js";

const router = Router();

router.post("/autenticar", autenticar);

router.get(
    "/autenticado",
    autenticarSesion,
    obtenerSesion
);

router.post("/cerrar-sesion", cerrarSesion);

router.get("/", listarUsuarios);
router.post("/", agregarUsuario);
router.patch("/", cambiarContrasena);

router.get("/:id", buscarUsuario);
router.delete("/:id", eliminarUsuario);

export default router;