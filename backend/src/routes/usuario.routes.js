import { Router } from "express";

import {
    registrarUsuario
} from "../controllers/usuario.controller.js";

const router = Router();

router.post("/", registrarUsuario);

export default router;