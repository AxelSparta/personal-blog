---
title: Resolución de retos de AdventJS (retos 21 al 25)
img: /adventjs.jpeg
readtime: 15
description: En este post explicaré la resolución de los retos de AdventJS 2025 retos 21 al 25.
author: Axel Sparta
date: 2025-12-30
---

# Resolución de retos de AdventJS (retos 21 al 25)

En este artículo quiero compartir mi resolución de los retos de AdventJS 2025 comparándola con la solución de la IA y aprendiendo sobre como ir mejorando cada reto.

---

## Reto 21 - MEDIO

### Enunciado

¡El almacén vertical de Santa se ha modernizado! Ahora, además de apilar los regalos, hay un robot 🤖 en el almacen que recoje los regalos si hay una fila completa.

El almacén es una matriz con `#` regalos y `.` espacios vacíos. Debes crear una función `clearGifts` que reciba el estado del almacén y un array con las columnas donde se dejan caer los regalos.

**Reglas de la caída:**

- El regalo cae por la columna indicada desde arriba.
- Se coloca en la **celda vacía (.) más baja** de esa columna.
- Si la columna está llena, el regalo se ignora.

**Regla del robot de limpieza:**

- Si al colocar un regalo, una fila se completa totalmente con regalos `(#)`, esa fila **desaparece**.
- Todas las filas que estaban por encima de la fila eliminada **bajan una posición**.
- Al eliminarse una fila, aparece una nueva fila vacía (`.`) en la parte superior para mantener el tamaño del almacén.

### Solución

En mi solución tomé la anterior y cada vez que se agrega un regalo se verifica si hay una fila completa, si es así se elimina y se agregan las filas vacías al inicio.

En la solución de la IA al igual que el reto anterior mejora la inmutabilidad del array original creando una copia del mismo y modificando la copia en lugar de modificar el original. También mejora la eficiencia del "robot" enfocándose en la fila donde cayó el regalo y verificando si hay una fila completa.

```ts
// MI SOLUCIÓN:
function clearGifts(warehouse: string[][], drops: number[]): string[][] {
  for (let dropIndex = 0; dropIndex < drops.length; dropIndex++) {
    for (let rowIndex = warehouse.length - 1; rowIndex >= 0; rowIndex--) {
      const cell = warehouse[rowIndex][drops[dropIndex]]
      if (cell === '.') {
        warehouse[rowIndex][drops[dropIndex]] = '#'
        break
      }
    }
    for (let rowIndex = warehouse.length - 1; rowIndex >= 0; rowIndex--) {
      const row = warehouse[rowIndex]
      const rowLength = row.length
      if (row.every(cell => cell === '#')) {
        warehouse.splice(rowIndex, 1)
        warehouse.unshift(new Array(rowLength).fill('.'))
        break
      }
    }
  }
  return warehouse
}

// SOLUCIÓN IA:
function clearGifts(warehouse: string[][], drops: number[]): string[][] {
  // 1. Copia inmutable del almacén
  const board = warehouse.map(row => [...row])
  const rowCount = board.length
  const colCount = board[0]?.length || 0

  for (const colIndex of drops) {
    // 2. Caída del regalo
    let placedRow = -1
    for (let r = rowCount - 1; r >= 0; r--) {
      if (board[r][colIndex] === '.') {
        board[r][colIndex] = '#'
        placedRow = r
        break
      }
    }

    // 3. Robot de limpieza: Si el regalo se colocó, revisamos filas
    if (placedRow !== -1) {
      // Filtramos las filas que NO están llenas
      const remainingRows = board.filter(row => row.some(cell => cell === '.'))

      // Calculamos cuántas filas se eliminaron
      const deletedCount = rowCount - remainingRows.length

      if (deletedCount > 0) {
        // Creamos las nuevas filas vacías necesarias
        const newEmptyRows = Array.from({ length: deletedCount }, () =>
          new Array(colCount).fill('.')
        )

        // Reemplazamos el contenido del board (manteniendo la referencia o reasignando)
        const updatedBoard = [...newEmptyRows, ...remainingRows]
        for (let i = 0; i < rowCount; i++) {
          board[i] = updatedBoard[i]
        }
      }
    }
  }

  return board
}

// EJEMPLOS:
clearGifts(
  [
    ['.', '.', '.'],
    ['.', '.', '.'],
    ['#', '.', '#']
  ],
  [1]
)
/*
1. El regalo cae en la columna 1
2. La fila 2 se convierte en [# # #].
3. La fila 2 está completa, el robot la limpia.
6. Se añade una nueva fila vacía en la posición 0.

Resultado:
[
  ['.', '.', '.'],
  ['.', '.', '.'],
  ['.', '.', '.']
]
*/

clearGifts(
  [
    ['.', '.', '#'],
    ['#', '.', '#'],
    ['#', '.', '#']
  ],
  [0, 1, 2]
)

/*
1. El regalo cae en la columna 0
2. El regalo cae en la columna 1
3. La fila 2 se convierte en [# # #]
4. La fila 2 está completa, el robot la limpia

Por ahora queda así:
[
  ['.', '.', '.']
  ['#', '.', '#'],
  ['#', '.', '#'],
]

5. El regalo cae en la columna 2

Resultado:
[
  ['.', '.', '#'],
  ['#', '.', '#'],
  ['#', '.', '#']
]
*/
```

---

## Reto 22 - DIFÍCIL

### Enunciado

Papá Noel 🎅 está probando un nuevo **simulador de trineo** dentro de un laberinto en el taller. El laberinto se representa como una matriz de caracteres.

Tu tarea es implementar una función que determine si es posible llegar a la salida `(E)` partiendo desde la posición inicial `(S)`.

**Reglas del laberinto:**

- `S`: Posición inicial de Santa.
- `E`: Salida del laberinto.
- `.`: Camino libre.
- `#`: Pared (bloquea el paso).
- Movimientos permitidos: arriba, abajo, izquierda y derecha.
- Solo hay una `S` y una sola `E`.

### Solución

En mi solución utilicé un array para almacenar las coordenadas a visitar y un objeto para almacenar las coordenadas visitadas, luego con un do...while recorrí el array de coordenadas a visitar y para cada coordenada verificaba si era la salida, si no lo era, agregaba las coordenadas de las celdas adyacentes al array de coordenadas a visitar.

En la solución de la IA es similar sólo que en lugar de usar un do...while utiliza un while siendo así más limpio y legible, también es más eficiente a la hora de buscar las celdas vacías.

```ts
// MI SOLUCIÓN:
function canEscape(maze: string[][]): boolean {
  let row = 0
  let col = 0

  const nextCoords: Array<[number, number]> = [[0, 0]]
  const visitedCoords: Record<string, boolean> = {}

  do {
    row = nextCoords[0][0]
    col = nextCoords[0][1]

    if (
      maze[row]?.[col + 1] === 'E' ||
      maze[row + 1]?.[col] === 'E' ||
      maze[row]?.[col - 1] === 'E' ||
      maze[row - 1]?.[col] === 'E'
    )
      return true

    // derecha
    if (maze[row]?.[col + 1] === '.' && !visitedCoords[`r${row}c${col + 1}`])
      nextCoords.push([row, col + 1])

    // abajo
    if (maze[row + 1]?.[col] === '.' && !visitedCoords[`r${row + 1}c${col}`])
      nextCoords.push([row + 1, col])

    // izquierda
    if (maze[row]?.[col - 1] === '.' && !visitedCoords[`r${row}c${col - 1}`])
      nextCoords.push([row, col - 1])

    // arriba
    if (maze[row - 1]?.[col] === '.' && !visitedCoords[`r${row - 1}c${col}`])
      nextCoords.push([row - 1, col])

    nextCoords.shift()
    visitedCoords[`r${row}c${col}`] = true
  } while (nextCoords.length > 0)

  return false
}

// SOLUCIÓN IA:
function canEscape(maze: string[][]): boolean {
  const rows = maze.length
  const cols = maze[0].length

  // Encontrar la posición inicial de santa
  let startR: number, startC: number

  for (let r = 0; r < rows; r++) {
    const c = maze[r].indexOf('S')
    if (c !== -1) {
      startC = c
      startR = r
      break
    }
  }

  const queue: [number, number][] = [[startR, startC]]
  const visited = new Set<string>()
  visited.add(`${startR},${startC}`)

  const dirs = [
    // der
    [0, 1],
    // abajo
    [1, 0],
    // izq
    [0, -1],
    // arriba
    [-1, 0]
  ]

  while (queue.length > 0) {
    const [r, c] = queue.shift()
    if (maze[r][c] === 'E') return true

    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc

      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        maze[nr][nc] !== '#' &&
        !visited.has(`${nr},${nc}`)
      ) {
        visited.add(`${nr},${nc}`)
        queue.push([nr, nc])
      }
    }
  }

  return false
}

// EJEMPLOS:
canEscape([
  ['S', '.', '#', '.'],
  ['#', '.', '#', '.'],
  ['.', '.', '.', '.'],
  ['#', '#', '#', 'E']
])
// → true

canEscape([
  ['S', '#', '#'],
  ['.', '#', '.'],
  ['.', '#', 'E']
])
// → false

canEscape([['S', 'E']])
// → true

canEscape([
  ['S', '.', '.', '.', '.'],
  ['#', '#', '#', '#', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '#', '#', '#', '#'],
  ['.', '.', '.', '.', 'E']
])
// → true

canEscape([
  ['S', '.', '.'],
  ['.', '.', '.'],
  ['#', '#', '#'],
  ['.', '.', 'E']
])
// → false
```

---

## Reto 23 - MEDIO

### Enunciado

Papá Noel 🎅 tiene que repartir regalos en un pueblo representado como un **mapa en cuadrícula**.

Cada celda del mapa puede ser:

- `'S'` → Punto de partida de Papá Noel
- `'G'` → Casa que debe recibir un regalo
- `'.'` → Camino libre
- `'#'` → Obstáculo (no se puede pasar)

Papá Noel realiza entregas independientes para cada regalo. Sale de `'S'`, entrega el regalo en una casa `'G'` y vuelve inmediatamente a `'S'` para recoger el siguiente. Sin embargo, para este reto, solo queremos calcular la suma de las distancias mínimas de ida desde `'S'` hasta cada casa `'G'`.

**Tu tarea**

Escribe la función `minStepsToDeliver(map)` que devuelva el **número total de pasos** necesarios para llegar a todas las casas con regalos desde la posición inicial.

**Ten en cuenta:**

- Siempre se parte de la posición inicial `'S'`.
- Para cada regalo, calcula la distancia mínima desde `'S'` hasta esa casa `'G'`.
- No puedes atravesar obstáculos (`'#'`).
- Si alguna casa con regalo es inalcanzable, la función debe devolver `-1`.

### Solución

En mi solución reutilicé la resolución del reto anterior, y a cada celda vacía que tenía que visitar o recorrer le agregué un dato más para obtener los pasos recorridos.

En la solución de la IA es similar pero mejora la eficiencia al contar los regalos (ya que la función tiene que devolver -1 si un regalo no es alcanzado) y solo sumar los pasos cuando encuentra una casa con regalo, además de retornar inmediatamente si ya encontró todos los regalos, mejoró la legibilidad y la lógica de mi solución.

```ts
// MI SOLUCIÓN:
function minStepsToDeliver(map: string[][]): number {
  const rows = map.length

  const cols = map[0].length

  // Encontrar la posición inicial de santa
  let startR: number,
    startC: number,
    steps: number = 0

  for (let r = 0; r < rows; r++) {
    const c = map[r].indexOf('S')
    if (c !== -1) {
      startC = c
      startR = r
      break
    }
  }

  const queue: [number, number, number][] = [[startR, startC, 0]]
  const visited = new Set<string>()
  visited.add(`${startR},${startC}`)

  const dirs = [
    // der
    [0, 1],
    // abajo
    [1, 0],
    // izq
    [0, -1],
    // arriba
    [-1, 0]
  ]

  while (queue.length > 0) {
    const [r, c, step] = queue.shift()
    if (map[r][c] === 'G') steps += step
    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        map[nr][nc] !== '#' &&
        !visited.has(`${nr},${nc}`)
      ) {
        visited.add(`${nr},${nc}`)
        queue.push([nr, nc, step + 1])
      }
    }
  }
  return steps > 0 ? steps : -1
}

// SOLUCIÓN IA:
function minStepsToDeliver(map: string[][]): number {
  const rows = map.length
  const cols = map[0].length

  // Encontrar la posición inicial de santa
  let startR: number,
    startC: number,
    totalGifts: number = 0

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (map[r][c] === 'S') {
        startR = r
        startC = c
      } else if (map[r][c] === 'G') {
        totalGifts++
      }
    }
  }

  if (totalGifts === 0) return 0

  const queue: [number, number, number][] = [[startR, startC, 0]]
  const visited = new Set<string>()
  visited.add(`${startR},${startC}`)

  const dirs = [
    // der
    [0, 1],
    // abajo
    [1, 0],
    // izq
    [0, -1],
    // arriba
    [-1, 0]
  ]

  let totalSteps = 0
  let giftsFound = 0

  while (queue.length > 0) {
    const [r, c, step] = queue.shift()
    if (map[r][c] === 'G') {
      totalSteps += step
      giftsFound++
      if (giftsFound === totalGifts) return totalSteps
    }

    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc

      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        map[nr][nc] !== '#' &&
        !visited.has(`${nr},${nc}`)
      ) {
        visited.add(`${nr},${nc}`)
        queue.push([nr, nc, step + 1])
      }
    }
  }

  return giftsFound === totalGifts ? totalSteps : -1
}

// EJEMPLOS:
minStepsToDeliver([
  ['S', '.', 'G'],
  ['.', '#', '.'],
  ['G', '.', '.']
])
// Resultado: 4

/* 
Explicación:
- Distancia mínima de S (0,0) a G (0,2): 2 pasos
- Distancia mínima de S (0,0) a G (2,0): 2 pasos
- Total: 2 + 2 = 4
*/

minStepsToDeliver([
  ['S', '#', 'G'],
  ['#', '#', '.'],
  ['G', '.', '.']
])
// Resultado: -1
// (La casa en (0,2) es inalcanzable por los obstáculos)

minStepsToDeliver([['S', 'G']])
// Resultado: 1
```

---

## Reto 24 - MEDIO

### Enunciado

En el Polo Norte, los elfos tienen **dos árboles binarios mágicos que generan energía** 🌲🌲 para mantener encendida la estrella navideña ⭐️. Sin embargo, para que funcionen correctamente, los árboles deben estar en perfecta sincronía **como espejos **🪞.

**Dos árboles binarios son espejos si:**

- Las raíces de ambos árboles tienen el mismo valor.
- Cada nodo del primer árbol debe tener su correspondiente nodo en la posición opuesta en el segundo árbol.
  Y el árbol se representa con tres propiedades `value`, `left` y `right`. Dentro de estas dos últimas va mostrando el resto de ramas (si es que tiene):

```ts
const tree = {
  value: '⭐️',
  left: {
    value: '🎅'
    // left: {...}
    // right: { ... }
  },
  right: {
    value: '🎁'
    // left: { ... }
    // right: { ...&nbsp;}
  }
}
```

Santa necesita tu ayuda para verificar si los árboles están sincronizados para que la estrella pueda seguir brillando. **Debes devolver un array** donde la **primera posición indica si los árboles están sincronizados y la segunda posición devuelve el valor de la raíz del primer árbol.**

### Solución

En mi solución creé una función recursiva que compara los valores de los nodos y verifica si las ramas izquierdas y derechas son reflejadas entre sí.

En la solcución de la IA es similar pero mejora la legibilidad y la lógica de la función recursiva al manejar los casos base de manera más clara y estructurada.

```ts
// MI SOLUCIÓN:
function isTreesSynchronized(
  tree1: { value: string; left?: any; right?: any } | undefined,
  tree2: { value: string; left?: any; right?: any } | undefined
): [boolean, string] {
  function isTreesReflected(
    tree1: { value: string; left?: any; right?: any } | undefined,
    tree2: { value: string; left?: any; right?: any } | undefined
  ): boolean {

    if (tree1.value !== tree2.value) return false

    if(tree1.left) return isTreesReflected(tree1.left, tree2.right)
    if(tree1.right) return isTreesReflected(tree1.right, tree2.left)

    return true
  }

  return [isTreesReflected(tree1, tree2), tree1.value]
}


// SOLUCIÓN IA:
function isTreesSynchronized(
  tree1: { value: string; left?: any; right?: any } | undefined,
  tree2: { value: string; left?: any; right?: any } | undefined
): [boolean, string] {

  function isMirror(
    node1: any | undefined,
    node2: any | undefined
  ): boolean {
    // 1. Si ambos son nulos/undefined, están sincronizados (espejos de la nada)
    if (!node1 && !node2) return true;

    // 2. Si uno existe y el otro no, o los valores son distintos, NO son espejos
    if (!node1 || !node2 || node1.value !== node2.value) return false;

    // 3. RECURSIÓN CRUZADA:
    // Izquierda de 1 con Derecha de 2 Y Derecha de 1 con Izquierda de 2
    return (
      isMirror(node1.left, node2.right) &&
      isMirror(node1.right, node2.left)
    );
  }

  // Si tree1 no existe, no podemos devolver su valor, pero el problema asume que existe una raíz
  const synchronized = isMirror(tree1, tree2);
  return [synchronized, tree1?.value ?? ""];
}

// EJEMPLOS:
const tree1 = {
  value: '🎄',
  left: { value: '⭐' },
  right: { value: '🎅' }
}

const tree2 = {
  value: '🎄',
  left: { value: '🎅' }
  right: { value: '⭐' },
}

isTreesSynchronized(tree1, tree2) // [true, '🎄']

/*
  tree1          tree2
   🎄              🎄
  / \             / \
⭐   🎅         🎅   ⭐
*/

const tree3 = {
  value: '🎄',
  left: { value: '🎅' },
  right: { value: '🎁' }
}

isTreesSynchronized(tree1, tree3) // [false, '🎄']

const tree4 = {
  value: '🎄',
  left: { value: '⭐' },
  right: { value: '🎅' }
}

isTreesSynchronized(tree1, tree4) // [false, '🎄']

isTreesSynchronized(
  { value: '🎅' },
  { value: '🧑‍🎄' }
) // [false, '🎅']
```

---

## Reto 25 - MEDIO

### Enunciado

¡Ya hemos repartido todos los regalos! De vuelta al taller, ya comienzan los preparativos para el año que viene.

Un elfo genio está creando un lenguaje de programación mágico 🪄, que ayudará a simplificar la entrega de regalos a los niños en 2025.

Los programas siempre empiezan con el valor `0` y el lenguaje es una cadena de texto donde cada caracter representa una instrucción:

- `>` Se mueve a la siguiente instrucción
- `+` Incrementa en 1 el valor actual
- `-` Decrementa en 1 el valor actual
- `[` y `]`: Bucle. Si el valor actual es `0`, salta a la instrucción después de `]`. Si no es 0, vuelve a la instrucción después de `[`
- `{` y `}`: Condicional. Si el valor actual es `0`, salta a la instrucción después de `}`. Si no es 0, sigue a la instrucción después de `{`

Tienes que devolver el valor del programa tras ejecutar todas las instrucciones.

**Nota: Un condicional puede tener un bucle dentro y también un bucle puede tener un condicional. Pero nunca se anidan dos bucles o dos condicionales.**

### Solución

En mi solución creé variables para saber si estoy dentro de un bucle o condicional y si tengo que salir de ellos, además de una variable para guardar la posición del inicio del bucle actual (son muchas), luego recorrí el código caracter por caracter y ejecuté las instrucciones según las reglas con condicionales.

En la solución de la IA es más eficiente al evitar múltiples condicionales anidados y manejar los saltos de bucle y condicional de manera más directa utilizando `indexOf` y `lastIndexOf`, lo que simplifica la lógica (eliminando variables innecesarias) y mejora la legibilidad del código.

```ts
// MI SOLUCIÓN:
function execute(code: string): number {
  let result = 0

  let isInLoop = false
  let hasToExLoop = false
  let currentLoop = -1

  let isInConditional = false
  let hasToExConditional = false

  let i = 0

  while (i < code.length) {
    console.log(i, code[i])
    if (
      code[i] === '>' ||
      (isInLoop && !hasToExLoop && code[i] !== ']') ||
      (isInConditional && !hasToExConditional && code[i] !== '}')
    ) {
      i++
      continue
    }

    if (code[i] === '[') {
      isInLoop = true
      hasToExLoop = result !== 0
      currentLoop = i
      i++
      continue
    }

    if (code[i] === ']') {
      if (result === 0) {
        isInLoop = false
        hasToExLoop = false
        i++
      } else {
        i = currentLoop + 1
      }
      continue
    }

    if (code[i] === '{') {
      isInConditional = true
      hasToExConditional = result !== 0
      i++
      continue
    }

    if (code[i] === '}') {
      isInConditional = false
      hasToExConditional = false
      i++
      continue
    }

    if (code[i] === '+') result++
    if (code[i] === '-') result--
    i++
  }

  return result
}

// SOLUCIÓN IA:
function execute(code: string): number {
  let value = 0
  let i = 0

  // Pre-procesamos los saltos para no buscarlos cada vez (Opcional pero recomendado)
  while (i < code.length) {
    const command = code[i]

    if (command === '+') {
      value++
    } else if (command === '-') {
      value--
    } else if (command === '{') {
      // Condicional: Si es 0, busca el cierre '}' y salta ahí
      if (value === 0) {
        i = code.indexOf('}', i)
      }
    } else if (command === '[') {
      // Bucle: Si es 0, salta al final del bucle
      if (value === 0) {
        i = code.indexOf(']', i)
      }
    } else if (command === ']') {
      // Al llegar al final, si NO es 0, busca el inicio '[' para repetir
      if (value !== 0) {
        // Buscamos hacia atrás el inicio del bucle
        i = code.lastIndexOf('[', i)
        // No incrementamos i aquí para que en la siguiente vuelta lea el '['
        continue
      }
    }
    // El comando '>' simplemente se ignora (pasa a i++)
    i++
  }

  return value
}

// EJEMPLOS:
execute('+++') // 3
execute('+--') // -1
execute('>+++[-]') // 0
execute('>>>+{++}') // 3
execute('+{[-]+}+') // 2
execute('{+}{+}{+}') // 0
execute('------[+]++') // 2
execute('-[++{-}]+{++++}') // 5
```
