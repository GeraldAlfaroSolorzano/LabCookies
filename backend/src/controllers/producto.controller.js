import conexion from "../../config/db.js";

export const obtenerProductos = async (req, res) => {
    try {
        const [productos] = await conexion.query(
            `
                SELECT
                    id,
                    nombre,
                    precio,
                    existencia
                FROM productos
            `
        );

        return res.status(200).json({
            productos
        });
    } catch (error) {
        console.error(
            "Error consultando productos:",
            error.message
        );

        return res.status(500).json({
            mensaje: "Error al consultar los productos"
        });
    }
};