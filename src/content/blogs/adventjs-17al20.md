---
title: Resolución de retos de AdventJS (retos 17 al 20)
img: /adventjs.jpeg
readtime: 15
description: En este post explicaré la resolución de los retos de AdventJS 2025 retos 17 al 20.
author: Axel Sparta
date: 2025-12-29
---

# Resolución de retos de AdventJS (retos 17 al 20)

En este artículo quiero compartir mi resolución de los retos de AdventJS 2025 comparándola con la solución de la IA y aprendiendo sobre como ir mejorando cada reto.

---

## Reto 17 - FÁCIL

### Enunciado
En el Polo Norte han montado un **panel de luces navideñas** 🎄✨ para decorar el taller. Cada luz puede estar encendida con un color o apagada.

El panel se representa como una **matriz** donde cada celda puede ser:

- `'.'` → luz apagada
- `'R'` → luz roja
- `'G'` → luz verde
Los elfos quieren saber si en el panel existe una **línea de 4 luces del mismo color** encendidas y **alineadas** (solo horizontal ↔ o vertical ↕). Las luces apagadas (`'.'`) no cuentan.


### Solución
En mi solución simplemente hice un bucle para recorrer la matriz y comprobar si hay una línea de 4 luces del mismo color encendidas y alineadas, si lo encuentra devuelve `true` y se termina de ejecutar la función, si termina de recorrer la matriz y no encuentra ninguna línea de 4 luces del mismo color encendidas y alineadas devuelve `false`.

En la solución de la IA se hace lo mismo pero con menos código y con mejores validaciones siendo así el código más limpio y eficiente.

```ts
// MI SOLUCIÓN:
function hasFourLights(board: string[][]): boolean {
  const rowsLength = board.length
  const colsLength = board[0].length

  if (rowsLength < 4 && colsLength < 4) return false

  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    const row = board[rowIndex]

    for (let cellIndex = 0; cellIndex < row.length; cellIndex++){
      const cell = row[cellIndex]
      if (cell === '.') continue

      if (rowsLength >= 4) {
        // comprobaciones verticales
        if (
          board[rowIndex + 1]?.[cellIndex] === cell &&
          board[rowIndex + 2]?.[cellIndex] === cell &&
          board[rowIndex + 3]?.[cellIndex] === cell
        ) {
          return true
        }
      }

      if (colsLength >= 4) {
        // comprobaciones horizontales
        if (
          board[rowIndex]?.[cellIndex +1] === cell &&
          board[rowIndex]?.[cellIndex +2] === cell &&
          board[rowIndex]?.[cellIndex+3] === cell
        ) {
          return true
        }
      }

    }
  }
  return false
}

// SOLUCIÓN IA:
function hasFourLights(board: string[][]): boolean {
  const rowsLength = board.length
  const colsLength = board[0].length

  for (let rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
    for (let cellIndex = 0; cellIndex < colsLength; cellIndex++) {
      const color = board[rowIndex][cellIndex]
      if (color === '.') continue

      // comprobaciones verticales
      if (rowIndex + 3 < rowsLength) {
        if (
          board[rowIndex + 1][cellIndex] === color &&
          board[rowIndex + 2][cellIndex] === color &&
          board[rowIndex + 3][cellIndex] === color
        ) {
          return true
        }
      }

      // comprobaciones horizontales
      if (cellIndex + 3 < colsLength) {
        if (
          board[rowIndex][cellIndex + 1] === color &&
          board[rowIndex][cellIndex + 2] === color &&
          board[rowIndex][cellIndex + 3] === color
        ) {
          return true
        }
      }
    }
  }

  return false
}

// EJEMPLOS:
hasFourLights([
  ['.', '.', '.', '.', '.'],
  ['R', 'R', 'R', 'R', '.'],
  ['G', 'G', '.', '.', '.']
])
// true → hay 4 luces rojas en horizontal

hasFourLights([
  ['.', 'G', '.', '.'],
  ['.', 'G', '.', '.'],
  ['.', 'G', '.', '.'],
  ['.', 'G', '.', '.']
])
// true → hay 4 luces verdes en vertical

hasFourLights([
  ['R', 'G', 'R'],
  ['G', 'R', 'G'],
  ['G', 'R', 'G']
])
// false → no hay 4 luces del mismo color seguidas
```

---

## Reto 18 - MEDIO

### Enunciado

El panel de luces navideñas 🎄✨ del taller ha sido un éxito total. Pero los elfos quieren ir un paso más allá: ahora quieren detectar si hay una **línea de 4 luces del mismo color** también en diagonal.

El panel sigue siendo una *matriz* donde cada celda puede ser:

- `'.'` → luz apagada
- `'R'` → luz roja
- `'G'` → luz verde
Ahora tu función debe devolver `true` si existe una línea de 4 luces del mismo color encendidas y alineadas, ya sea **horizontal ↔, vertical ↕ o diagonal ↘↙**.

### Solución
En mi solución utilicé la del reto anterior y simplemente le agregué dos comprobaciones adicionales dentro del bucle para comprobar las diagonales.

```ts
// MI SOLUCIÓN:
function hasFourInARow(board: string[][]): boolean {
  const rowsLength = board.length
  const colsLength = board[0].length

  for (let rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
    for (let colIndex = 0; colIndex < colsLength; colIndex++) {
      const color = board[rowIndex][colIndex]
      if (color === '.') continue

      // comprobaciones verticales
      if (rowIndex + 3 < rowsLength) {
        if (
          board[rowIndex + 1][colIndex] === color &&
          board[rowIndex + 2][colIndex] === color &&
          board[rowIndex + 3][colIndex] === color
        ) return true
      }

      // comprobaciones horizontales
      if (colIndex + 3 < colsLength) {
        if (
          board[rowIndex][colIndex + 1] === color &&
          board[rowIndex][colIndex + 2] === color &&
          board[rowIndex][colIndex + 3] === color
        ) return true
      }

      // comprobaciones diagonal derecha abajo
      if (colIndex + 3 < colsLength && rowIndex + 3 < rowsLength) {
        if (
          board[rowIndex + 1][colIndex + 1] === color &&
          board[rowIndex + 2][colIndex + 2] === color &&
          board[rowIndex + 3][colIndex + 3] === color
        ) return true
      }

      // comprobaciones diagonal izquierda abajo
      if (colIndex - 3 >= 0 && rowIndex + 3 < rowsLength) {
        if (
          board[rowIndex + 1][colIndex - 1] === color &&
          board[rowIndex + 2][colIndex - 2] === color &&
          board[rowIndex + 3][colIndex - 3] === color
        ) return true
      }
    }
  }

  return false
}

// EJEMPLOS:
hasFourInARow([
  ['R', '.', '.', '.'],
  ['.', 'R', '.', '.'],
  ['.', '.', 'R', '.'],
  ['.', '.', '.', 'R']
])
// true → hay 4 luces rojas en diagonal ↘

hasFourInARow([
  ['.', '.', '.', 'G'],
  ['.', '.', 'G', '.'],
  ['.', 'G', '.', '.'],
  ['G', '.', '.', '.']
])
// true → hay 4 luces verdes en diagonal ↙

hasFourInARow([
  ['R', 'R', 'R', 'R'],
  ['G', 'G', '.', '.'],
  ['.', '.', '.', '.'],
  ['.', '.', '.', '.']
])
// true → hay 4 luces rojas en horizontal

hasFourInARow([
  ['R', 'G', 'R'],
  ['G', 'R', 'G'],
  ['G', 'R', 'G']
])
// false → no hay 4 luces del mismo color seguidas
```

---

## Reto 19 - FÁCIL

### Enunciado
¡El GPS del trineo se ha vuelto loco! 😱 Papá Noel tiene los **tramos de su viaje**, pero están todos desordenados.

Tu misión es **reconstruir la ruta completa** desde el origen hasta el destino final.

Ten en cuenta: **El primer elemento del array es siempre el primer tramo del viaje**. A partir de ahí, debes ir conectando los destinos con los siguientes orígenes.

🔎 A tener en cuenta:

- No hay rutas duplicadas ni ciclos en el camino de Papá Noel.
- Puede haber tramos que no pertenezcan a la ruta; estos deben ignorarse.

### Solución
En mi solución utilicé un while para ir agregando los tramos a la ruta, y encontrando el siguiente hasta que no haya más tramos.

En la solución de la IA se utiliza un Map para indexar los tramos, lo que hace que la búsqueda sea más rápida. Luego, como mi solución, utiliza un bucle while para ir agregando los tramos a la ruta, y encontrando el siguiente hasta que no haya más tramos.

```ts
// MI SOLUCIÓN:
function revealSantaRoute(routes: string[][]): string[] {
  const result = [...routes[0]]

  let nextRoute = routes.findIndex(route => route[0] === result[result.length - 1])
  while (nextRoute !== -1) {
    result.push(routes[nextRoute][1])
    nextRoute = routes.findIndex(route => route[0] === result[result.length - 1])
  }

  return result
}

// SOLUCIÓN IA:
function revealSantaRoute(routes: string[][]): string[] {
  if (routes.length === 0) return [];

  // 1. Creamos un mapa de Origen -> Destino
  // Esto nos permite "saltar" directamente al siguiente tramo
  const routeMap = new Map<string, string>();
  for (const [origin, destination] of routes) {
    routeMap.set(origin, destination);
  }

  // 2. Empezamos con el primer tramo del array original
  const firstRoute = routes[0];
  const result: string[] = [firstRoute[0], firstRoute[1]];

  // 3. Reconstruimos la cadena
  let lastDestination = firstRoute[1];

  // Mientras el mapa tenga un origen que coincida con el último destino...
  while (routeMap.has(lastDestination)) {
    const nextCity = routeMap.get(lastDestination)!;
    result.push(nextCity);
    lastDestination = nextCity;
  }

  return result;
}

// EJEMPLOS:
revealSantaRoute([
  ['MEX', 'CAN'],
  ['UK', 'GER'],
  ['CAN', 'UK']
])
// → ['MEX', 'CAN', 'UK', 'GER']

revealSantaRoute([
  ['USA', 'BRA'],
  ['JPN', 'PHL'],
  ['BRA', 'UAE'],
  ['UAE', 'JPN'],
  ['CMX', 'HKN']
])
// → ['USA', 'BRA', 'UAE', 'JPN', 'PHL']

revealSantaRoute([
  ['STA', 'HYD'],
  ['ESP', 'CHN']
])
// → ['STA', 'HYD']
```

---

## Reto 20 - FÁCIL

### Enunciado
En el taller de Santa, los elfos están guardando regalos 🎁 en un **almacén vertical**. Los regalos se dejan caer uno a uno por una columna y se van apilando.

El almacén es una matriz con `#` regalos y `.` espacios vacíos. Debes crear una función `dropGifts` que reciba el estado del almacén y un array con las columnas donde se dejan caer los regalos.

**Reglas de la caída:**

- El regalo cae por la columna indicada desde arriba.
- Se coloca en la **celda vacía (.) más baja** de esa columna.
- Si la columna está llena, el regalo se ignora.


### Solución

En mi solución realicé dos bucles anidados, el primero para cada regalo que se almacenará y el segundo que recorre cada fila del almacen de orden inverso para encontrar la primer celda vacía.
Si la encuentra rompe el bucle y pasa al siguiente regalo.
Si no encuentra ninguna celda vacía, se ignora el regalo.

En la solución de la IA mejora la inmutabilidad con map y crea una copia del almacen para no mutar el original, también mejora la legibilidad con for...of y el uso de break.

```ts
// MI SOLUCIÓN:
function dropGifts(warehouse: string[][], drops: number[]): string[][] {
  for (let dropIndex = 0; dropIndex < drops.length; dropIndex++) {
    for (let rowIndex = warehouse.length - 1; rowIndex >= 0; rowIndex--) {
      const cell = warehouse[rowIndex][drops[dropIndex]]
      if (cell === '.') {
        warehouse[rowIndex][drops[dropIndex]] = '#'
        break
      }
    }
  }

  return warehouse
}

// SOLUCIÓN IA:
function dropGifts(warehouse: string[][], drops: number[]): string[][] {
  // 1. Creamos una copia profunda para evitar mutar el original
  const newWarehouse = warehouse.map(row => [...row]);

  // 2. Iteramos sobre cada columna donde cae un regalo
  for (const colIndex of drops) {
    // 3. Buscamos de abajo hacia arriba la primera celda vacía
    for (let r = newWarehouse.length - 1; r >= 0; r--) {
      if (newWarehouse[r][colIndex] === '.') {
        newWarehouse[r][colIndex] = '#';
        break; // Regalo colocado, pasamos al siguiente drop
      }
    }
  }

  return newWarehouse;
}

// EJEMPLOS:
dropGifts(
  [
    ['.', '.', '.'],
    ['.', '#', '.'],
    ['#', '#', '.']
  ],
  [0]
)
/*
[
  ['.', '.', '.'],
  ['#', '#', '.'],
  ['#', '#', '.']
]
*/

dropGifts(
  [
    ['.', '.', '.'],
    ['#', '#', '.'],
    ['#', '#', '#']
  ],
  [0, 2]
)
/*
[
  ['#', '.', '.'],
  ['#', '#', '#'],
  ['#', '#', '#']
]
*/

dropGifts(
  [
    ['.', '.', '.'],
    ['.', '.', '.'],
    ['.', '.', '.']
  ],
  [0, 1, 2]
)
/*
[
  ['.', '.', '.'],
  ['.', '.', '.'],
  ['#', '#', '#']
]
*/

dropGifts(
  [
    ['#', '#']
    ['#', '#']
  ],
  [0, 0]
)
/*
[
  ['#', '#']
  ['#', '#']
]
```
