---
title: Solución definitiva al error de CORS en Node.js
img: /cors-img.webp
readtime: 10
description: En este post explico qué es el error de CORS y cómo solucionarlo en Node.js.
author: Axel Sparta
date: 2025-09-25
---

# ¿Qué es CORS y por qué sucede este error?

**CORS (Cross-Origin Resource Sharing)** es un mecanismo de seguridad basado en cabeceras HTTP que permite a un servidor indicar si acepta o no que recursos (como imágenes o datos de una API) sean solicitados desde un **navegador** con un dominio diferente al suyo.  

El servidor debe autorizar explícitamente las solicitudes de **orígenes cruzados** mediante cabeceras especiales, informando al navegador si puede o no permitir la petición.

El **error de CORS** aparece cuando intentás hacer una petición HTTP desde el navegador a un servidor que **no permite compartir recursos con el origen de tu aplicación**.  

⚠️ Importante: este error **no ocurre en Node.js directamente**, porque CORS es una política aplicada por los navegadores. Es decir: **el back puede estar respondiendo bien, pero el navegador bloquea el acceso a la respuesta**.

---

## 📌 Ejemplo típico

Si tu aplicación corre en: `http://midominioweb.com`

y hacés un `fetch` a: `https://api.ejemplo.com/datos`

El navegador le pregunta a la API:  
*“¿Me das permiso para acceder a tus datos desde `http://midominioweb.com`?”*.

- ✅ Si el servidor responde con el header adecuado:  
`Access-Control-Allow-Origin: http://midominioweb.com`

Todo funciona sin problema.
  
- ❌ Si **no responde** con ese header (o lo bloquea):  
El navegador lanza un **error de CORS** y no deja acceder a la respuesta, incluso si la API respondió correctamente.

---

# 🔍 ¿Qué es el Preflight CORS?

El **preflight CORS** es una **petición automática de tipo OPTIONS** que hace el navegador **antes de la petición real**, para verificar si el servidor acepta esa operación.

## ¿Cuándo ocurre un preflight?

Solo cuando la request **no es “simple”**.  

Una request simple es aquella que:  
- Usa métodos: `GET`, `POST`, `HEAD`.
- Solo incluye headers como `Accept` o `Content-Type` con valores seguros (`text/plain`, `application/x-www-form-urlencoded`, `multipart/form-data`).  

En cambio, si usás:  
- Métodos como `PUT`, `DELETE`, `PATCH`.  
- Headers personalizados (`Authorization`, `X-Token`, etc.).  
- `Content-Type: application/json` en un `POST`.  

El navegador enviará primero un **preflight OPTIONS**. Si el servidor no responde correctamente, la petición será bloqueada.

El servidor para responder correctamente a esta solicitud `OPTIONS` debe responder con las siguientes cabeceras junto a un código de estado http satisfactorio:

```bash
    "Access-Control-Allow-Origin": "http://midominioweb.com"
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    "Access-Control-Allow-Headers": "Content-Type, Authorization"

```

---

# 🛠️ Solucionando el error en Node.js

Para solucionar el error de CORS, debemos configurarlo **en el backend**. Una opción es crear un middleware que maneje todas las peticiones con todos los orígenes y cabeceras permitidas.

```js
import express from "express";

const app = express();

// 1. Listar orígenes permitidos
const ALLOWED_ORIGINS = [
"http://localhost:3000",
"https://miapp.com",
"https://otrodominio.com"
];

// 2. Middleware CORS
app.use((req, res, next) => {
const origin = req.headers.origin;

if (origin && ALLOWED_ORIGINS.includes(origin)) {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// 3. Si es un preflight (OPTIONS),
// respondemos directamente con un código de estatus satisfactorio
if (req.method === "OPTIONS") {
  return res.sendStatus(204);
}

next();
});

// 4. Ejemplo de endpoint
app.get("/api", (req, res) => {
res.json({ message: "Funciona con CORS o same-origin 🚀" });
});

app.listen(4000, () => console.log("Servidor en http://localhost:4000"));
```

## ⚡ Alternativa rápida con librería cors

En proyectos reales suele usarse la librería oficial **cors** de Express para simplificar esta configuración:

```javascript
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://miapp.com"]
}));

app.get("/api", (req, res) => {
  res.json({ message: "Funciona con CORS usando la librería" });
});

app.listen(4000);
```

# ✅ Conclusión

El error de CORS no es un bug de tu front ni de tu back, sino una política de seguridad de los navegadores.

La clave para resolverlo es:
- Configurar correctamente las cabeceras CORS en el servidor.
- Entender que el navegador es quien bloquea la petición, no el backend.
- Usar un middleware manual o la librería cors según la complejidad de tu proyecto.
- Con esto ya no deberías volver a sufrir con el famoso “error de CORS”.