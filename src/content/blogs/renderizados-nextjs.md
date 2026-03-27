---
title: Tipos de renderizados de Next.js y cómo funciona el caché
img: /nextjs.jpg
readtime: 10
description: En este post explico los tipos de renderizados de Next.js y cómo funciona el caché.
author: Axel Sparta
date: 2026-03-22
---

# 🧠 Domina el Rendering y el Caché en Next.js

En el ecosistema actual, escribir código se ha convertido en un _commodity_.  
La IA puede generar componentes en milisegundos.

Pero hay algo que todavía no puede hacer bien:

> tomar decisiones arquitectónicas con contexto y visión de sistema.

Ahí es donde cambia el juego.

El valor de un desarrollador ya no está en qué tan rápido codea, sino en **cómo diseña sistemas**.

Hay que adoptar el _efecto águila_:  
ver tu aplicación desde arriba, entender cómo fluye una request, y decidir **dónde optimizar, cachear o renderizar**.

---

# ⚠️ El verdadero problema: rendimiento impredecible

Next.js no es complejo por accidente.

Es complejo porque intenta resolver automáticamente:

- caching
- fetching
- rendering
- streaming

👉 El problema:  
si no entendés qué está pasando, no podés **predecir performance**.

Por eso necesitás dominar:

- **Rendering**
- **Caching**

---

# 🔥 Estrategias de Renderizado

Pensalo como una cocina de restaurante:

## 🟢 SSG (Static Site Generation)

- Se cocina en **build time**
- Respuesta instantánea
- Costo de servidor ≈ 0

**Ideal para:**

- blogs
- landing pages
- contenido estático

### Ejemplo de página SSG

```ts
// En este ejemplo no se indica cuándo se debe revalidar la página, por lo que se considera estática.
export default async function SSGPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
  const post = await res.json()

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Página Estática (SSG)</h1>
      <p>
        Esta página se generó en tiempo de compilación y no cambiará hasta que
        se vuelva a construir el proyecto (a menos que se use revalidación
        manual).
      </p>
      <div className='mt-4 p-4 border rounded shadow'>
        <h2 className='text-xl font-semibold'>{post.title}</h2>
        <p className='mt-2'>{post.body}</p>
      </div>
      <p className='mt-4 text-sm text-gray-500'>
        Generado a las: {new Date().toLocaleTimeString()}
      </p>
    </div>
  )
}
```

---

## 🔴 SSR (Server-Side Rendering)

- Se cocina en **cada request**
- Datos siempre frescos
- Mayor latencia + costo

⚖️ **Trade-off:** rendimiento vs frescura

### Ejemplo de página SSR

```ts
// Se indica que la página se debe generar en cada solicitud del servidor.
// También se indica en la función fetch que no se debe cachear la respuesta.
export const dynamic = 'force-dynamic';

export default async function SSRPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/3', {
    cache: 'no-cache',
  });
  const post = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Página SSR (Server-Side Rendering)</h1>
      <p>Esta página se genera en cada solicitud del servidor, lo que permite datos siempre actualizados.</p>
      <div className="mt-4 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p className="mt-2">{post.body}</p>
      </div>
      <p className="mt-4 text-sm text-gray-500">Renderizado en tiempo real a las:
      {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
```

---

## 🟡 ISR (Incremental Static Regeneration)

El modelo híbrido (y el más importante hoy).

Funciona con **stale-while-revalidate**:

- Usuario recibe contenido viejo (rápido)
- Se regenera en background
- Próximos usuarios reciben contenido actualizado (después de que pase el tiempo de revalidación desde que el primer usuario solicitó la página)

### Ejemplo de página ISR

```ts
// Se indica que la página se debe revalidar cada 10 segundos.
export const revalidate = 10; // Revalidar cada 10 segundos

export default async function ISRPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/2', {
    next: { revalidate: 10 },
  });
  const post = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Página ISR (Incremental Static Regeneration)</h1>
      <p>Esta página se revalida automáticamente cada 10 segundos.</p>
      <div className="mt-4 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p className="mt-2">{post.body}</p>
      </div>
      <p className="mt-4 text-sm text-gray-500">Renderizado a las: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}

```

---

## 🔵 CSR (Client-Side Rendering)

- El cliente hace todo el trabajo
- Alta interactividad
- Peor SEO y peor FCP (First Contentful Paint)

### Ejemplo de página CSR

```ts
// Se indica que la página se debe renderizar en el lado del cliente.
'use client';

import { useEffect, useState } from 'react';

export default function CSRPage() {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts/4')
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Página Cliente (CSR)</h1>
      <p>Esta página realiza la carga de datos en el lado del cliente,
      después de que el navegador haya descargado el JavaScript necesario.</p>
      {loading ? (
        <p className="mt-4 italic">Cargando datos...</p>
      ) : (
        <div className="mt-4 p-4 border rounded shadow">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="mt-2">{post.body}</p>
        </div>
      )}
      <p className="mt-4 text-sm text-gray-500">Página cargada el: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}

```
---

## Análisis de Entornos: Servidor vs. Cliente

La elección entre un Componente de Servidor o de Cliente depende estrictamente de la funcionalidad requerida.

### Criterios de Selección

| Característica / Necesidad | Componente de Servidor | Componente de Cliente |
| -------------------------- | ---------------------- | --------------------- |
| Obtención de datos (Data Fetching) | Sí (cerca de la fuente) | No recomendado |
| Acceso a recursos sensibles (API Keys) | Sí | No |
| Reducción de Bundle de JavaScript | Sí | No |
| Interactividad (onClick, onChange) | No | Sí |
| Ciclos de vida (useEffect, useState) | No | Sí |
| APIs del navegador (window, localStorage) | No | Sí |
| Hooks personalizados | No | Sí |

---
  
## Mecanismos de Funcionamiento y Renderizado

Next.js utiliza las APIs de React para orquestar el renderizado en fragmentos (chunks) basados en segmentos de ruta.

### 1. El Proceso en el Servidor

- Renderizado de Componentes de Servidor: Se transforman en el *RSC Payload*.
- Pre-renderizado de HTML: Se utiliza el RSC Payload y las definiciones de los Componentes de Cliente para generar HTML estático.

**Definición de RSC Payload:** Es una representación binaria compacta del árbol de componentes de servidor. Contiene el resultado renderizado de estos componentes, marcadores de posición (placeholders) para componentes de cliente y las propiedades (props) transferidas entre ellos.

👉 El servidor resuelve la lógica  
👉 El cliente solo hidrata lo mínimo necesario

**Resultado:**

- bundles mucho más chicos
- menos JavaScript
- mejor performance real

### 2. Carga Inicial en el Cliente

- HTML: Proporciona una vista previa no interactiva instantánea.
- RSC Payload: Reconcilia los árboles de componentes de servidor y cliente.
- JavaScript: Se utiliza para la hidratación, proceso mediante el cual se conectan los controladores de eventos al DOM estático.

### 3. Navegaciones Posteriores
En las navegaciones siguientes, el RSC Payload se pre-obtiene y se almacena en caché. Los Componentes de Cliente se renderizan enteramente en el cliente sin necesidad de generar HTML nuevo en el servidor.

---

# Sistema de Caché de Componentes en Next.js 16

Este sistema, que se activa mediante la configuración `cacheComponents: true`, representa una evolución significativa en la forma en que el framework gestiona la persistencia de datos y el renderizado de la interfaz de usuario.

Los pilares de este modelo son la directiva `use cache` y el **Renderizado Previo Parcial (PPR)**. La directiva permite un control granular tanto a nivel de datos como de UI, integrando automáticamente argumentos y valores de cierre (closed-over values) en las claves de caché para permitir contenido personalizado.

Por otro lado, el sistema impone un manejo explícito de las operaciones no deterministas y de las APIs de tiempo de ejecución mediante el uso de límites de `<Suspense>`, asegurando la generación de un **"esqueleto estático" (static shell)** optimizado que mejora la velocidad de carga inicial y la navegación del lado del cliente.


---


## 1. Configuración y Activación

Para utilizar el nuevo modelo de Componentes de Caché, es imperativo habilitar la bandera correspondiente en el archivo de configuración del proyecto.

* Archivo: `next.config.ts` o `next.config.js`.
* Opción: `experimental: { cacheComponents: true }`.

> Nota de fidelidad: Cuando esta opción está activa, los controladores de ruta (Route Handlers) de tipo GET adoptan el mismo modelo de pre-renderizado que las páginas estándar.


---


## 2. La Directiva use cache

La directiva `use cache` es el motor principal para almacenar los valores de retorno de funciones asíncronas y componentes. Su aplicación se divide en dos niveles operativos:

### Niveles de Aplicación

| Nivel | Descripción | Ejemplo de Uso |
| --- | --- | --- |
| Nivel de Datos | Almacena el resultado de funciones que obtienen o computan datos de forma independiente a la UI. | getProducts(), getUser(id). |
| Nivel de UI | Almacena el renderizado de un componente, página o diseño (layout) completo. | async function BlogPosts(). |

**El sistema genera claves de caché de forma inteligente:**

* **Argumentos:** Los parámetros pasados a la función se vuelven parte de la clave.
* **Valores de Cierre:** Los valores de ámbitos superiores (parent scopes) capturados por la función también se integran en la clave.
* **Resultado:** Esto permite que diferentes entradas produzcan entradas de caché separadas, facilitando la personalización de contenido.


---


## 3. Gestión de Datos y Operaciones en Tiempo de Ejecución

Next.js distingue rigurosamente entre datos que pueden conocerse en tiempo de compilación y aquellos que solo están disponibles cuando el usuario realiza una solicitud.

### APIs de Tiempo de Ejecución

El acceso a las siguientes APIs requiere manejo específico:

* **cookies:** Datos de cookies del usuario.
* **headers:** Cabeceras de la solicitud.
* **searchParams:** Parámetros de consulta en la URL.
* **params:** Parámetros de rutas dinámicas.

**Regla de Oro:** Cualquier componente que acceda a estas APIs debe estar envuelto en un límite de `<Suspense>`. El contenido estático se incluye en el shell, mientras que los datos de estas APIs se transmiten (stream) en tiempo de ejecución.

**Operaciones Deterministas vs. No Deterministas**

El framework exige un tratamiento diferenciado según la naturaleza de la operación:

1. **Operaciones Deterministas:** Incluyen E/S síncrona, importaciones de módulos y computaciones puras. Se ejecutan durante el pre-renderizado y su salida se incluye automáticamente en el HTML estático.
2. **Operaciones No Deterministas:** Ejemplos como Math.random(), Date.now() o crypto.randomUUID().
  * **Para valores únicos por solicitud:** Se debe llamar a connection() antes de la operación y envolver el componente en `<Suspense>`.
  * **Para valores compartidos:** Se puede aplicar use cache para que todos los usuarios vean el mismo valor hasta la próxima revalidación.


---


## 4. Arquitectura de Renderizado: Partial Prerendering (PPR)

Con los Componentes de Caché habilitados, el *Renderizado Previo Parcial (PPR)* es el comportamiento por defecto. Este modelo busca optimizar la entrega de contenido dividiendo la página en dos partes:

* **Shell Estático:** Compuesto por HTML (para carga inicial) y una carga útil de **RSC** serializada (para navegación entre páginas). Incluye todo lo marcado con use cache, operaciones deterministas y los fallbacks de `<Suspense>`.
* **Contenido en Streaming:** Aquellos componentes que dependen de datos frescos (sin use cache) o APIs de tiempo de ejecución se resuelven después de que el shell ha sido enviado.

**Manejo de Errores de Pre-renderizado**

Si un componente accede a datos no almacenados en caché fuera de un límite de `<Suspense>` y no tiene la directiva use cache, Next.js lanzará el error: **"Uncached data was accessed outside of a Suspense boundary"** tanto en desarrollo como en tiempo de compilación.

**Exclusión Voluntaria (Opting out)**

Es posible forzar a que toda la aplicación se renderice solo en tiempo de ejecución (sin shell estático) colocando un límite de `<Suspense>` con un fallback vacío sobre el cuerpo del documento en el Root Layout.


---


## 5. Implementación Práctica: Ejemplo Integrado

El siguiente escenario ilustra cómo interactúan los diferentes elementos en una sola página (ej. /blog):

1. **Encabezado (Estático):** Operación determinista, se incluye en el shell.
2. **Publicaciones del Blog (Cached):** Utiliza use cache. Se incluyen en el shell estático.
3. **Preferencias de Usuario (Streaming):** Envueltas en `<Suspense>`. No usan use cache porque requieren datos frescos. El shell muestra un cargando mientras los datos viajan al cliente.
4. **Actualización de Datos:** Al publicar una nueva entrada, una llamada a `updateTag` puede expirar la caché de las publicaciones, forzando una actualización para el próximo visitante.

---

## 6. Control Fino: cacheLife y cacheTag

El sistema de caché se puede potenciar utilizando `cacheLife` y `cacheTag`. Estos permiten definir cuánto tiempo vive la caché y cómo invalidarla programáticamente.

### `cacheLife`
Desacopla el tiempo de caché de la lógica del componente mediante perfiles predefinidos (`seconds`, `minutes`, `hours`, `days`, `weeks`, `max`) o perfiles ajustables que se pueden definir centralmente en `next.config.ts`.

### `cacheTag`
Permite etiquetar el resultado de una función con nombres específicos para la **revalidación bajo demanda**. Si un dato se actualiza, podés usar `revalidateTag` apuntando a esa etiqueta para expirar específicamente ese fragmento de caché.

### Ejemplo Práctico

```tsx
import {
  cacheLife, cacheTag
} from 'next/cache';

export async function getProfile(userId: string) {
  'use cache';
  
  // Etiquetamos la caché. Útil para revalidar al actualizar el perfil:
  cacheTag(`profile-${userId}`);
  
  // Definimos su tiempo de vida según el perfil 'weeks'
  cacheLife('weeks');

  const res = await fetch(`https://api.tuapp.com/users/${userId}`);
  return res.json();
}
```

Luego, en una Server Action, cuando la DB es actualizada, podés purgar la caché:

```tsx
'use server';
import { revalidateTag } from 'next/cache';

export async function updateProfile(userId: string, data: any) {
  // 1. Guardar en DB...
  // await db.user.update(...);
  
  // 2. Invalidar caché para este usuario
  revalidateTag(`profile-${userId}`);
}
```

---

# 🚀 Conclusión

Next.js no es difícil.

👉 Si entendés el sistema, dominás la performance.

