---
title: Entendiendo el Event Loop en JavaScript
img: /event-loop.webp
readtime: 15
description: En este post explico el funcionamiento del Event Loop en JavaScript de manera sencilla.
author: Axel Sparta
date: 2026-04-06
---

# ¿Qué es el Event Loop en JavaScript?

Aparte de saber usar frameworks y librerías, la diferencia real entre alguien promedio y alguien fuerte en JavaScript está en **entender cómo corre JavaScript bajo el capó**.

Al centro de todo esto está el famoso **Event Loop**.

## ¿Cómo funciona JavaScript por dentro?

Antes de meternos al tema, es importante repasar rápidamente cómo funciona JavaScript a nivel interno.

### ¿Cómo gestiona la memoria JavaScript?

El motor de JavaScript (por ejemplo, V8) utiliza principalmente dos áreas de memoria:

#### Heap Memory

Aquí se guardan los datos más complejos, por ejemplo:

- Objetos
- Arrays
- Funciones

El **garbage collector** limpia esta memoria automáticamente cuando algo deja de usarse.

#### Call Stack

El **Call Stack** es una pila (LIFO: Last-In First-Out) donde se van apilando las funciones a medida que se ejecutan:

- Cada función que empieza a ejecutarse se añade al stack
- Cuando termina, se saca del stack
- JavaScript solo ejecuta **una cosa a la vez**

```js
function a() {
  b()
}

function b() {
  console.log("Hola")
}

a()
```

**Stack:**

```text
|   Llamada actual   |
+--------------------+
|  console.log()     |  <- (top)
|  b()               |
|  a()               |  <- (bottom)
+--------------------+
```

Si llenas el stack (por ejemplo, con recursión infinita), tendrás el típico error de **Stack Overflow**.

### ¿Single-threaded? Sí

JavaScript corre sobre un solo hilo principal.

**¿Qué implica esto?**

- Solo puede ejecutar **una tarea a la vez**
- Todo pasa por el **Call Stack**

Por eso el Event Loop es fundamental: permite manejar acción asíncrona sin usar varios hilos.

¿Pero entonces cómo hace para manejar tareas asíncronas (como *fetch* o *setTimeout*)?

## Web APIs: el secreto de la magia asíncrona

JavaScript **delega tareas** a su entorno (el navegador o Node.js) utilizando **Web APIs** que le da ese entorno:

- setTimeout
- fetch
- eventos del DOM
- localStorage

Estas tareas NO se ejecutan directamente en el Call Stack de JavaScript. El entorno las gestiona “por fuera”, y cuando terminan, le avisan a JavaScript (usando callbacks o promesas normalmente). Así, el Call Stack solo interviene cuando el resultado realmente necesita ser procesado dentro del código principal.

## Flujo de una operación asíncrona

El flujo típico de una operación asíncrona en JavaScript es:

1. Una función entra al **Call Stack**.
2. Llama a una **Web API** (`setTimeout`, `fetch`, etc.).
3. La Web API ejecuta la tarea en segundo plano.
4. Cuando termina, envía un callback a una **cola**.


### Las colas: Task vs Microtask

#### **Task Queue** (Macrotasks)

Incluye:

- `setTimeout`
- `setInterval`
- Eventos del DOM (por ejemplo: clics, teclas presionadas, etc.)
- peticiones AJAX con `XMLHttpRequest`
- callbacks de APIs del entorno (por ejemplo, algunos eventos de E/S)

#### **Microtask Queue** (alta prioridad)

Incluye:

- `Promise.then`
- continuaciones de `async/await` (internamente basadas en Promises)
- `queueMicrotask`
- `MutationObserver`

> **Las microtasks siempre tienen prioridad sobre las macrotasks.**

---

## El Event Loop: El orquestador

El **Event Loop** es el mecanismo que coordina todo el proceso:

1. Verifica si el **Call Stack** está vacío.
2. Si lo está:
   - Ejecuta **todas** las tareas de la **Microtask Queue**.
3. Luego:
   - Toma **una** tarea de la **Task Queue**.
4. Repite el proceso.

> Este ciclo ocurre constantemente, miles de veces por segundo.

## Ejemplo clave

```js
console.log("A")

setTimeout(() => console.log("B"), 0)

Promise.resolve().then(() => console.log("C"))

console.log("D")
```

**🧾 Output:**
```
A
D
C
B
```

**¿Por qué pasa esto?**

- `A` → ejecución síncrona
- `D` → ejecución síncrona
- `C` → **microtask** (prioridad alta)
- `B` → **macrotask**

## ⚠️ Algo que muchos no saben

El Event Loop **vacía completamente la Microtask Queue** antes de pasar a la Task Queue.

Esto puede generar problemas como la **starvation** (bloqueo de macrotasks):

```js
function loop() {
  Promise.resolve().then(loop)
}

loop()
```

- Esto crea un loop infinito de microtasks.
- Nunca se ejecutan macrotasks (como `setTimeout`).

## Event Loop y rendering (clave para frontend)

El navegador **NO renderiza** mientras el Call Stack está ocupado.  
Esto significa que:

- Un loop pesado bloquea la UI
- Las animaciones se congelan
- La app se siente lenta

**Por eso existen técnicas como:**

- `requestAnimationFrame`
- Dividir tareas largas en "chunks"
- Usar Web Workers

## Diferencia entre `setTimeout(fn, 0)` y microtasks

Muchos creen que `setTimeout(fn, 0)` se ejecuta “inmediatamente”.

- **Incorrecto**  
  Va a la **Task Queue** y espera a que:
  - El Call Stack esté vacío
  - Y **todas** las microtasks terminen

> Siempre va a ejecutarse **después** de las microtasks.

---

## Conclusión

- JavaScript **no ejecuta múltiples tareas al mismo tiempo**
- Usa el entorno (**Web APIs**) para delegar asincronía
- El **Event Loop** decide el orden de ejecución
- **Las microtasks tienen prioridad absoluta**