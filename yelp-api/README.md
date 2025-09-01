# 📊 Yelp DSS API

Sistema de Soporte a Decisiones (DSS) basado en el **Yelp Open Dataset**.  
Esta API permite analizar negocios, reseñas, usuarios y tips para obtener **inteligencia de mercado local**.  
Soporta carga de datasets temporales y exportación de reportes en **CSV/PDF**.

---

## 🚀 Características principales

- 📌 Gestión de **negocios, reseñas, usuarios, tips y checkins**.  
- 🔍 Módulo de **análisis**: ubicación, demanda y brechas oferta/demanda.  
- 📂 **Carga de datasets temporales** con validación de estructura.  
- 📑 **Exportación de reportes** en formato CSV y PDF.  
- 🛠️ Documentación interactiva con **Swagger** (`/api-docs`).  
- ✅ Middleware de **errores centralizado** y manejo de rutas inexistentes.  
- 🔁 Soporte para trabajar con **colecciones temporales** mediante el parámetro `temp`.

---

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/usuario/yelp-dss-api.git
cd yelp-dss-api

# Instalar dependencias
npm install

```
---

## 🔧 Requisitos previos

Antes de instalar asegúrate de tener:

- [Node.js](https://nodejs.org/) v16+  
- [MongoDB](https://www.mongodb.com/) en local o remoto  
- [npm](https://www.npmjs.com/) v8+  
- Git para clonar el repositorio  

---

## 📂 Estructura del proyecto

```bash
yelp-dss-api/
├── src/
│   ├── config/          # Configuración (DB, Swagger)
│   ├── controllers/     # Controladores con la lógica de negocio
│   ├── middleware/      # Middlewares (errores, notFound, upload)
│   ├── models/          # Modelos de MongoDB (Mongoose)
│   ├── routes/          # Definición de endpoints
│   ├── validators/      # Esquemas de validación con Joi
│   └── app.js           # Configuración principal de la app
├── uploads/             # Carpeta para datasets cargados temporalmente
├── README.md            # Documentación del proyecto
├── package.json         # Dependencias y scripts
└── server.js            # Punto de entrada del servidor
```
---
## 🌐 Endpoints principales

> Todos los endpoints aceptan el parámetro opcional `?temp=true` para trabajar con datasets temporales.

### 📌 Business
- **GET** `/api/business` → Listar negocios con filtros (`city`, `category`, `limit`)  
  - 📎 *Ejemplo:* `http://localhost:4000/api/business?city=Toronto&category=Food&temp=true`
  
- **GET** `/api/business/{id}` → Obtener detalle de un negocio  
  - 📎 *Ejemplo:* `http://localhost:4000/api/business/abc123?temp=true`

### 📝 Review
- **GET** `/api/review/business/{businessId}` → Listar reseñas de un negocio (`?limit=10`)  
  - 📎 *Ejemplo:* `http://localhost:4000/api/review/business/abc123?limit=10&temp=true`
  
- **GET** `/api/review/business/{businessId}/avg` → Obtener promedio de estrellas de un negocio  
  - 📎 *Ejemplo:* `http://localhost:4000/api/review/business/abc123/avg?temp=true`

### 👤 User
- **GET** `/api/user/{id}` → Obtener detalle de un usuario  
  - 📎 *Ejemplo:* `http://localhost:4000/api/user/user789?temp=true`
  
- **GET** `/api/user?limit=5` → Top usuarios más activos (por número de reseñas)  
  - 📎 *Ejemplo:* `http://localhost:4000/api/user?limit=5&temp=true`

### 💡 Tip
- **GET** `/api/tip/business/{businessId}` → Obtener tips de un negocio  
  - 📎 *Ejemplo:* `http://localhost:4000/api/tip/business/abc123?temp=true`

### 📍 Checkin
- **GET** `/api/checkin/business/{businessId}` → Obtener número de checkins de un negocio  
  - 📎 *Ejemplo:* `http://localhost:4000/api/checkin/business/abc123?temp=true`

### 🔍 Analysis (DSS)
- **GET** `/api/analysis/location?city=Toronto&category=Restaurant` → Análisis de ubicación por ciudad y categoría  
  - 📎 *Ejemplo:* `http://localhost:4000/api/analysis/location?city=Toronto&category=Restaurant&temp=true`
  
- **GET** `/api/analysis/demand?businessId=xyz` → Análisis de demanda con keywords por negocio  
  - 📎 *Ejemplo:* `http://localhost:4000/api/analysis/demand?businessId=abc123&temp=true`
  
- **GET** `/api/analysis/gaps?city=Toronto` → Análisis de brechas oferta-demanda por ciudad  
  - 📎 *Ejemplo:* `http://localhost:4000/api/analysis/gaps?city=Toronto&temp=true`

### 📂 Upload
- **POST** `/api/upload/{collection}` → Subir dataset temporal  
  - `{collection}` puede ser: `business`, `review`, `user`, `tip`, `checkin`  
  - Requiere `multipart/form-data` con el campo `file`  
  - 📎 *Ejemplo:* `http://localhost:4000/api/upload/review`

### 📑 Export
- **GET** `/api/export/csv?report=top-users` → Exportar reportes en **CSV**  
  - 📎 *Ejemplo:* `http://localhost:4000/api/export/csv?report=top-users`

- **GET** `/api/export/pdf?report=categories` → Exportar reportes en **PDF**  
  - 📎 *Ejemplo:* `http://localhost:4000/api/export/pdf?report=categories`

---


📌 **Reportes disponibles para exportación (`report` query param):**  
- `top-business` → Mejores negocios (estrellas + reseñas)  
- `top-cities` → Ciudades con más negocios  
- `top-users` → Usuarios con más reseñas  
- `categories` → Categorías más frecuentes  

---

## 🧰 Stack Tecnológico

- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- **Base de datos**: [MongoDB](https://www.mongodb.com/) con [Mongoose](https://mongoosejs.com/)  
- **Validación de datos**: [Joi](https://joi.dev/)  
- **Carga de archivos**: [Multer](https://github.com/expressjs/multer)  
- **Generación de reportes**:  
  - [PDFKit](https://pdfkit.org/) → Exportación en PDF  
  - [json2csv](https://www.npmjs.com/package/json2csv) → Exportación en CSV  
- **Documentación**: [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express) + [YAMLJS](https://www.npmjs.com/package/yamljs)  
- **Middleware**:  
  - [Morgan](https://www.npmjs.com/package/morgan) → Logger de peticiones  
  - [CORS](https://www.npmjs.com/package/cors) → Permitir peticiones externas  
- **Herramientas de desarrollo**: [Nodemon](https://nodemon.io/) para hot reload  

---

## 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura por capas, organizada en **tres subsistemas principales**:

### 📊 Data Subsystem

- Fuente de datos: **Yelp Open Dataset** cargado en **MongoDB**  
- Carga de datasets temporales vía `/api/upload`  
- Validación de la estructura con **Joi** antes de insertar  

### ⚙️ Model Subsystem

- Controladores que implementan la lógica de negocio  
- Módulo de análisis (ubicación, demanda, brechas oferta/demanda)  
- Exportación de reportes en **CSV/PDF**  
- Manejo centralizado de errores y rutas no encontradas  

### 🖥️ User Interface Subsystem

- Documentación y exploración de la API vía **Swagger UI** (`/api-docs`)  
- Soporte para clientes externos (ejemplo: **Postman** o un **frontend web**)  
- API RESTful con endpoints consistentes para cada recurso  

---

## 🧪 Pruebas

La API fue probada manualmente con **Postman** y **Swagger UI**.  
Se validaron los siguientes aspectos principales:

- Conexión correcta con MongoDB  
- Validación de datasets con Joi  
- Generación de reportes en CSV y PDF  
- Respuestas consistentes del middleware de errores  

---

## 👨‍💻 Equipo de desarrollo

Proyecto desarrollado en el marco del curso de **Sistemas de Información**.  
Basado en el **Yelp Open Dataset** con fines académicos.  


