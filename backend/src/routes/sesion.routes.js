import { Router } from "express";

import {
    iniciarSesion,
    obtenerPerfil,
    cerrarSesion
} from "../controllers/sesion.controller.js";

import {
    autenticarSesion
} from "../middleware/autenticarSesion.js";

const router = Router();

router.post("/login", iniciarSesion);

router.get(
    "/perfil",
    autenticarSesion,
    obtenerPerfil
);

router.post(
    "/logout",
    autenticarSesion,
    cerrarSesion
);

export default router;