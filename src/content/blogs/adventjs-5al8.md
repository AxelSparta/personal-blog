---
title: Resolución de retos de AdventJS (retos 5 al 8)
img: /adventjs.jpeg
readtime: 15
description: En este post explicaré la resolución de los retos de AdventJS 2025 retos 5 al 8.
author: Axel Sparta
date: 2025-12-21
---

# Resolución de retos de AdventJS (retos 5 al 8)

En este artículo quiero compartir mi resolución de los retos de AdventJS 2025 comparándola con la solución de la IA y aprendiendo sobre como ir mejorando cada reto.

---

## Reto 5 - FÁCIL

### Enunciado

Los elfos tienen un **timestamp secreto**: es la fecha y hora exacta en la que Papá Noel despega con el trineo 🛷 para repartir regalos por el mundo. Pero en el Polo Norte usan un formato rarísimo para guardar la hora: `YYYY*MM*DD@HH|mm|ss NP` (ejemplo: `2025*12*25@00|00|00 NP`).

**Tu misión es escribir una función que reciba dos parámetros:**

- `fromTime` → fecha de referencia en formato elfo (`YYYY*MM*DD@HH|mm|ss NP`).
- `takeOffTime` → la misma fecha de despegue, también en formato elfo.
  La función debe devolver:

- Los segundos completos que faltan para el despegue.
- Si ya estamos en el despegue exacto → 0.
- Si el despegue ya ocurrió → un número negativo indicando cuántos segundos han pasado desde entonces.

🎯 **Reglas**

- Convierte el formato elfo a un timestamp primero. El sufijo NP indica la hora oficial del Polo Norte (sin husos horarios ni DST), así que puedes tratarlo como si fuera UTC.
- Usa diferencias en segundos, no en milisegundos.
- Redondea siempre hacia abajo (floor): solo segundos completos.

### Solución

En mi solución, cree una función auxiliar para convertir el formato elfo a formato UTC y a partir de ahí calcular la diferencia en segundos.

En la solución de la IA, utiliza `match` para extraer los datos de la fecha y hora, y también validar si el formato proporcionado es correcto. A partir de ahí, utiliza `Date.UTC` para calcular la diferencia en segundos.

```ts
// MI SOLUCIÓN:
function timeUntilTakeOff(fromTime, takeOffTime) {
  // Función auxiliar para convertir el formato elfo a formato UTC
  // Entrada: '2025*12*25@00|00|00 NP'
  // Salida:  '2025-12-25T00:00:00Z' (La Z fuerza que sea UTC/NP)
  const parseElfTime = time => {
    return time
      .replace(/\*/g, '-') // Reemplaza * por -
      .replace('@', 'T') // Reemplaza @ por T
      .replace(/\|/g, ':') // Reemplaza | por :
      .replace(' NP', 'Z') // Reemplaza ' NP' por Z (UTC)
  }

  // Convertimos las fechas a objetos Date reales
  const fromDate = new Date(parseElfTime(fromTime))
  const takeOffDate = new Date(parseElfTime(takeOffTime))

  // Calculamos la diferencia en milisegundos
  const differenceMs = takeOffDate - fromDate

  // Convertimos a segundos y redondeamos hacia abajo
  return Math.floor(differenceMs / 1000)
}

// SOLUCIÓN IA (sólo fue más concisa con el return implícito):
function timeUntilTakeOff(fromTime: string, takeOffTime: string): number {
  const parseElfTimeToSeconds = (time: string): number => {
    const match = time.match(
      /^(\d{4})\*(\d{2})\*(\d{2})@(\d{2})\|(\d{2})\|(\d{2}) NP$/
    )
    // Validamos que el formato elfo sea correcto
    if (!match) {
      throw new Error('Formato elfo inválido')
    }
    // Desestructuramos el array de números con los datos correspondientes
    const [, year, month, day, hour, min, sec] = match.map(Number)

    // Date.UTC devuelve milisegundos desde epoch en UTC
    return Math.floor(Date.UTC(year, month - 1, day, hour, min, sec) / 1000)
  }

  const fromSeconds = parseElfTimeToSeconds(fromTime)
  const takeOffSeconds = parseElfTimeToSeconds(takeOffTime)

  return takeOffSeconds - fromSeconds
}

// EJEMPLOS:
const takeoff = '2025*12*25@00|00|00 NP'

// desde el 24 diciembre 2025, 23:59:30, 30 segundos antes del despegue
timeUntilTakeOff('2025*12*24@23|59|30 NP', takeoff)
// 30

// justo en el momento exacto
timeUntilTakeOff('2025*12*25@00|00|00 NP', takeoff)
// 0

// 12 segundos después del despegue
timeUntilTakeOff('2025*12*25@00|00|12 NP', takeoff)
// -12
```

---

## Reto 6 - FÁCIL

### Enunciado

En el taller de Santa, los elfos han encontrado **una montaña de guantes mágicos** totalmente desordenados. Cada guante viene descrito por dos valores:

- `hand`: indica si es un guante izquierdo (L) o derecho (R)
- `color`: el color del guante (string)
  Tu tarea es ayudarles a **emparejar guantes**: Un par válido es un guante izquierdo y uno derecho **del mismo color**.

Debes devolver una lista con los colores de todos los pares encontrados. Ten en cuenta que puede haber varios pares del mismo color. El orden se determina por el que se pueda hacer primero el par.

### Solución

En mi solución, utilizo un objeto para almacenar los guantes que están esperando pareja. Luego hago una iteración por cada guante y verifico si existe un guante del color y mano opuesta esperando. Si existe, añado el color al array de pares y resto el guante que estaba esperando. Si no existe, añado el guante a la lista de esperando.

En la solución de la IA, no utilizó un contador para saber si hay guantes esperando, sino que utilizó un Set por mano para saber si existe uno para emparejar inmediatamente. Esta no es una solución correcta ya que si hay dos guantes del mismo color y mano esperando, sólo se emparejará uno de ellos en caso de que exista otro guante del color y mano opuesta esperando.

```ts
type Glove = { hand: 'L' | 'R'; color: string }

// MI SOLUCIÓN:
function matchGloves(gloves: Glove[]): string[] {
  const pairs = []
  // Este objeto guardará los guantes que están esperando pareja
  // Estructura: { "color": { L: cantidad, R: cantidad } }
  const waitingGloves = {}

  for (const { hand, color } of gloves) {
    // matchHand: mano opuesta
    const matchHand = hand === 'L' ? 'R' : 'L'

    // 1. Verificamos si existe un guante del color y mano opuesta esperando
    if (waitingGloves[color] && waitingGloves[color][matchHand] > 0) {
      pairs.push(color)
      waitingGloves[color][matchHand]-- // Restamos el guante que estaba esperando
    } else {
      // 2. En el caso de que no haya pareja, añadimos el guante a waintingGloves
      if (!waitingGloves[color]) {
        // En caso de que no exista el objeto lo creamos
        waitingGloves[color] = { L: 0, R: 0 }
      }
      // Y le añadimos una unidad
      waitingGloves[color][hand]++
    }
  }

  return pairs
}

// SOLUCIÓN IA:
function matchGloves(gloves: Glove[]): string[] {
  const pairs: string[] = []

  const waiting = {
    L: new Set<string>(),
    R: new Set<string>()
  }

  for (const { hand, color } of gloves) {
    const opposite = hand === 'L' ? 'R' : 'L'

    if (waiting[opposite].has(color)) {
      pairs.push(color)
      waiting[opposite].delete(color)
    } else {
      waiting[hand].add(color)
    }
  }

  return pairs
}

// EJEMPLOS:
const gloves = [
  { hand: 'L', color: 'red' },
  { hand: 'R', color: 'red' },
  { hand: 'R', color: 'green' },
  { hand: 'L', color: 'blue' },
  { hand: 'L', color: 'green' }
]

matchGloves(gloves)
// ["red", "green"]

const gloves2 = [
  { hand: 'L', color: 'gold' },
  { hand: 'R', color: 'gold' },
  { hand: 'L', color: 'gold' },
  { hand: 'L', color: 'gold' },
  { hand: 'R', color: 'gold' }
]

matchGloves(gloves2)
// ["gold", "gold"]

const gloves3 = [
  { hand: 'L', color: 'red' },
  { hand: 'R', color: 'green' },
  { hand: 'L', color: 'blue' }
]

matchGloves(gloves3)
// []

const gloves4 = [
  { hand: 'L', color: 'green' },
  { hand: 'L', color: 'red' },
  { hand: 'R', color: 'red' },
  { hand: 'R', color: 'green' }
]

matchGloves(gloves4)
// ['red', 'green']
```

---

## Reto 7 - MEDIO

### Enunciado

¡Es hora de decorar el **árbol de Navidad** 🎄! Escribe una función que reciba:

- `height` → la altura del árbol (número de filas).
- `ornament` → el carácter del adorno (por ejemplo, "o" o "@").
- `frequency` → cada cuántas posiciones de asterisco aparece el adorno.
  El árbol se dibuja con asteriscos `*`, pero cada `frequency` posiciones, el asterisco se reemplaza por el adorno.

El conteo de posiciones empieza en 1, desde la copa hasta la base, de izquierda a derecha. Si `frequency` es 2, los adornos aparecen en las posiciones 2, 4, 6, etc.

El árbol debe estar centrado y tener un tronco `#` de una línea al final. **Cuidado con los espacios en blanco, nunca hay al final de cada línea.**

### Solución

En mi solución, realicé un bucle para ir creando cada línea del árbol, y otro bucle para ir creando cada carácter de la línea, validando si corresponde el adorno o un asterisco.

En la solución de la IA, las líneas del árbol se crean en un array y se unen al final con `join('\n')`, lo que hace que el código sea más limpio y fácil de entender, la solución quedó más expresiva.

```ts
// MI SOLUCIÓN:
function drawTree(height: number, ornament: string, frequency: number): string {
  let ornamentTurn = 1
  let tree = ''

  for (let i = 1; i <= height; i++) {
    // Creo la línea de la fila actual
    let treeLine = `${' '.repeat(height - i)}`
    for (let j = 0; j < i * 2 - 1; j++) {
      // Si el número de adornos es igual a la frecuencia, añado un adorno
      if (ornamentTurn === frequency) {
        ornamentTurn = 1
        treeLine += ornament
      } else {
        ornamentTurn++
        treeLine += '*'
      }
    }
    // Añado la línea al árbol al finalizar la iteración
    tree += `${treeLine}\n`
  }
  // Finalmente añado el tronco
  tree += `${' '.repeat(height - 1)}#`
  return tree
}

// SOLUCIÓN IA:
function drawTree(height: number, ornament: string, frequency: number): string {
  let position = 0
  const lines: string[] = []

  for (let i = 1; i <= height; i++) {
    const spaces = ' '.repeat(height - i)
    const width = i * 2 - 1

    let row = ''

    for (let j = 0; j < width; j++) {
      position++
      row += position % frequency === 0 ? ornament : '*'
    }

    lines.push(spaces + row)
  }

  lines.push(' '.repeat(height - 1) + '#')

  return lines.join('\n')
}

// EJEMPLOS:
drawTree(5, 'o', 2)
//     *
//    o*o
//   *o*o*
//  o*o*o*o
// *o*o*o*o*
//     #

drawTree(3, '@', 3)
//   *
//  *@*
// *@**@
//   #

drawTree(4, '+', 1)
//    +
//   +++
//  +++++
// +++++++
//    #
```

---

## Reto 8 - FÁCIL

### Enunciado

Santa 🎅 quiere saber cuál es la primera letra no repetida en el nombre de un juguete 🎁.

Escribe una función que reciba un `string` y devuelva la primera letra que no se repite, ignorando mayúsculas y minúsculas al contar, pero devolviendo la letra tal como aparece en el string.

Si no hay ninguna, devuelve una cadena vacía ("").

### Solución

En mi solución, recorrí cada caracter del string con un for, y luego validé si no existía en el array, si no existía, lo devolvia.

En la solución de la IA, resuelve un problema de complejidad innecesaria de mi solución (O(n^2)), ya que dentro del for realizaba un bucle adicional (toyArray.some(...)) por cada iteración, lo que hace que la solución sea mucho más lenta. En cambio, la solución de la IA hace dos pasadas O(n), una para contar las letras y otra para encontrar la primera no repetida, lo que hace que la solución sea mucho más rápida.

```ts
// MI SOLUCIÓN:
function findUniqueToy(toy: string): string {
  const toyArray = toy.split('')

  for (let index = 0; index < toyArray.length; index++) {
    if (
      !toyArray.some(
        (letter, i) =>
          letter.toLowerCase() === toyArray[index].toLowerCase() && i !== index
      )
    ) {
      return toyArray[index]
    }
  }
  return ''
}

// SOLUCIÓN IA:
function findUniqueToy(toy: string): string {
  const count: Record<string, number> = {}

  // Primera pasada: contar letras (case-insensitive)
  for (const char of toy) {
    const key = char.toLowerCase()
    count[key] = (count[key] ?? 0) + 1
  }

  // Segunda pasada: encontrar la primera no repetida
  for (const char of toy) {
    if (count[char.toLowerCase()] === 1) {
      return char
    }
  }

  return ''
}

// EJEMPLOS:
findUniqueToy('Gift') // 'G'
// ℹ️ La G es la primera letra que no se repite
// y la devolvemos tal y como aparece

findUniqueToy('sS') // ''
// ℹ️ Las letras se repiten, ya que no diferencia mayúsculas

findUniqueToy('reindeeR') // 'i'
// ℹ️ La r se repite (aunque sea en mayúscula)
// y la e también, así que la primera es la 'i'

// Más casos:
findUniqueToy('AaBbCc') // ''
findUniqueToy('abcDEF') // 'a'
findUniqueToy('aAaAaAF') // 'F'
findUniqueToy('sTreSS') // 'T'
findUniqueToy('z') // 'z'
```
