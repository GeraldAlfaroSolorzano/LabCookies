import { Router } from "express";

import {
    registrarAplicacion,
    consultarAplicaciones,
    desactivarAplicacion
} from "../controllers/aplicacion.controller.js";

import {
    autenticarSesion
} from "../middleware/autenticarSesion.js";

const router = Router();

router.post(
    "/",
    autenticarSesion,
    registrarAplicacion
);

router.get(
    "/",
    autenticarSesion,
    consultarAplicaciones
);

router.patch(
    "/:id/desactivar",
    autenticarSesion,
    desactivarAplicacion
);

export default router;