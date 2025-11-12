---
# FRONT MATTER: info extra que se puede poner dentro del md
title: Modo claro y oscuro con Astro, Tailwind y ViewTransitions
img: /dark-light-mode.webp
readtime: 15
description: En este blog explicaré cómo utilizar el modo claro y oscuro con Astro, Tailwind y ViewTransitions.
author: Axel Sparta
date: 2025-06-29
---

# ¿Cómo utilizar el modo claro y oscuro con Astro, Tailwind y ViewTransitions?

En este blog explicaré cómo implementé el modo oscuro/claro con Astro, Tailwind y ViewTransitions.

## Características principales del modo oscuro/claro

1. **Leer preferencia por defecto del usuario:** Detectar si el usuario prefiere el modo oscuro o claro.
2. **Poder intercambiar entre modo oscuro/claro:** Permitir al usuario cambiar entre modo oscuro/claro a través de un botón.
3. **Guardar preferencia del usuario:** Recordar la elección del usuario para futuras visitas.
4. **Evitar flash de estilos:** Prevenir el cambio brusco de estilos al cargar o navegar entre páginas.

## Implementación

Utilicé un componente de Astro que incluye un script embebido para gestionar el tema.

### 1. Leer preferencia por defecto del usuario

Primero, creé una función `getTheme` para leer el tema almacenado en **localStorage**. Si no hay una preferencia guardada, se utiliza `matchMedia` para detectar la configuración del sistema. Luego se aplica la clase correspondiente con `setThemePreference`.

El script usa la directiva `is:inline` para que Astro:

- No procese ni optimice el script.
- Inserte el código directamente en el HTML generado.

```html
<!-- src/components/DarkLightMode.astro -->
<button id="theme-toggle-btn">Cambiar tema</button>

<!-- Directiva is:inline para que astro no procese el script -->
<script is:inline>
  const getTheme = () => {
    return (
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    )
  }

  const setThemePreference = () => {
    const theme = getTheme()
    document.documentElement.className = theme
  }

  setThemePreference()
</script>
```

### 2. Poder intercambiar entre modo oscuro/claro

Luego, definí la función `toggleTheme` para alternar entre los temas y guardar la nueva preferencia en **localStorage**. Esta función se ejecuta al hacer clic en el botón.

```javascript
// src/components/DarkLightMode.astro

const toggleTheme = () => {
  const theme = getTheme()
  const newTheme = theme === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', newTheme)
  document.documentElement.className = newTheme
}

// Evento para cambiar el tema
const $themeToggleBtn = document.getElementById('theme-toggle-btn')
$themeToggleBtn.addEventListener('click', toggleTheme)
```

### 3. Persistir preferencia del usuario

Esto funciona bien al recargar la página, pero al usar ViewTransitions para navegar entre rutas, Astro no recarga completamente el documento. Por eso necesitamos un mecanismo que reejecute la lógica al cambiar de ruta.

Entonces, para que el script:

- Lea correctamente el **localStorage** cada vez que se navega a otra página.
- Aplique la clase dark o la elimine según sea necesario.
- Pueda cambiar el tema a través de un evento que se dispara cada vez que el usuario presione un botón.

Necesitamos `astro:page-load`.

### 4. Usar `astro:page-load` y evitar el flash de estilos

El evento `astro:page-load` se dispara:

- Al cargar la primera página.
- Al navegar entre rutas usando enlaces (`<a>`), sin recargar la página completa.

Por eso, colocamos la lógica de cambio de tema también dentro de este evento para mantener el estado correcto.

```html
<!-- src/components/DarkLightMode.astro -->
<button id="theme-toggle-btn">Cambiar tema</button>
<script is:inline>
  const getTheme = () => {
    return (
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    )
  }

  const setThemePreference = () => {
    const theme = getTheme()
    document.documentElement.className = theme
  }

  setThemePreference()

  document.addEventListener('astro:page-load', () => {
    const $themeToggleBtn = document.getElementById('theme-toggle-btn')
    setThemePreference()
    $themeToggleBtn.addEventListener('click', () => {
      const theme = getTheme()
      const newTheme = theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', newTheme)
      document.documentElement.className = newTheme
    })
  })
</script>
```

De esta forma nos aseguramos de que:

- La preferencia del usuario se aplique correctamente al cargar la página.
- No haya parpadeo de estilos.
- El botón funcione correctamente incluso al navegar entre rutas sin recargar la página.