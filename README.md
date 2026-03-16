# SkillCheck

Plataforma backend para la evaluación de competencias mediante cuestionarios interactivos.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-5.1.0-blue)](https://expressjs.com/)

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Uso de la Aplicación](#uso-de-la-aplicación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Licencia](#licencia)
- [Autores](#autores)

## Descripción

SkillCheck es una API REST desarrollada para gestionar evaluaciones basadas en competencias mediante cuestionarios. El sistema permite crear, administrar y aplicar evaluaciones, además de analizar el desempeño de los estudiantes en diferentes competencias.

La plataforma proporciona un análisis detallado del desempeño de cada estudiante por competencia, identificando áreas de mejora y generando reportes que facilitan el seguimiento del progreso académico y profesional.

## Características Principales

- **Evaluación por Competencias**: Sistema diseñado específicamente para medir competencias adquiridas
- **Análisis Detallado**: Reportes individuales por competencia con identificación de áreas de mejora
- **Autenticación Segura**: Sistema de autenticación con JWT y manejo de roles
- **Gestión de Cuestionarios**: Creación y administración flexible de cuestionarios
- **Gestión de Usuarios**: Control de roles y permisos para administradores y estudiantes
- **Gestión de Cursos**: Organización de contenidos por cursos y competencias
- **API RESTful**: Endpoints bien estructurados para fácil integración
- **Seguridad Implementada**: Limitación de peticiones, compartición de recursos entre orígenes, seguridad de cabeceras y validaciones
- **Gestión de Archivos**: Soporte para imágenes y recursos multimedia

## Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación mediante tokens
- **Argon2** - Cifrado de contraseñas

### Middleware y Utilidades
- **Morgan** - Registro de peticiones HTTP
- **Helmet** - Seguridad de cabeceras
- **CORS** - Compartir recursos entre orígenes
- **Cookie-parser** - Manejo de cookies
- **Multer** - Manejo de archivos
- **Express-validator** - Validación de datos
- **Express-rate-limit** - Limitación de peticiones
- **Dotenv** - Gestión de variables de entorno

## Requisitos Previos

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm >= 8.0.0
- Git

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/gpinula-2020433/SkillCheck_Backend.git
cd SkillCheck_Backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tu configuración (ver a la sección de configuración).

### 4. Iniciar MongoDB
Asegúrate de que MongoDB esté corriendo en tu sistema.


### 5. Ejecutar la aplicación
```bash
# Modo desarrollo con reinicio automático
npm run dev

# Modo producción
npm start
```

El servidor se iniciará en `http://localhost:3200` por defecto.

## Configuración de Variables de Entorno

Copia el archivo de ejemplo de variables de entorno y crea tu archivo `.env`:

```bash
cp .env.example .env
```

Luego edita el archivo .env con la configuración necesaria para tu entorno.

Ejemplo de variables de entorno:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Base de datos MongoDB
URI_MONGO=mongodb://localhost:27017/skillcheck

# JWT
SECRET_KEY_JWT=your_super_secret_key

# URL del cliente - Frontend
CLIENT_URL=http://localhost:5173

# Usuario administrador por defecto
ADMIN_NAME=Admin
ADMIN_SURNAME=User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_ROLE=ADMIN

```
> Nota: El archivo `.env` no está versionado y debe crearse localmente a partir de `.env.example`.

## Uso de la Aplicación

### Iniciar el servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### Verificar el servidor
```bash
curl http://localhost:3200
```

### Registro de usuario
```bash
curl -X POST http://localhost:3200/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "student"
  }'
```

### Inicio de sesión
```bash
curl -X POST http://localhost:3200/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

## Estructura del Proyecto

```
SkillCheck_Backend/
├── configs/                # Configuraciones de la aplicación
│   ├── app.js              # Configuración de Express y rutas
│   └── mongo.js            # Configuración de MongoDB
├── middlewares/            # Middlewares personalizados
│   ├── delete.file.on.errors.js
│   └── rate.limit.js
├── src/                    # Código fuente principal
│   ├── auth/               # Autenticación y autorización
│   ├── competences/        # Gestión de competencias
│   ├── course/             # Gestión de cursos
│   ├── question/           # Gestión de preguntas
│   ├── questionnaire/      # Gestión de cuestionarios
│   ├── questionnaire.result/ # Resultados de cuestionarios
│   ├── student.answer/     # Respuestas de estudiantes
│   ├── studentCourse/      # Relación estudiante-curso
│   └── user/               # Gestión de usuarios
├── utils/                  # Utilidades y funciones helper
├── uploads/                # Archivos subidos (imágenes, etc.)
├── .env                    # Variables de entorno (no versionado)
├── .gitignore              # Archivos ignorados por Git
├── index.js                # Punto de entrada de la aplicación
├── package.json            # Dependencias y scripts
└── README.md               # Documentación del proyecto
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión

### Usuarios
- `GET /v1/user` - Obtener todos los usuarios
- `GET /v1/user/:id` - Obtener usuario por ID
- `PUT /v1/user/:id` - Actualizar usuario
- `DELETE /v1/user/:id` - Eliminar usuario

### Cursos
- `GET /v1/course` - Obtener todos los cursos
- `POST /v1/course` - Crear nuevo curso
- `GET /v1/course/:id` - Obtener curso por ID
- `PUT /v1/course/:id` - Actualizar curso
- `DELETE /v1/course/:id` - Eliminar curso

### Competencias
- `GET /v1/competences` - Obtener todas las competencias
- `POST /v1/competences` - Crear nueva competencia
- `GET /v1/competences/:id` - Obtener competencia por ID
- `PUT /v1/competences/:id` - Actualizar competencia
- `DELETE /v1/competences/:id` - Eliminar competencia

### Cuestionarios
- `GET /v1/questionnaire` - Obtener todos los cuestionarios
- `POST /v1/questionnaire` - Crear nuevo cuestionario
- `GET /v1/questionnaire/:id` - Obtener cuestionario por ID
- `PUT /v1/questionnaire/:id` - Actualizar cuestionario
- `DELETE /v1/questionnaire/:id` - Eliminar cuestionario

### Preguntas
- `GET /v1/question` - Obtener todas las preguntas
- `POST /v1/question` - Crear nueva pregunta
- `GET /v1/question/:id` - Obtener pregunta por ID
- `PUT /v1/question/:id` - Actualizar pregunta
- `DELETE /v1/question/:id` - Eliminar pregunta

### Resultados de Cuestionarios
- `GET /v1/questionnaireResult` - Obtener todos los resultados
- `POST /v1/questionnaireResult` - Crear nuevo resultado
- `GET /v1/questionnaireResult/:id` - Obtener resultado por ID


## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Autores

- **Gabriel Pinula (GP)** - Desarrollo Principal - [gpinula-2020433](https://github.com/gpinula-2020433)
- **Marcos Pamal (MP)** - Desarrollo y Colaboración - [mpamal-2023046](https://github.com/mpamal-2023046)

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarnos:

- **Email**: [gpinula-2020433@kinal.edu.gt]
- **GitHub Issues**: [Issues del Proyecto](https://github.com/gpinula-2020433/SkillCheck_Backend/issues)

Gracias por tu interés en este proyecto.