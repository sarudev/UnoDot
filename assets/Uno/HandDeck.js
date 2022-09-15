class HandDeck {
  #cards
  constructor (deck) {
    if (!deck)
      throw new Error('`deck` CANNOT BE null -> HandDeck.constructor()')
    this.#cards = this.#createHandDeck(deck)
    this.sort(deck)
  }

  get cards () {
    return this.#cards
  }

  get length () {
    return this.cards.length
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
      throw new Error('You don\'t have enough cards to draw.')

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
      throw new Error('`card` CANNOT BE null -> HandDeck.push()')
    if (!Array.isArray(card))
      card = [card]
    this.#cards.push(...card)
  }

  sort (deck) {
    this.#cards = deck.sort(this.#cards)
  }

  forEach (callback) {
    this.#cards.forEach(callback)
  }

  map (callback) {
    return this.#cards.map(callback)
  }

  at (i) {
    return this.#cards[i]
  }

  #get (card) {
    const index = this.#cards.findIndex(c => c.equals(card))
    if (index === -1)
      throw new Error('You don\'t have that card.')
    card = this.#cards[index]
    this.#cards[index] = null
    this.#cards = this.#cards.filter(c => c)
    return card
  }

  #createHandDeck (deck) {
    return deck.draw({ count: 7 })
  }
}

module.exports = HandDeck
