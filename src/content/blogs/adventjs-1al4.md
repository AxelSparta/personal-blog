---
title: Resolución de retos de AdventJS (retos 1 al 4)
img: /adventjs.jpeg
readtime: 15
description: En este post explicaré la resolución de los retos de AdventJS 2025 retos 1 al 4.
author: Axel Sparta
date: 2025-12-08
---

# Resolución de retos de AdventJS (retos 1 al 4)

En este artículo quiero compartir mi resolución de los retos de AdventJS 2025 comparándola con la solución de la IA y aprendiendo sobre como ir mejorando cada reto.

---

## Reto 1 - FÁCIL

### Enunciado
Santa ha recibido una lista de regalos, pero algunos están defectuosos. Un regalo es defectuoso si su nombre contiene el carácter `#`.

Ayuda a Santa escribiendo una función que reciba una lista de nombres de regalos y devuelva una nueva lista que solo contenga los regalos sin defectos.


### Solución

En mi solución, usé el método `filter` para crear una nueva lista con los regalos que no contienen el carácter `#`.

```ts
// MI SOLUCIÓN:
function filterGifts(gifts: string[]) {
	const result = gifts.filter((gift) => !gift.includes('#'))
	return result
}

// SOLUCIÓN IA (sólo fue más concisa con el return implícito):
const filterGifts = (gifts: string[]) => gifts.filter(gift => !gift.includes('#'))

// EJEMPLOS:
const gifts1 = ['car', 'doll#arm', 'ball', '#train']
const good1 = filterGifts(gifts1)
console.log(good1)
// ['car', 'ball']

const gifts2 = ['#broken', '#rusty']
const good2 = filterGifts(gifts2)
console.log(good2)
// []

const gifts3 = []
const good3 = filterGifts(gifts3)
console.log(good3)
// []
```

---

## Reto 2 - FÁCIL

### Enunciado

La fábrica de Santa ha empezado a recibir la lista de producción de juguetes.
Cada línea indica qué juguete hay que fabricar y cuántas unidades.

Los elfos, como siempre, han metido la pata: han apuntado algunos juguetes con cantidades que no tienen sentido.

Tienes una lista de objetos con esta forma:

- `toy`: el nombre del juguete (string)
- `quantity`: cuántas unidades hay que fabricar (number)
Tu tarea es escribir una función que reciba esta lista y devuelva un array de strings con:

- Cada juguete repetido tantas veces como indique quantity
- En el mismo orden en el que aparecen en la lista original
- Ignorando los juguetes con cantidades no válidas (menores o iguales a 0, o que no sean número)


### Solución

En mi solución, usé el método `forEach` para recorrer la lista de juguetes y crear una nueva lista que solo contenga los regalos con la propiedad quantity mayor a 0.

En la solución de la IA utiliza el método `flatMap`, que es similar al método `map`, pero que es ideal para aplanar y transformar arrays, luego valida que quantity sea mayor a 0 y crea un array, con el método `from`, con el juguete repetido tantas veces como indique quantity.


```ts
// MI SOLUCIÓN:
function manufactureGifts(
  giftsToProduce: Array<{ toy: string; quantity: number }>
): string[] {

  const result = []

  giftsToProduce.forEach(({toy, quantity}) => {
    if (quantity > 0) {
      // Se crea un array con el juguete repetido tantas veces como indique quantity
      // y luego se descompone con el operador spread añadiéndolo al array resultante
      result.push(...new Array(quantity).fill(toy))
    }
  })

  return result
}

// SOLUCIÓN IA:
function manufactureGifts(
  giftsToProduce: Array<{ toy: string; quantity: number }>
): string[] {
  return giftsToProduce.flatMap(({ toy, quantity }) =>
    quantity > 0 ? Array.from({ length: quantity }, () => toy) : []
  )
}

// EJEMPLOS:
const production1 = [
  { toy: 'car', quantity: 3 },
  { toy: 'doll', quantity: 1 },
  { toy: 'ball', quantity: 2 }
]

const result1 = manufactureGifts(production1)
console.log(result1)
// ['car', 'car', 'car', 'doll', 'ball', 'ball']

const production2 = [
  { toy: 'train', quantity: 0 }, // no se fabrica
  { toy: 'bear', quantity: -2 }, // tampoco
  { toy: 'puzzle', quantity: 1 }
]

const result2 = manufactureGifts(production2)
console.log(result2)
// ['puzzle']

const production3 = []
const result3 = manufactureGifts(production3)
console.log(result3)
// []
```

---

## Reto 3 - FÁCIL

### Enunciado
En el taller de Santa hay un elfo becario que está aprendiendo a envolver regalos 🎁.

Le han pedido que envuelva cajas usando solo texto… y lo hace más o menos bien.

Le pasan dos parámetros:

- `size`: el tamaño del regalo cuadrado
- `symbol`: el carácter que el elfo usa para hacer el borde (cuando no se equivoca 😅)

El regalo debe cumplir:

- Debe ser un cuadrado de size x size.
- El interior siempre está vacío (lleno de espacios), porque el elfo "aún no sabe dibujar el relleno".
- Si size < 2, devuelve una cadena vacía: el elfo lo intentó, pero se le perdió el regalo.
- El resultado final debe ser un string con saltos de línea `\n`.

Sí, es un reto fácil… pero no queremos que despidan al becario. ¿Verdad?


### Solución

En mi solución, simplemente hice un bucle para ir creando cada línea.

```ts
// MI SOLUCIÓN:
function drawGift(size: number, symbol: string): string {
  let result = ''
  if (size < 2) return result
  for (let i = 1; i <= size; i++) {
    if (i === 1) {
      result += `${symbol.repeat(size)}\n`
    } else if (i === size) {
      result += `${symbol.repeat(size)}`
    } else {
      result += `${symbol}${' '.repeat(size-2)}${symbol}\n`
    }
  }
  return result
}

// SOLUCIÓN IA:
function drawGift(size: number, symbol: string): string {
  if (size < 2) return ''

  const topBottom = symbol.repeat(size) // Primera y última fila
  const middle = symbol + ' '.repeat(size - 2) + symbol // Filas del medio

  // Si size = 2, no hay "middle", son solo dos filas idénticas
  if (size === 2) return `${topBottom}\n${topBottom}`

  return [
    topBottom,
    ...Array(size - 2).fill(middle),
    topBottom
  ].join('\n')
}

// EJEMPLOS:
const g1 = drawGift(4, '*')
console.log(g1)
/*
 ****
 *  *
 *  *
 ****
 */

const g2 = drawGift(3, '#')
console.log(g2)
/*
###
# #
###
*/

const g3 = drawGift(2, '-')
console.log(g3)
/*
--
--
*/

const g4 = drawGift(1, '+')
console.log(g4)
// ""  pobre becario…
```

---

## Reto 4 - FÁCIL

### Enunciado
Los elfos han encontrado el código cifrado que protege la puerta del taller de Santa 🔐. El PIN tiene 4 dígitos, y está escondido dentro de bloques como estos:

- [1++][2-][3+][<]

Escribe una función que descifre el PIN a partir del código.

El código está formado por bloques entre corchetes [...] y cada bloque genera un dígito del PIN.

Un bloque normal tiene la forma [nOP...], donde n es un número (0-9) y después puede haber una lista de operaciones (opcionales).

Las operaciones se aplican en orden al número y son:

- `+` suma 1
- `-` resta 1
El resultado siempre es un dígito (aritmética mod 10), por ejemplo 9 + 1 → 0 y 0 - 1 → 9.

También existe el bloque especial [<], que repite el dígito del bloque anterior.

Si al final hay menos de 4 dígitos, se debe devolver null.


### Solución

En mi solución, simplemente hice un bucle para ir creando cada línea.

```ts
// MI SOLUCIÓN:
function decodeSantaPin (code: string): string | null {
  let prevDigit = 0
  let pin = ''
  // divido el string en bloques, donde cada uno representa un número del pin
  const blocks = code.match(/(?<=\[).*?(?=\])/g)

  if (!blocks) return null

  blocks.forEach(block => {
    let digit = 0

    if (block === '<') digit = prevDigit

    for (let char of block) {
      if (!Number.isNaN(Number(char))) digit = Number(char)
      if (char === '+') digit++
      if (char === '-') digit--
    }

    if (digit >= 10) digit -= 10
    if (digit < 0) digit += 10
    prevDigit = digit
    pin += `${digit}`
  })

  if (pin.length !== 4) return null
  return pin
}


// SOLUCIÓN IA:
function decodeSantaPin(code: string): string | null {
  const blocks = code.match(/\[(.*?)\]/g)
  if (!blocks) return null

  let pin: number[] = []

  for (const block of blocks) {
    const content = block.slice(1, -1)

    // Bloque especial [<]
    if (content === '<') {
      // valida que pin tenga al menos un elemento
      if (pin.length === 0) return null
      // añade el último elemento del pin al final del array
      pin.push(pin[pin.length - 1])
      continue
    }

    // Bloque normal: [n++--], el primer carácter es el número,
    // si no es así devuelve null
    const base = Number(content[0])
    if (Number.isNaN(base)) return null

    let value = base

    for (const op of content.slice(1)) {
      if (op === '+') value++
      else if (op === '-') value--
    }

    // aritmética correcta para convertir los números en un rango de 0 a 9 
    value = ((value % 10) + 10) % 10
    pin.push(value)
  }

  return pin.length >= 4 ? pin.slice(0, 4).join('') : null
}

// EJEMPLOS:
decodeSantaPin('[1++][2-][3+][<]')
// "3144"

decodeSantaPin('[9+][0-][4][<]')
// "0944"

decodeSantaPin('[1+][2-]')
// null (solo 2 dígitos)
```
