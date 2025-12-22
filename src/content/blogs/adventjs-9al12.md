---
title: Resolución de retos de AdventJS (retos 9 al 12)
img: /adventjs.jpeg
readtime: 15
description: En este post explicaré la resolución de los retos de AdventJS 2025 retos 9 al 12.
author: Axel Sparta
date: 2025-12-22
---

# Resolución de retos de AdventJS (retos 9 al 12)

En este artículo quiero compartir mi resolución de los retos de AdventJS 2025 comparándola con la solución de la IA y aprendiendo sobre como ir mejorando cada reto.

---

## Reto 9 - DIFÍCIL

### Enunciado

Los elfos han construido un **reno 🦌 robot aspirador** (`@`) para limpiar un poco el taller de cara a las navidades.

El reno se mueve sobre un tablero para **recoger cosas del suelo** (`*`) y debe **evitar obstáculos** (`#`).

Recibirás dos parámetros:

- `board`: un string que representa el tablero.
- `moves`: un string con los movimientos: 'L' (izquierda), 'R' (derecha), 'U' (arriba), 'D' (abajo).

**Reglas del movimiento:**

- Si el reno recoge algo del suelo (`*`) durante los movimientos → devuelve 'success'.
- Si el reno se sale del tablero o choca contra un obstáculo (`#`) → devuelve 'crash'.
- Si el reno no recoge nada ni se estrella → devuelve 'fail'.
  Ten en cuenta que si el reno recoge algo del suelo, ya es 'success', indepentientemente de si en movimientos posteriores se chocase con un obstáculo o saliese del tabler.

**Importante:** Ten en cuenta que en el board la primera y última línea están en blanco y deben descartarse.

### Solución

En mi solución fuí paso a paso creando variables y funciones auxiliares para cuando tenga que hacer los movimientos del reno ir verificando cada posición.

En la solución de la IA, el código es más conciso y directo, utilizando un diccionario de movimientos para evitar múltiples 'if' y una iteración sobre los movimientos para actualizar la posición del reno.

```ts
type Board = string
type Moves = string
type Result = 'fail' | 'crash' | 'success'

// MI SOLUCIÓN
function moveReno(board: Board, moves: Moves): Result {
  // RENOPOSITION: [Y, X]
  const renoPosition = [0, 0]

  // Pasar el board a formato array
  const boardArray = board
    .split('\n')
    .slice(1, -1)
    .map(val => {
      return val.split('')
    })

  // obteniendo la posición del reno
  boardArray.forEach((row, yPosition) => {
    const xPosition = row.findIndex(el => '@' === el)
    if (xPosition !== -1) {
      renoPosition[0] = yPosition
      renoPosition[1] = xPosition
    }
  })

  // helper
  function validatePosition(y: number, x: number) {
    if (!boardArray[y] || !boardArray[y][x] || boardArray[y][x] === '#')
      return 'crash'
    if (boardArray[y][x] === '*') return 'success'
  }

  // iterar movimientos y verificar cada uno
  const movesArray = moves.split('')
  for (let i = 0; i < movesArray.length; i++) {
    if (movesArray[i] === 'U') {
      const validatedPosition = validatePosition(
        renoPosition[0] - 1,
        renoPosition[1]
      )
      if (validatedPosition) {
        return validatedPosition
      } else {
        renoPosition[0]--
      }
    }

    if (movesArray[i] === 'L') {
      const validatedPosition = validatePosition(
        renoPosition[0],
        renoPosition[1] - 1
      )
      if (validatedPosition) {
        return validatedPosition
      } else {
        renoPosition[1]--
      }
    }

    if (movesArray[i] === 'R') {
      const validatedPosition = validatePosition(
        renoPosition[0],
        renoPosition[1] + 1
      )
      if (validatedPosition) {
        return validatedPosition
      } else {
        renoPosition[1]++
      }
    }

    if (movesArray[i] === 'D') {
      const validatedPosition = validatePosition(
        renoPosition[0] + 1,
        renoPosition[1]
      )
      if (validatedPosition) {
        return validatedPosition
      } else {
        renoPosition[0] += 1
      }
    }
  }

  return 'fail'
}

// SOLUCIÓN IA:
function moveReno(board: string, moves: string): string {
  // 1. Preparamos el tablero (sin convertir a array de caracteres, strings son suficientes)
  const rows = board.split('\n').slice(1, -1)

  // 2. Encontramos la posición inicial de forma directa
  let y = rows.findIndex(row => row.includes('@'))
  let x = rows[y].indexOf('@')

  // 3. Diccionario de movimientos (Evita los múltiples 'if')
  const directions: Record<string, [number, number]> = {
    U: [-1, 0],
    D: [1, 0],
    L: [0, -1],
    R: [0, 1]
  }

  // 4. Iteramos sobre los movimientos
  for (const move of moves) {
    const [dy, dx] = directions[move]

    // Calculamos la posible nueva posición
    y += dy
    x += dx

    // 5. Validaciones concisas
    // Verificamos si nos salimos verticalmente (y) o si la fila existe
    const cell = rows[y]?.[x]

    if (cell === undefined || cell === '#') return 'crash'
    if (cell === '*') return 'success'

    // Si es un espacio vacío o el propio reno, el bucle continúa y la posición ya se actualizó
  }

  return 'fail'
}

// EJEMPLOS:
const board = `
.....
.*#.*
.@...
.....
`

moveReno(board, 'D')
// ➞ 'fail' -> se mueve pero no recoge nada

moveReno(board, 'U')
// ➞ 'success' -> recoge algo (*) justo encima

moveReno(board, 'RU')
// ➞ 'crash' -> choca contra un obstáculo (#)

moveReno(board, 'RRRUU')
// ➞ 'success' -> recoge algo (*)

moveReno(board, 'DD')
// ➞ 'crash' -> se choca con la parte de abajo del tablero

moveReno(board, 'UUU')
// ➞ 'success' -> recoge algo del suelo (*) y luego se choca por arriba

moveReno(board, 'RR')
// ➞ 'fail' -> se mueve pero no recoge nada
```

---

## Reto 10 - FÁCIL

### Enunciado

🎄 Profundidad de Magia Navideña
En el Polo Norte, Santa Claus está revisando las cartas mágicas 📩✨ que recibe de los niños de todo el mundo. Estas cartas usan un antiguo lenguaje navideño en el que los corchetes `[` y `]` representan la intensidad del deseo.

Cuanto más profunda sea la anidación de los corchetes, más fuerte es el deseo. Tu misión es averiguar la **máxima profundidad** en la que se anidan los `[]`.

Pero ¡cuidado! Algunas cartas pueden estar **mal escritas**. Si los corchetes no están correctamente balanceados (si se cierra antes de abrir, sobran cierres o faltan cierres), la carta es inválida y debes devolver `-1`.

### Solución

En mi solución cree un contador `currentDepth` que me indica la profundidad actual y un `maxDepth` que me indica la profundidad máxima, luego iteré el string y por cada `[` incrementaré el contador y por cada `]` decrementaré el contador siempre comparando y almacenando el valor máximo en `maxDepth`. Si en algún momento el contador es menor a 0, devolveré `-1` ya que la carta es inválida. Por último, si el contador no es 0, devolveré `-1` ya que la carta es inválida. Si todo está bien, devolveré `maxDepth`.

En la solución de la IA hace unas pequeñas optimizaciones, en lugar de usar `Math.max` para comparar y almacenar el valor máximo en `maxDepth`, usa un `if` que compara y asigna directamente el valor máximo. También usa un `else if` en lugar de un `if` para evitar una comprobación innecesaria si el carácter ya era `[`. Por último, usa un ternario para un retorno más limpio.

```ts
// MI SOLUCIÓN:
function maxDepth(s: string): number {
  let currentDepth = 0
  let maxDepth = 0

  for (let char of s) {
    if (char === '[') {
      currentDepth++
      maxDepth = Math.max(maxDepth, currentDepth)
    }
    if (char === ']') {
      if (currentDepth === 0) return -1
      currentDepth--
    }
  }
  if (currentDepth !== 0) return -1
  return maxDepth
}

// SOLUCIÓN IA:
function maxDepth(s: string): number {
  let currentDepth = 0
  let maxDepth = 0

  for (const char of s) {
    if (char === '[') {
      currentDepth++
      // Micro-optimización: Una comparación simple suele ser
      // marginalmente más rápida que llamar a Math.max repetidamente
      if (currentDepth > maxDepth) maxDepth = currentDepth
    } else if (char === ']') {
      // Usar 'else if' evita una comprobación innecesaria
      // si el carácter ya era '['
      if (currentDepth === 0) return -1
      currentDepth--
    }
  }

  // Ternario para un retorno más limpio
  return currentDepth === 0 ? maxDepth : -1
}

// EJEMPLOS:
maxDepth('[]') // -> 1
maxDepth('[[]]') // -> 2
maxDepth('[][]') // -> 1
maxDepth('[[][]]') // -> 2
maxDepth('[[[]]]') // -> 3
maxDepth('[][[]][]') // -> 2

maxDepth('][') // -> -1 (cierra antes de abrir)
maxDepth('[[[') // -> -1 (faltan cierres)
maxDepth('[]]]') // -> -1 (sobran cierres)
maxDepth('[][][') // -> -1 (queda uno sin cerrar)
```

---

## Reto 11 - FÁCIL

### Enunciado

El grinch quiere robar los regalos de Navidad del almacén. Para ello necesita saber **qué regalos no tienen vigilancia**.

El almacén se representa como un array de strings (`string[]`), donde cada regalo (`*`) está protegido si su posición está junto a una cámara (`#`). Cada espacio vacío se representa con un punto (`.`).

Tu tarea es **contar cuántos regalos están sin vigilancia**, es decir, que no tienen ninguna cámara adyacente (arriba, abajo, izquierda o derecha).

Ten en cuenta: solo se considera como "adyacente" las 4 direcciones cardinales, no en diagonal.

Los regalos en las esquinas o bordes pueden estar sin vigilancia, siempre que no tengan cámaras directamente al lado.

### Solución

En mi solución, creo un contador para almacenar la cantidad de regalos sin cámara adyacente y un array para convertir el almacén en un array de arrays. Luego, recorro el almacén y por cada regalo, verifico si tiene una cámara adyacente. Si no tiene una cámara adyacente, incremento el contador.

En la solución de la IA, realiza optimizaciones como el evitar el `.map(row => row.split(''))` y usando `string[0]` bajando así la complejidad de la solución.

```ts
// MI SOLUCIÓN:
function findUnsafeGifts(warehouse: string[]): number {
  let unsafeGifts = 0
  let warehouseArray = warehouse.map(row => row.split(''))

  warehouseArray.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === '*') {
        const hasCamera =
          warehouseArray[rowIndex]?.[cellIndex - 1] === '#' ||
          warehouseArray[rowIndex]?.[cellIndex + 1] === '#' ||
          warehouseArray[rowIndex - 1]?.[cellIndex] === '#' ||
          warehouseArray[rowIndex + 1]?.[cellIndex] === '#'

        if (!hasCamera) {
          unsafeGifts++
        }
      }
    })
  })
  return unsafeGifts
}

// SOLUCIÓN IA:
function findUnsafeGifts(warehouse: string[]): number {
  let unsafeGifts = 0
  const rows = warehouse.length

  for (let i = 0; i < rows; i++) {
    // Micro-optimización: Guardamos el string de la fila actual
    const row = warehouse[i]
    const cols = row.length

    for (let j = 0; j < cols; j++) {
      // 1. Saltamos rápidamente si no es un regalo
      if (row[j] !== '*') continue

      // 2. Verificamos cámaras directamente sobre el array de strings
      const hasCamera =
        row[j - 1] === '#' || // Izquierda
        row[j + 1] === '#' || // Derecha
        warehouse[i - 1]?.[j] === '#' || // Arriba
        warehouse[i + 1]?.[j] === '#' // Abajo

      if (!hasCamera) {
        unsafeGifts++
      }
    }
  }

  return unsafeGifts
}

// EJEMPLOS:
findUnsafeGifts(['.*.', '*#*', '.*.']) // ➞ 0

// Todos los regalos están junto a una cámara

findUnsafeGifts(['...', '.*.', '...']) // ➞ 1

// Este regalo no tiene cámaras alrededor

findUnsafeGifts(['*.*', '...', '*#*']) // ➞ 2
// Los regalos en las esquinas superiores no tienen cámaras alrededor

findUnsafeGifts(['.....', '.*.*.', '..#..', '.*.*.', '.....']) // ➞ 4

// Los cuatro regalos no tienen cámaras, porque están en diagonal a la cámara
```

---

## Reto 12 - MEDIO

### Enunciado

Dos elfos están jugando una batalla por turnos. Cada uno tiene un mazo de movimientos que se representan como un `string` donde cada carácter es una acción.

- `A` **Ataque normal**: causa 1 punto de daño si no es bloqueado
- `B` **Bloqueo**: bloquea un ataque normal (`A`)
- `F` **Ataque fuerte**: causa 2 puntos de daño, no puede ser bloqueado

Ambos elfos comienzan con **3 puntos de vida**. El primer elfo que llegue a **0 puntos de vida o menos** pierde y la batalla termina inmediatamente (no se siguen procesando más movimientos).

**Reglas por ronda**

- Si ambos usan ataque (`A` o `F`), ambos reciben daño según el tipo.
- `B` bloquea `A`, pero **no bloquea** `F`.
- Todo se resuelve **simultáneamente**.

**Tu tarea**

Devuelve el resultado de la batalla como un número:

- `1` → si el Elfo 1 gana
- `2` → si el Elfo 2 gana
- `0` → si empatan (ambos llegan a 0 a la vez o terminan con la misma vida)

### Solución

En mi solución, cree dos variables representando la vida de cada elfo, luego recorri el string de movimientos, validando el movimiento restaba la vida correspondiente a cada elfo.

En la solución de la IA, crea variables mucho más legibles y fáciles de entender, también las condiciones se vuelven más claras y fáciles de entender.

```ts
// MI SOLUCIÓN:
function elfBattle(elf1: string, elf2: string): number {
  let elf1Life = 3
  let elf2Life = 3

  const maxLenght = Math.max(elf1.length, elf2.length)

  for (let index = 0; index < maxLenght; index++) {
    // check bloqueos nada más, luego restar vida
    if (!(elf1[index] === 'A' && elf2[index] === 'B')) {
      // modificar vida de elf2
      if (elf1[index] === 'A') elf2Life--
      if (elf1[index] === 'F') elf2Life -= 2
    }
    if (!(elf2[index] === 'A' && elf1[index] === 'B')) {
      // modificar vida de elf1
      if (elf2[index] === 'A') elf1Life--
      if (elf2[index] === 'F') elf1Life -= 2
    }

    if (elf1Life <= 0 && elf2Life <= 0) {
      return 0
    } else if (elf1Life <= 0) {
      return 2
    } else if (elf2Life <= 0) {
      return 1
    }
  }

  if (elf1Life === elf2Life) return 0

  return elf1Life < elf2Life ? 2 : 1
}

// SOLUCIÓN IA:
function elfBattle(elf1: string, elf2: string): number {
  let hp1 = 3
  let hp2 = 3

  // Solo iteramos hasta el máximo de movimientos disponibles
  const rounds = Math.max(elf1.length, elf2.length)

  for (let i = 0; i < rounds; i++) {
    const move1 = elf1[i]
    const move2 = elf2[i]

    let damageTo1 = 0
    let damageTo2 = 0

    // Calcular daño para el Elfo 1
    if (move2 === 'F') damageTo1 = 2
    if (move2 === 'A' && move1 !== 'B') damageTo1 = 1

    // Calcular daño para el Elfo 2
    if (move1 === 'F') damageTo2 = 2
    if (move1 === 'A' && move2 !== 'B') damageTo2 = 1

    // Aplicar daño simultáneamente
    hp1 -= damageTo1
    hp2 -= damageTo2

    // Comprobar victoria inmediata
    if (hp1 <= 0 || hp2 <= 0) {
      if (hp1 <= 0 && hp2 <= 0) return 0
      return hp1 <= 0 ? 2 : 1
    }
  }

  // Si terminan los movimientos y nadie llegó a 0
  if (hp1 === hp2) return 0
  return hp1 > hp2 ? 1 : 2
}

// EJEMPLOS:
elfBattle('A', 'B')
// Ronda 1: A vs B -> Elfo 2 bloquea
// Resultado: Elfo 1 = 3 de vida
//            Elfo 2 = 3 de vida
// → 0

elfBattle('F', 'B')
// Ronda 1: F vs B -> Elfo 2 recibe 2 de daño (F no se bloquea)
// Resultado: Elfo 1 = 3 de vida
//            Elfo 2 = 1 de vida
// → 1

elfBattle('AAB', 'BBA')
// R1: A vs B → Elfo 2 bloquea
// R2: A vs B → Elfo 2 bloquea
// R3: B vs A → Elfo 1 bloquea
// Resultado: Elfo 1 = 3, Elfo 2 = 3
// → 0

elfBattle('AFA', 'BBA')
// R1: A vs B → Elfo 2 bloquea
// R2: F vs B → Elfo 2 recibe 2 de daño (F no se bloquea)
// R3: A vs A → ambos -1
// Resultado: Elfo 1 = 2, Elfo 2 = 0
// → 1

elfBattle('AFAB', 'BBAF')
// R1: A vs B → Elfo 2 bloquea
// R2: F vs B → Elfo 2 recibe 2 de daño (F no se bloquea)
// R3: A vs A → ambos -1 → Elfo 2 llega a 0 ¡Batalla termina!
// R4: no se juega, ya que Elfo 2 no tiene vida
// → 1

elfBattle('AA', 'FF')
// R1: A vs F → Elfo 1 -2, Elfo 2 -1
// R2: A vs F → Elfo 1 -2, Elfo 2 -1 → Elfo 1 llega a -1
// → 2
```
