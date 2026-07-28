import express from "express";
import session from "express-session";
import "dotenv/config";

const app = express();

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

const puerto = process.env.PORT;

app.listen(puerto, () => {
    console.log(
        `Servidor ejecutandose en http://localhost:${puerto}`
    );
});