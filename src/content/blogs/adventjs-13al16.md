---
title: Resolución de retos de AdventJS (retos 13 al 16)
img: /adventjs.jpeg
readtime: 15
description: En este post explicaré la resolución de los retos de AdventJS 2025 retos 13 al 16.
author: Axel Sparta
date: 2025-12-22
---

# Resolución de retos de AdventJS (retos 13 al 16)

En este artículo quiero compartir mi resolución de los retos de AdventJS 2025 comparándola con la solución de la IA y aprendiendo sobre como ir mejorando cada reto.

---

## Reto 13 - MEDIO

### Enunciado

Simula el recorrido de un regalo dentro de una fábrica y devuelve cómo termina. Para ello debes crear una función `runFactory(factory)`.

`factory` es un `string[]` donde cada celda puede ser:

- `>` `<` `^` `v` movimientos
- `.` salida correcta
  Ten en cuenta que **todas las filas tienen la misma longitud** y que **no habrá otros símbolos**.

El regalo **siempre empieza en la posición (0,0)** (arriba a la izquierda). En cada paso lee la celda actual y se mueve según la dirección. Si llega a una celda con un punto (`.`) significa que ha salido correctamente de la fábrica.

**Resultado**

Devuelve uno de estos valores:

- `'completed'` si llega a un .
- `'loop'` si visita una posición dos veces
- `'broken'` si sale fuera del tablero

### Solución

En mi solución, cree un objeto donde se almacenan las coordenadas visitadas y otro para almacenar la posición actual. Luego hice un bucle while donde se van realizando los movimientos hasta que se cumpla alguna de las condiciones de salida.

En la solución de la IA, se utiliza un Set para rastrear posiciones visitadas. Guardar un número único es mucho más rápido que concatenar strings.

```ts
type Factory = string[]
type Result = 'completed' | 'broken' | 'loop'

// MI SOLUCIÓN:
function runFactory(factory: Factory): Result {
  const coordsMap = { row0cell0: true }
  const currentCoords = { row: 0, cell: 0 }

  do {
    const cell = factory[currentCoords.row][currentCoords.cell]
    // realizar movimientos
    if (cell === '>') currentCoords.cell++
    if (cell === '<') currentCoords.cell--
    if (cell === '^') currentCoords.row--
    if (cell === 'v') currentCoords.row++
    if (cell === '.') return 'completed'

    // si no existe la posición retornar broken
    if (!factory[currentCoords.row]?.[currentCoords.cell]) return 'broken'

    // evaluar si ya pasó por ahí y si es así devolver loop
    if (coordsMap[`row${currentCoords.row}cell${currentCoords.cell}`])
      return 'loop'
    coordsMap[`row${currentCoords.row}cell${currentCoords.cell}`] = true
  } while (true)
}

// SOLUCIÓN IA:
function runFactory(factory: string[]): Result {
  const rows = factory.length
  const cols = factory[0].length

  let r = 0
  let c = 0

  // Usamos un Set para rastrear posiciones visitadas.
  // Guardar un número único es mucho más rápido que concatenar strings.
  const visited = new Set<number>()

  while (true) {
    // 1. Verificación de salida del tablero (Broken)
    if (r < 0 || r >= rows || c < 0 || c >= cols) return 'broken'

    const cell = factory[r][c]

    // 2. Verificación de éxito (Completed)
    if (cell === '.') return 'completed'

    // 3. Verificación de bucle (Loop)
    // Usamos una fórmula de hash simple: row * total_columnas + col
    const posId = r * cols + c
    if (visited.has(posId)) return 'loop'
    visited.add(posId)

    // 4. Movimientos
    if (cell === '>') c++
    else if (cell === '<') c--
    else if (cell === '^') r--
    else if (cell === 'v') r++
  }
}

// EJEMPLOS:
runFactory(['>>.']) // 'completed'

runFactory(['>>>']) // 'broken'

runFactory(['>><']) // 'loop'

runFactory(['>>v', '..<']) // 'completed'

runFactory(['>>v', '<<<']) // 'broken'

runFactory(['>v.', '^..']) // 'completed'

runFactory(['v.', '^.']) // 'loop'
```

---

## Reto 14 - FÁCIL

### Enunciado

En el Polo Norte, los elfos han simplificado su sistema de almacenamiento para evitar errores.
Ahora guardan los regalos en un **objeto mágico con profundidad limitada**, donde **cada valor aparece una sola vez**.

Santa necesita una forma rápida de saber **qué camino de claves** debe seguir para encontrar un regalo concreto.

Tu tarea es escribir una función que, dado un objeto y un valor, devuelva el **array de claves** que hay que recorrer para llegar a ese valor.

**Reglas:**

- El objeto tiene **como máximo 3 niveles de profundidad**.
- El valor a buscar **aparece como mucho una vez**.
- El objeto solo contiene otros objetos y valores **primitivos** (strings, numbers, booleans).
- Si el valor no existe, devuelve un **array vacío**.

### Solución

En mi solución, recurrí a la recursión para resolver el problema, primero iterando sobre las propiedades del objeto y luego aplicando la recursión para buscar el valor en cada una de las propiedades.

En la solución de la IA, también se utiliza la recursión, pero con una forma más eficiente de buscar el valor. Evita utilizar Object.entries y utiliza un bucle for in para iterar sobre las propiedades del objeto.

```ts
type Gift = string | number | boolean
type Workshop = Record<string, any>
type Path = string[]

// MI SOLUCIÓN:
function findGiftPath(workshop: Workshop, gift: Gift): Path {
  // Object.entries devuelve un array de arrays con la clave y valor de cada prop
  for (const [key, value] of Object.entries(workshop)) {
    if (value === gift) return [key]

    if (typeof value === 'object') {
      // Recursión: la función se llama así misma
      const subPath = findGiftPath(value, gift)
      if (subPath.length > 0) return [key, ...subPath]
    }
  }
  return []
}

// SOLUCIÓN IA:
function findGiftPath(workshop: Workshop, gift: Gift): Path {
  for (const key in workshop) {
    const value = workshop[key]

    // 1. Verificación inmediata (Caso base)
    if (value === gift) return [key]

    // 2. Verificación de objeto (Recursión)
    // Comprobamos que sea objeto y no sea null (null es tipo 'object' en JS)
    if (typeof value === 'object' && value !== null) {
      const subPath = findGiftPath(value, gift)

      // 3. Propagación eficiente del camino
      if (subPath.length > 0) {
        return [key, ...subPath]
      }
    }
  }

  return []
}

// EJEMPLOS:
const workshop = {
  storage: {
    shelf: {
      box1: 'train',
      box2: 'switch'
    },
    box: 'car'
  },
  gift: 'doll'
}

findGiftPath(workshop, 'train')
// ➜ ['storage', 'shelf', 'box1']

findGiftPath(workshop, 'switch')
// ➜ ['storage', 'shelf', 'box2']

findGiftPath(workshop, 'car')
// ➜ ['storage', 'box']

findGiftPath(workshop, 'doll')
// ➜ ['gift']

findGiftPath(workshop, 'plane')
// ➜ []
```

---

## Reto 15 - MEDIO

### Enunciado

**Al Polo Norte ha llegado ChatGPT** y el elfo Sam Elfman está trabajando en una aplicación de administración de regalos y niños.

Para mejorar la presentación, quiere crear una función `drawTable` que reciba un **array de objetos** y lo convierta en una **tabla de texto**.

La tabla dibujada debe tener:

- Cabecera con letras de columna (`A`, `B`, `C`…).
- El contenido de la tabla son los valores de los objetos.
- Los valores deben estar alineados a la izquierda.
- Los campos dejan siempre un espacio a la izquierda.
- Los campos dejan a la derecha el espacio necesario para alinear la caja.
  La función recibe un segundo parámetro `sortBy` que indica el nombre del campo por el que se deben ordenar las filas. El orden será alfabético ascendente si los valores son strings y numérico ascendente si son números.

### Solución

En mi solución, primero ordené los datos por el campo `sortBy`, luego en variables guardé las propiedades de los objetos y también en un array coloqué el ancho de cada columna, calculado a partir de los valores de las propiedades. Luego creé la tabla con los valores de las propiedades y los ancho de cada columna.

La solución de la IA es similar, arreglando algunos detalles como el ordenamiento de los datos y el cálculo del ancho de cada columna, además de que utiliza un helper para crear las líneas horizontales y también es más estructurada a la hora de crear la tabla.

```ts
type Data = Array<Record<string, string | number>>
type SortBy = string

// MI SOLUCIÓN:
function drawTable(data: Data, sortBy: SortBy): string {
  let table = ''
  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortBy] ?? ''
    const bVal = b[sortBy] ?? ''
    if (aVal < bVal) return -1
    if (aVal > bVal) return 1
    return 0
  })

  const properties = Object.keys(data[0] || {})

  const columnWidths: number[] = properties.map(prop =>
    Math.max(...sortedData.map(obj => String(obj[prop] ?? '').length))
  )

  // separator
  let separator = ''
  properties.forEach((prop, index) => {
    separator += `+${'-'.repeat((columnWidths[index] ?? 0) + 2)}`
    if (index === properties.length - 1) separator += '+'
  })

  table += separator + '\n'

  // header
  properties.forEach((prop, index) => {
    const codigoASCII = 65 // código ASCII de A
    const caracter = String.fromCharCode(codigoASCII + index)
    table += `| ${caracter}${' '.repeat(
      (columnWidths[index] ?? 0) - caracter.length
    )} `
    if (index === properties.length - 1) table += '|\n'
  })

  table += separator + '\n'

  // rows
  sortedData.forEach((rowObj, rowIndex) => {
    properties.forEach((prop, propIndex) => {
      const value = String(rowObj[prop] ?? '')
      table += `| ${value}${' '.repeat(
        (columnWidths[propIndex] ?? 0) - value.length
      )} `
      if (propIndex === properties.length - 1) table += '|\n'
    })
  })

  table += separator

  return table
}

// SOLUCIÓN IA:
function drawTable(data: Data, sortBy: SortBy): string {
  if (data.length === 0) return ''

  const keys = Object.keys(data[0])

  // 1. Ordenar datos
  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    return typeof aVal === 'number' && typeof bVal === 'number'
      ? aVal - bVal
      : String(aVal).localeCompare(String(bVal))
  })

  // 2. Calcular anchos de columna (incluyendo el espacio para las letras A, B, C...)
  const colWidths = keys.map((key, i) => {
    const headerChar = String.fromCharCode(65 + i)
    const maxContent = Math.max(
      headerChar.length,
      ...sortedData.map(row => String(row[key] ?? '').length)
    )
    return maxContent
  })

  // 3. Helper para crear líneas horizontales (+----+-------+)
  const separator = `+${colWidths.map(w => '-'.repeat(w + 2)).join('+')}+`

  // 4. Construir cabecera (| A  | B  |)
  const header = `| ${keys
    .map((_, i) => {
      const char = String.fromCharCode(65 + i)
      return char.padEnd(colWidths[i])
    })
    .join(' | ')} |`

  // 5. Construir filas de datos
  const rows = sortedData.map(row => {
    return `| ${keys
      .map((key, i) => {
        return String(row[key] ?? '').padEnd(colWidths[i])
      })
      .join(' | ')} |`
  })

  // 6. Unir todo
  return [separator, header, separator, ...rows, separator].join('\n')
}

// EJEMPLOS:
drawTable(
  [
    { name: 'Charlie', city: 'New York' },
    { name: 'Alice', city: 'London' },
    { name: 'Bob', city: 'Paris' }
  ],
  'name'
)
// +---------+----------+
// | A       | B        |
// +---------+----------+
// | Alice   | London   |
// | Bob     | Paris    |
// | Charlie | New York |
// +---------+----------+

drawTable(
  [
    { gift: 'Book', quantity: 5 },
    { gift: 'Music CD', quantity: 1 },
    { gift: 'Doll', quantity: 10 }
  ],
  'quantity'
)
// +----------+----+
// | A        | B  |
// +----------+----+
// | Music CD | 1  |
// | Book     | 5  |
// | Doll     | 10 |
// +----------+----+
```

---

## Reto 16 - FÁCIL

### Enunciado

Santa quiere repartir regalos de la forma **más eficiente posible** 🎁. Tiene una lista de regalos, cada uno con un **peso**, y un trineo que solo puede cargar hasta un **peso máximo**.

Los regalos se entregan **en orden**, y Santa no puede cambiar ese orden. Cuando un regalo no cabe en el trineo actual, Santa envía el trineo y prepara uno nuevo.

Tu tarea es escribir una función que calcule el **número mínimo de trineos** necesarios para entregar todos los regalos.

Eso sí, ten en cuenta que a veces hay un regalo que no cabe en el trineo, entonces hay que devolver `null` porque ese trineo no sirve para ese pack de regalos.

### Solución

En mi solución utilicé dos variables un contador y una variable para almacenar el peso actual del trineo a medida que iba agregando regalos, si el peso actual del trineo era mayor al peso máximo, entonces incrementaba el contador y reiniciaba el peso actual del trineo, si al final del recorrido el peso actual del trineo era mayor a 0, entonces incrementaba el contador (ya que el último trineo no se había enviado).

En la solución de la IA también realiza una solución similar pero mucho más legible y entendible que la mía.

```ts
type Gifts = number[]
type MaxWeight = number
type Result = number | null

// MI SOLUCIÓN:
function packGifts(gifts: Gifts, maxWeight: MaxWeight): Result {
  if (gifts.length === 0) return 0
  let sleighs = 0
  let currentWeight = 0

  for (let i = 0; i < gifts.length; i++) {
    const currentGift = gifts[i]
    if (currentGift > maxWeight) return null
    const fits = currentWeight + currentGift <= maxWeight
    if (!fits) {
      sleighs++
      currentWeight = currentGift
    } else {
      currentWeight += currentGift
    }
  }
  const sledInUse = currentWeight > 0
  // verifico si quedaron regalos en el trineo
  if (sledInUse) sleighs++
  return sleighs
}

// SOLUCIÓN IA:
function packGifts(gifts: Gifts, maxWeight: MaxWeight): Result {
  if (gifts.length === 0) return 0

  let sleighs = 1
  let currentSleighWeight = 0

  for (let i = 0; i < gifts.length; i++) {
    const currentGift = gifts[i]
    if (currentGift > maxWeight) return null
    const fits = currentSleighWeight + currentGift <= maxWeight
    if (!fits) {
      sleighs++
      currentSleighWeight = currentGift
    } else {
      currentSleighWeight += currentGift
    }
  }
  return sleighs
}

// EJEMPLOS:
packGifts([2, 3, 4, 1], 5)
// 2 trineos
// Trineo 1: 2 + 3 = 5
// Trineo 2: 4 + 1 = 5

packGifts([3, 3, 2, 1], 3)
// 3 trineos
// Trineo 1: 3
// Trineo 2: 3
// Trineo 3: 2 + 1 = 3

packGifts([1, 1, 1, 1], 2)
// 2 trineos
// Trineo 1: 1 + 1 = 2
// Trineo 2: 1 + 1 = 2

packGifts([5, 6, 1], 5)
// null
// Hay un regalo de peso 6 que no cabe

packGifts([], 10)
// 0 trineos
// No hay regalos que entregar
```
