---
title: Patrón de diseño MVC en Nodejs
img: /mvc-blog.webp
readtime: 15
description: En este blog explicaré qué es el patrón modelo-vista-controlador, cómo utilizarlo en nodejs y también qué beneficios tiene hacerlo.
author: Axel Sparta
date: 2025-11-12
---

# ¿Qué es el patrón de diseño MVC?

MVC, siglas de **Modelo-Vista-Controlador**, es un patrón de diseño de software que separa la lógica de la aplicación en tres capas que se relacionan entre sí.

1. El **Modelo** es la que maneja los datos y la lógica de negocio, es la parte que interactua con la base de datos y representa la información.
2. La **Vista** es la que se encarga de mostrar la interfaz de usuario, es con la que interactúa el usuario y se encarga de mostrar los datos al usuario de forma gráfica.
3. El **controlador** que actúa como intermediario o puente entre el _Modelo_ y la _Vista_, recibiendo solicitudes, interactuando con el Modelo y devolviendo los datos correspondientes a la vista.

Este patrón mejora la organización, el mantenimiento y la reutilización del código en aplicaciones, especialmente en el desarrollo web dinámico.

![Esquema patrón MVC](/public/mvc-esquema.png)

## ¿Cómo aplicarlo en Nodejs?

En Nodejs el patrón **_Modelo-Vista-Controlador_** se aplica organizando la aplicación en carpetas y archivos, cada uno de ellos cumpliendo una función clara:

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
  const newUser = new User(data)
  return await newUser.save()
}
```

Si bien no hay validaciones en el ejemplo, se recomienda añadirlas en todas las capas correspondientes 👀

### Controlador

El controlador ya no accede directamente a la base de datos, solo utiliza las funciones del modelo, manteniendo así su rol de intermediario entre la vista y el modelo.

```javascript
// controllers/userController.js
import { findAllUsers, findUserById, createUser } from '../models/userModel.js'

export async function getUsers(req, res) {
  try {
    const users = await findAllUsers()
    res.render('users', { users })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener usuarios')
  }
}

export async function getUser(req, res) {
  try {
    const user = await findUserById(req.params.id)
    if (!user) return res.status(404).send('Usuario no encontrado')
    res.json(user)
  } catch (error) {
    res.status(500).send('Error al obtener usuario')
  }
}

export async function postUser(req, res) {
  try {
    const { name, email } = req.body
    await createUser({ name, email })
    res.redirect('/users')
  } catch (error) {
    console.error(error)
    res.status(400).send('Error al crear usuario')
  }
}
```

### Rutas

Las rutas sólo asocian la URL con el controlador correspondiente

```javascript
// routes/userRoutes.js
import express from 'express'
import { getUsers, getUser, postUser } from '../controllers/userController.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', postUser)

export default router
```

### Vista (ejs)

La vista será devuelta por el controlador con los datos necesarios para que el usuario interactue.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Usuarios</title>
  </head>
  <body>
    <h1>Lista de Usuarios</h1>

    <ul>
      <% users.forEach(user => { %>
      <li><strong><%= user.name %></strong> - <%= user.email %></li>
      <% }) %>
    </ul>

    <h2>Agregar nuevo usuario</h2>
    <form action="/users" method="POST">
      <input type="text" name="name" placeholder="Nombre" required />
      <input type="email" name="email" placeholder="Email" required />
      <button type="submit">Agregar</button>
    </form>
  </body>
</html>
```

### Servidor

Archivo de entrada de nuestra aplicación en el cual se configuran los middlewares, motor de vistas, base de datos y rutas.

```javascript
// app.js
import express from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middlewares
app.use(express.urlencoded({ extended: true }))

// Vistas
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// DB connection
mongoose
  .connect('mongodb://localhost:27017/users_app')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err))

// Rutas
app.use('/users', userRoutes)

app.listen(3000, () => {
  console.log('🚀 Servidor en http://localhost:3000/users')
})
```

| Capa           | Qué hace                                              | Ejemplo                          |
| -------------- | ----------------------------------------------------- | -------------------------------- |
| **Model**      | Accede a la base de datos y define la estructura      | `findAllUsers()`, `createUser()` |
| **Controller** | Usa el modelo y decide qué vista o respuesta devolver | `getUsers()`, `postUser()`       |
| **Route**      | Define qué URL llama a qué controlador                | `/users`, `/users/:id`           |
| **View**       | Muestra los datos para que el usuario interactue con ellos                       | `users.ejs`                      |

## Ventajas del patrón MVC

- **Separación de responsabilidades:** Permite separar el código en secciones con propósitos claros, evitando la mezcla de lógicas de negocio, presentación y control.

- **Mantenimiento del código:** La clara separación facilita el mantenimiento y las actualizaciones de la aplicación, ya que los cambios en un componente afectan menos a los otros.

- **Reutilización del código:** Al tener los componentes bien definidos, es más fácil reutilizar partes del código en diferentes partes de la aplicación o en otros proyectos.

- **Desarrollo colaborativo:** Varios desarrolladores pueden trabajar en diferentes componentes (Modelo, Vista, Controlador) de forma paralela, lo que acelera el proceso de desarrollo.

- **Flexibilidad:** Permite una mejor adaptación a los estándares web más recientes y facilita la migración de aplicaciones existentes.
