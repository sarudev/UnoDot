const Card = require('./Card')

class Deck {
  #cards
  constructor () {
    this.#cards = []
  }

  get length () {
    return this.#cards.length
  }

  get cards () {
    return this.#cards
  }

  get log () {
    return {
      cards: this.#cards.map(c => c.log),
      length: this.length
    }
  }

  draw ({ card, count } = { card: null, count: 1 }) {
    if (!count)
      count = 1
    if (count > this.#cards.length)
      throw new Error('You don\'t have enough cards to draw')
    const cards = []
    for (let i = 0; i < count; i++) {
      if (card)
        cards.push(this.#get(card))
      else
        cards.push(this.#cards.shift())
    }
    if (count === 1)
      return cards[0]
    return cards
  }

  push (card) {
    if (!card)
      throw new Error('`card` CANNOT BE null -> Deck.push()')
    if (!Array.isArray(card))
      card = [card]
    this.#cards.push(...card)
  }

  shuffle () {
    this.cards.sort(() => Math.random() - 0.5)
  }

  sort (deckToSort = null) {
    let modified = false

    if (!deckToSort) {
      deckToSort = this.#cards
      modified = true
    }

    const cardsSorted = require('lodash').cloneDeep(OriginalCardsSorter)

    deckToSort.forEach(c => {
      if (['+4', 'cambio'].includes(c.special))
        cardsSorted.sinColor[c.special].push(c)
      else if (c.special)
        cardsSorted[c.special][c.color].push(c)
      else
        cardsSorted[c.color][c.value].push(c)
    })

    const cardsSortedValues = Object.values(cardsSorted)
    const cards = []

    for (let i = 0; i < cardsSortedValues.length; i++) {
      const value = Object.values(cardsSortedValues[i])
      for (let j = 0; j < value.length; j++) {
        if (value[j].length > 0)
          cards.push(...value[j])
      }
    }

    if (!modified)
      return cards
    this.#cards = cards
  }

  createDeck () {
    const deck = []

    for (let i = 0; i < 4; i++) {
      for (const special of ['cambio', '+4'])
        deck.push(new Card({ special }))

      if (i > 1)
        continue

      for (const color of ['rojo', 'verde', 'azul', 'amarillo']) {
        for (let value = 1; value <= 9; value++)
          deck.push(new Card({ color, value }))

        for (const special of ['bloqueo', 'reversa', '+2'])
          deck.push(new Card({ color, special }))
      }
    }

    this.#cards = deck
    this.shuffle()
  }

  map (callback) {
    return this.#cards.map(callback)
  }

  unshift (card) {
    return this.#cards.unshift(card)
  }

  at (idx) {
    return this.#cards[idx]
  }

  #get (card) {
    const index = this.#cards.findIndex(c => c.equals(card))
    if (index === -1)
      throw new Error('That card does not exist in the deck.')
    return this.#cards[index]
  }
}

module.exports = Deck

const OriginalCardsSorter = {
  azul: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: []
  },
  rojo: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: []
  },
  verde: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: []
  },
  amarillo: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: []
  },
  reversa: {
    azul: [],
    rojo: [],
    verde: [],
    amarillo: []
  },
  bloqueo: {
    azul: [],
    rojo: [],
    verde: [],
    amarillo: []
  },
  '+2': {
    azul: [],
    rojo: [],
    verde: [],
    amarillo: []
  },
  sinColor: {
    '+4': [],
    cambio: []
  }
}
