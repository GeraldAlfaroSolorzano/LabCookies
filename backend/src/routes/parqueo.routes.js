import { Router } from "express";

import {
    calcularCobro
} from "../controllers/parqueo.controller.js";

import {
    autenticarCookie
} from "../middleware/autenticarCookie.js";

import {
    autenticarSesion
} from "../middleware/autenticarSesion.js";

const router = Router();

router.post(
    "/calcular",
    autenticarSesion,
    calcularCobro
);

export default router;