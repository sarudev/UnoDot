const HandDeck = require('./HandDeck')

class Player {
  #handDeck
  #id
  #draw
  #uno
  #blocked
  constructor ({ id } = { id: null }) {
    if (!id)
      throw new Error('`id` CANNOT BE null -> Player.constructor()')
    this.#handDeck = null
    this.#id = id
    this.#draw = false
    this.#uno = false
    this.#blocked = false
  }

  get handDeck () {
    return this.#handDeck
  }

  get id () {
    return this.#id
  }

  get draw () {
    return this.#draw
  }

  get uno () {
    return this.#uno
  }

  get blocked () {
    return this.#blocked
  }

  set handDeck (deck) {
    this.#handDeck = new HandDeck(deck)
    this.#handDeck.sort(deck)
  }

  set id (id) {
    this.#id = id
  }

  set draw (bool) {
    this.#draw = bool
  }

  set uno (bool) {
    this.#uno = bool
  }

  set blocked (bool) {
    this.#blocked = bool
  }

  get log () {
    return {
      handDeck: this.#handDeck?.cards?.map(c => c.log) || [],
      id: this.#id,
      draw: this.#draw,
      uno: this.#uno
    }
  }

  equals (player) {
    return this.#id === player.id
  }
}

module.exports = Player
