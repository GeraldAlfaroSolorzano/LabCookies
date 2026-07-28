import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from "express-session";


import parqueoRoutes from "./routes/parqueo.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
dotenv.config();

const NAME = process.env.SERVER_NAME;
const VERSION = process.env.SERVER_VERSION;
const DESCRIPTION = process.env.SERVER_DESCRIPTION;
const PORT = process.env.SERVER_PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(
  session({
    name: "parqueo.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 10 * 60 * 1000
    }
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: NAME,
    version: VERSION,
    description: DESCRIPTION,
    puerto: PORT
  });
});

app.use("/api/parqueo", parqueoRoutes);

app.use("/api/usuario", usuarioRoutes);

app.listen(PORT, () => {
  console.log(`${NAME} ${VERSION} ejecutandose en http://localhost:${PORT}`);
});