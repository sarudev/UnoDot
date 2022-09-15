class Card {
  #color
  #special
  #value
  constructor ({ color, value, special } = { color: null, value: null, special: null }) {
    if (!color && !value && !special)
      throw new Error('`color`, `value` and `special` CANNOT BE null AL THE SAME TIME -> Card.constructor()')
    if (!['+4', 'cambio'].includes(special))
      this.#color = color
    if (special)
      this.#special = special
    else
      this.#value = Number(value)
  }

  get color () {
    return this.#color
  }

  get special () {
    return this.#special
  }

  get value () {
    return this.#value
  }

  set color (color) {
    this.#color = color
  }

  set special (special) {
    this.#special = special
  }

  set value (value) {
    this.#value = value
  }

  get log () {
    if (['+4', 'cambio'].includes(this.special))
      return { special: this.special }
    else if (this.special)
      return { color: this.color, special: this.special }
    else
      return { color: this.color, value: this.value }
  }

  equals (carta) {
    if (['+4', 'cambio'].includes(carta.special))
      return this.special === carta.special
    else if (carta.special)
      return this.color === carta.color && this.special === carta.special
    else
      return this.color === carta.color && this.value === carta.value
  }

  isValid () {
    if (['azul', 'rojo', 'verde', 'amarillo'].includes(this.color)) {
      if (this.value >= 1 && this.value <= 9 && typeof this.value === 'number')
        return !this.special
      return ['bloqueo', 'reversa', '+2'].includes(this.special) && this.color && !this.value
    } else
      return ['+4', 'cambio'].includes(this.special) && !this.color && !this.value
  }
}

module.exports = Card
