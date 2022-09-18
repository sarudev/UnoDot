class LCDE {
  constructor () {
    this.start = null
    this.end = null
    this.length = 0
    return this
  }

  at (index) {
    let nodo = this.start
    if (index > 0) {
      for (let i = 0; i < index; i++)
        nodo = nodo.next
    } else {
      for (let i = 0; i > index; i--)
        nodo = nodo.prev
    }
    return nodo.value
  }

  push (value) {
    if (!this.start) {
      const nodo = new Nodo({ value })
      this.start = nodo
      this.end = this.start
      this.start.next = this.end
      this.start.prev = this.end
    } else {
      const nodo = new Nodo({ prev: this.end, value, next: this.start })
      this.end.next = nodo
      this.start.prev = nodo
      this.end = nodo
    }
    this.length++
  }

  remove (index) {
    let nodo = this.start
    for (let i = 0; i < index; i++)
      nodo = nodo.next

    const prev = nodo.prev
    const next = nodo.next
    prev.next = next
    next.prev = prev
    if (nodo === this.start)
      this.start = next
    if (nodo === this.end)
      this.end = prev
    this.length--
  }

  map (callback) {
    let actual = this.start
    const arr = []
    for (let i = 0; i < this.length; i++) {
      arr.push(callback(actual.value))
      actual = actual.next
    }
    return arr
  }

  find (callback) {
    let actual = this.start
    for (let i = 0; i < this.length; i++) {
      if (callback(actual.value))
        return actual.value
      actual = actual.next
    }
    return null
  }

  findIndex (callback) {
    let actual = this.start
    for (let i = 0; i < this.length; i++) {
      if (callback(actual.value))
        return i
      actual = actual.next
    }
    return -1
  }

  forEach (callback) {
    let actual = this.start
    for (let i = 0; i < this.length; i++) {
      callback(actual.value, i)
      actual = actual.next
    }
  }

  includes (callback) {
    let actual = this.start
    for (let i = 0; i < this.length; i++) {
      if (callback(actual.value))
        return true
      actual = actual.next
    }
    return false
  }
}

class Nodo {
  constructor ({ prev, value, next } = { prev: null, value: null, next: null }) {
    this.prev = prev
    this.value = value
    this.next = next
  }
}

module.exports = LCDE
