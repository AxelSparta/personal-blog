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

En la solución, usamos el método `forEach` para recorrer la lista de juguetes y crear una nueva lista que solo contenga los regalos con la propiedad quantity mayor a 0.

```ts
function manufactureGifts(
  giftsToProduce: Array<{ toy: string; quantity: number }>
): string[] {

  const result = []

  giftsToProduce.forEach(({toy, quantity}) => {
    if (quantity > 0) {
      // Se crea un array con el juguete repetido tantas veces como indique quantity y luego se descompone con el operador spread añadiéndolo al array resultante
      result.push(...new Array(quantity).fill(toy))
    }
  })

  return result
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
