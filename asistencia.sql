-- Tabla para almacenar datos de llegada y salida
CREATE TABLE IF NOT EXISTS asistencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_estudiante INT NOT NULL,
    nombre_estudiante VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    hora_llegada TIME,
    hora_salida TIME,
    estado ENUM('presente', 'ausente', 'retardo', 'salida_temprana') DEFAULT 'ausente',
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_asistencia (id_estudiante, fecha),
    INDEX idx_fecha (fecha),
    INDEX idx_estudiante (id_estudiante)
);

-- Tabla de estudiantes (opcional, para referencias)
CREATE TABLE IF NOT EXISTS estudiantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    grado VARCHAR(50),
    seccion VARCHAR(10),
    email VARCHAR(100),
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplos de inserción
INSERT INTO estudiantes (nombre, apellido, matricula, grado, seccion) 
VALUES 
    ('Juan', 'García', 'MAT001', '10', 'A'),
    ('María', 'López', 'MAT002', '10', 'A'),
    ('Carlos', 'Martínez', 'MAT003', '11', 'B');

-- Ejemplo de registro de asistencia
INSERT INTO asistencia (id_estudiante, nombre_estudiante, fecha, hora_llegada, hora_salida, estado, observaciones)
VALUES 
    (1, 'Juan García', CURDATE(), '07:30:00', '14:00:00', 'presente', NULL),
    (2, 'María López', CURDATE(), '07:45:00', '14:00:00', 'retardo', 'Justificado'),
    (3, 'Carlos Martínez', CURDATE(), NULL, NULL, 'ausente', 'Enfermedad');
