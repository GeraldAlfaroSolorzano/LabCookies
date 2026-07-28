import { Router } from "express";

import {
    obtenerProductos
} from "../controllers/producto.controller.js";

import {
    autenticarToken
} from "../middleware/autenticarToken.js";

const router = Router();

router.get(
    "/",
    autenticarToken,
    obtenerProductos
);

export default router;