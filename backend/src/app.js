import express from "express";
import session from "express-session";
import "dotenv/config";

import usuarioRouter from "./routes/usuario.routes.js";
import sesionRouter from "./routes/sesion.routes.js";

const app = express();

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use("/api/usuario", usuarioRouter);
app.use("/api/auth", sesionRouter);

const puerto = process.env.PORT;

app.listen(puerto, () => {
    console.log(
        `Servidor ejecutandose en http://localhost:${puerto}`
    );
});