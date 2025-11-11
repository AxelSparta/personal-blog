---
title: Patrón de diseño MVC en Nodejs
img: /mvc-blog.webp
readtime: 15
description: En este blog explicaré qué es el patrón modelo-vista-controlador, cómo utilizarlo en nodejs y también qué beneficios tiene hacerlo.
author: Axel Sparta
date: 2025-06-29
---

# ¿Qué es el patrón de diseño MVC?

MVC, siglas de **Modelo-Vista-Controlador**, es un patrón de diseño de software que separa la lógica de la aplicación en tres capas que se relacionan entre sí.

1. El **Modelo** es la que maneja los datos y la lógica de negocio, es la parte que interactua con la base de datos y representa la información.
2. La **Vista** es la que se encarga de mostrar la interfaz de usuario, es con la que interactúa el usuario y se encarga de mostrar los datos al usuario de forma gráfica.
3. El **controlador** que actúa como intermediario o puente entre el *Modelo* y la *Vista*, recibiendo solicitudes, interactuando con el Modelo y devolviendo los datos correspondientes a la vista.

Este patrón mejora la organización, el mantenimiento y la reutilización del código en aplicaciones, especialmente en el desarrollo web dinámico.

![Esquema patrón MVC](/public/mvc-esquema.png)

## ¿Cómo aplicarlo en Nodejs?

En Node js el patrón ***Modelo-Vista-Controlador*** se aplica organizando la aplicación en carpetas y archivos, cada uno de ellos cumpliendo una función clara:

### Estructura de carpetas típica

```bash
project/
├── app.js               → Punto de entrada de la aplicación
├── package.json
├── /routes              → Define las rutas (qué URL llama a qué controlador)
│   └── userRoutes.js
├── /controllers         → Controladores (lógica que responde a las rutas)
│   └── userController.js
├── /models              → Modelos (interacción con los datos o BD)
│   └── userModel.js
└── /views               → Vistas (HTML, EJS, Handlebars, etc.)
    └── users.ejs
```

### 1. Modelo

En el modelo tenemos las funciones para acceder a la base de datos y manipular los datos.


```javascript
// models/userModel.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
})

const User = mongoose.model('User', userSchema)

// 🔽 Funciones de acceso a datos (API del modelo)
export async function findAllUsers() {
  return await User.find()
}

export async function findUserById(id) {
  return await User.findById(id)
}

export async function createUser(data) {
  // valida
  const newUser = new User(data)
  return await newUser.save()
}

```


## Ventajas del patrón MVC

- **Separación de responsabilidades:** Permite separar el código en secciones con propósitos claros, evitando la mezcla de lógicas de negocio, presentación y control.


- **Mantenimiento del código:** La clara separación facilita el mantenimiento y las actualizaciones de la aplicación, ya que los cambios en un componente afectan menos a los otros.


- **Reutilización del código:** Al tener los componentes bien definidos, es más fácil reutilizar partes del código en diferentes partes de la aplicación o en otros proyectos.

- **Desarrollo colaborativo:** Varios desarrolladores pueden trabajar en diferentes componentes (Modelo, Vista, Controlador) de forma paralela, lo que acelera el proceso de desarrollo.

- **Flexibilidad:** Permite una mejor adaptación a los estándares web más recientes y facilita la migración de aplicaciones existentes.
