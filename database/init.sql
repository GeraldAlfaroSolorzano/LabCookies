CREATE DATABASE IF NOT EXISTS api_access_hub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE api_access_hub;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS aplicaciones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(255),
    token_hash CHAR(64) NOT NULL UNIQUE,
    estado ENUM('activa', 'inactiva') NOT NULL DEFAULT 'activa',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso DATETIME NULL,
    CONSTRAINT fk_aplicaciones_usuarios
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS productos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    existencia INT UNSIGNED NOT NULL DEFAULT 0
);

INSERT INTO productos (nombre, precio, existencia) VALUES
('Teclado mecanico', 45.00, 12),
('Mouse inalambrico', 25.50, 20),
('Monitor 24 pulgadas', 175.99, 8),
('Memoria USB 64 GB', 12.75, 30);

CREATE INDEX idx_aplicaciones_usuario
    ON aplicaciones(usuario_id);

CREATE INDEX idx_aplicaciones_estado
    ON aplicaciones(estado);