const Card = require('./Card')
const Deck = require('./Deck')
const Player = require('./Player')
const LCDE = require('./LCDE')
const tableEventEmitter = require('./emitter')

class Table {
  #startTimestamp
  #endTimestamp
  #deck
  #players
  #creator
  #turn
  #rightTurn
  #room
  #discard
  #started
  #currentColor
  #ended
  constructor ({ creatorId, roomId, editableObject }) {
    if (!creatorId || !roomId)
      throw new Error('`creatorId` and `roomId` CANNOT BE null -> Table.constructor()')

    this.#startTimestamp = null
    this.#endTimestamp = null
    this.#deck = new Deck()
    this.#deck.createDeck()
    this.#creator = new Player({ id: creatorId })
    this.#players = new LCDE()
    this.#players.push(this.#creator)
    this.#turn = {
      index: 0,
      user: null
    }
    this.#rightTurn = true
    this.#room = roomId
    this.#discard = new Deck()
    this.#started = false
    this.#currentColor = null
    this.#ended = false
    this.editableObject = editableObject
    tableEventEmitter.emit('create', this)
  }

  get startTimestamp () {
    return this.#startTimestamp
  }

  get endTimestamp () {
    return this.#endTimestamp
  }

  get deck () {
    return this.#deck
  }

  get players () {
    return this.#players
  }

  get turn () {
    return this.#turn
  }

  get rightTurn () {
    return this.#rightTurn
  }

  get room () {
    return this.#room
  }

  get discard () {
    if (!this.#started)
      throw new Error('The game has not started.')
    return this.#discard.at(0).log
  }

  get started () {
    return this.#started
  }

  get currentColor () {
    return this.#currentColor
  }

  get ended () {
    return this.#ended
  }

  get prevPlayer () {
    return this.#rightTurn ? this.#players.at(this.#turn.index - 1) : this.#players.at(this.#turn.index + 1)
  }

  get currentPlayer () {
    return this.#players.at(this.#turn.index)
  }

  get nextPlayer () {
    return this.#rightTurn ? this.#players.at(this.#turn.index + 1) : this.#players.at(this.#turn.index - 1)
  }

  get currentPlayerDeck () {
    if (!this.#started)
      throw new Error('The game has not started.')

    return this.#turn.user.handDeck.map(c => c.log)
  }

  get creator () {
    return this.#creator
  }

  get log () {
    return {
      deck: this.#deck.log,
      players: this.#players.map(player => player.log),
      creator: this.#creator.log,
      turn: {
        index: this.#turn.index,
        user: this.#turn.user.log
      },
      rightTurn: this.#rightTurn,
      room: this.#room,
      discard: this.#discard?.map(c => c.log),
      started: this.#started,
      currentColor: this.#currentColor,
      ended: this.#ended,
      editableObject: this.editableObject
    }
  }

  // emit join event
  async addPlayer ({ playerId } = { playerId: null }) {
    if (!playerId)
      throw new Error('`id` CANNOT BE null -> Table.addPlayer()')

    if (this.#ended)
      throw new Error('The game has ended.')

    if (this.#players.includes(p => p.id === playerId))
      throw new Error('The player is already in the table.')

    if (this.#started)
      throw new Error('The game has already started.')

    if (this.#players.length === 10)
      throw new Error('The table is full.')

    this.#players.push(new Player({ id: playerId }))
    await tableEventEmitter.emit('join', this, playerId)
  }

  // emit leave event
  async leave ({ playerId } = { playerId: null }) {
    if (!playerId)
      throw new Error('`playerId` CANNOT BE null -> Table.leave()')

    if (this.#ended)
      throw new Error('The game has ended.')

    const player = this.#players.find(p => p.id === playerId)

    if (!player)
      throw new Error('The player is not in the table.')

    // await tableEventEmitter.emit('leave', this, playerId)

    if (player.equals(this.#players.at(0))) {
      this.#creator = this.#players.at(1)
      if ((this.players.length > 1 && !this.#started) || (this.#players.length > 2))
        await tableEventEmitter.emit('creatorChanged', this, this.#players.at(1).id, this.#players.at(0).id)
    }

    if (!this.#started) {
      const playerIndex = this.#players.findIndex(p => p.id === playerId)

      if (this.players.length === 1)
        this.cancelGame()

      this.#players.remove(playerIndex)
      return
    }

    this.#deck.push(player.handDeck.draw({ count: player.handDeck.length }))

    this.#removePlayer({ playerId })
  }

  // emit turn event
  async nextTurn ({ playerId, type } = { playerId: null, type: null }) {
    if (!playerId)
      throw new Error('`playerId` CANNOT BE null -> Table.nextTurn()')

    if (this.#ended)
      throw new Error('The game has ended.')

    if (!this.#started)
      throw new Error('The game has not started.')

    if (this.#deck.length === 0)
      this.#discardToDeck()

    if (this.#players.length === 1)
      this.endGame(type || 'leave')

    if (!this.#players.includes(p => p.id === playerId))
      throw new Error('The player is not in the table.')

    if (this.currentPlayer.id !== playerId)
      throw new Error('It is not the turn of the player.')

    if (this.currentPlayer.handDeck.length === 0 && this.currentPlayer.uno)
      return this.#removePlayer({ playerId: this.currentPlayer.id, type: 'play' })

    if (this.currentPlayer.handDeck.length === 0 && !this.currentPlayer.uno && this.#deck.length > 1)
      this.currentPlayer.handDeck.push(this.#deck.draw({ count: 2 }))
    else if (this.currentPlayer.handDeck.length === 0 && !this.currentPlayer.uno) {
      this.currentPlayer.handDeck.push(this.#deck.draw())
      this.#discardToDeck()
      this.currentPlayer.handDeck.push(this.#deck.draw())
    }

    if (!this.currentPlayer.draw)
      this.currentPlayer.handDeck.push(this.#deck.draw({ count: 1 }))

    if (this.currentPlayer.draw)
      this.currentPlayer.draw = false

    if (this.currentPlayer.handDeck.length > 1 && this.currentPlayer.uno)
      this.currentPlayer.uno = false

    this.#rightTurn ? this.#turn.index++ : this.#turn.index--
    this.#turn.user = this.currentPlayer
    if (this.currentPlayer.blocked) {
      this.currentPlayer.blocked = false
      return this.nextTurn({ playerId: this.currentPlayer.id })
    }

    if (!this.#ended)
      await tableEventEmitter.emit('turn', this, this.#turn.user.id)
  }

  // emit start event
  async start ({ playerId } = { playerId: null }) {
    if (this.#ended)
      throw new Error('The game has ended.')

    if (playerId && playerId !== this.creator.id)
      throw new Error('The player is not the creator.')

    if (this.#started)
      throw new Error('The game has already started.')

    if (this.#players.length < 2)
      throw new Error('Not enough players.')

    this.#started = true
    this.#startTimestamp = Date.now()
    this.#turn.index = Math.floor(Math.random() * this.#players.length)
    this.#turn.user = this.#players.at(this.#turn.index)

    this.#discardFirstCard()

    this.#players.forEach(player => {
      player.handDeck = this.#deck
    })

    await tableEventEmitter.emit('start', this, this.#turn.user.id, this.discard, this.currentColor)
  }

  // emit draw event
  async draw ({ card, playerId } = { card: null, playerId: null }) {
    if (!playerId)
      throw new Error('`playerId` CANNOT BE null -> Table.draw()')

    if (this.#ended)
      throw new Error('The game has ended.')

    if (!this.#started)
      throw new Error('The game has not started.')

    if (card)
      card = this.#convert(card)

    if (!this.#players.includes(p => p.id === playerId))
      throw new Error('The player is not in the table.')

    if (this.currentPlayer.id !== playerId)
      throw new Error('It is not the turn of the player.')

    if (this.currentPlayer.draw)
      throw new Error('The player has already drawn.')

    const drawCard = this.#deck.draw({ count: 1, card })
    this.currentPlayer.handDeck.push(drawCard)
    this.currentPlayer.draw = true

    if (this.#canPlay())
      return await tableEventEmitter.emit('draw', this, true, this.currentPlayer.id, drawCard)
    else
      await tableEventEmitter.emit('draw', this, false, this.currentPlayer.id, drawCard)

    this.nextTurn({ playerId: this.currentPlayer.id, drawCard })
  }

  // emit play event
  async play ({ playerId, card } = { playerId: null, card: null }) {
    if (!card || !playerId)
      throw new Error('`card` and `playerId` CANNOT BE null -> Table.play()')

    if (this.#ended)
      throw new Error('The game has ended.')

    if (!this.#started)
      throw new Error('The game has not started.')

    if (!this.#players.includes(p => p.id === playerId))
      throw new Error('The player is not in the table.')

    if (this.currentPlayer.id !== playerId)
      throw new Error('It is not the turn of the player.')

    const color = card[1]
    card = this.#convert(card)

    if (!this.#canPlay(card))
      throw new Error('Can\'t play this card.')

    card = this.currentPlayer.handDeck.draw({ card })

    this.#applyEffect(card)

    this.#discard.unshift(card)
    this.#currentColor = color

    this.currentPlayer.draw = true

    await tableEventEmitter.emit('play', this, this.#turn.user.id, card.log, color, ['+4', '+2', 'bloqueo', 'reversa'].includes(card.special) ? this.nextPlayer.id : null)

    this.nextTurn({ playerId: this.currentPlayer.id })
  }

  // emit uno event
  async uno ({ playerId } = { playerId: null }) {
    if (!playerId)
      throw new Error('`playerId` CANNOT BE null -> Table.handDeck()')

    if (this.#ended)
      throw new Error('The game has ended.')

    if (!this.#started)
      throw new Error('The game has not started.')

    if (this.currentPlayer.id !== playerId)
      throw new Error('It is not the turn of the player.')

    if (this.currentPlayer.handDeck.length !== 2)
      throw new Error('Player can\'t play uno.')

    this.currentPlayer.uno = true

    await tableEventEmitter.emit('uno', this, this.currentPlayer.id)
  }

  handDeck ({ playerId } = { playerId: null }) {
    if (!playerId)
      throw new Error('`playerId` CANNOT BE null -> Table.handDeck()')

    if (this.#ended)
      throw new Error('The game has ended.')

    if (!this.#players.includes(p => p.id === playerId))
      throw new Error('The player is not in the table.')

    if (!this.#started)
      throw new Error('The game has not started.')

    const handDeck = this.#players.find(p => p.id === playerId).handDeck
    handDeck.sort(this.#deck)
    return handDeck.map(c => c.log)
  }

  async #removePlayer ({ playerId, type } = { playerId: null, type: null }) {
    if (!playerId)
      throw new Error('`playerId` CANNOT BE null -> Table.removePlayer()')

    const playerIndex = this.#players.findIndex(p => p.id === playerId)

    if (playerIndex === -1)
      throw new Error('The player is not in the table.')

    if (this.#rightTurn && playerIndex <= this.#players.findIndex(p => this.#players.at(this.#turn.index).id === p.id))
      this.#turn.index--

    await tableEventEmitter.emit('leave', this, this.#players.at(playerIndex).id, type === 'play')

    this.#players.remove(playerIndex)

    if (this.#turn.user.id === playerId) {
      this.currentPlayer.draw = true
      this.nextTurn({ playerId: this.currentPlayer.id, type })
    } else if (this.#players.length === 1)
      this.endGame('leave')
  }

  #convert (cardToConvert) {
    if (!Array.isArray(cardToConvert))
      throw new Error('`cardToConvert` MUST BE AN array -> Table.#convert()')

    let card
    if (['+4', 'cambio'].includes(cardToConvert[0]))
      card = new Card({ special: cardToConvert[0] })
    else if (['+2', 'bloqueo', 'reversa'].includes(cardToConvert[0]))
      card = new Card({ color: cardToConvert[1], special: cardToConvert[0] })
    else
      card = new Card({ color: cardToConvert[1], value: cardToConvert[0] })

    if (!card.isValid())
      throw new Error('INVALID CARD -> Table.#convert()')

    return card
  }

  #canPlay (card = null) {
    const canPlay = canPlayF.bind(this)
    if (card)
      return canPlay(card)
    else {
      for (let i = 0; i < this.currentPlayer.handDeck.length; i++) {
        if (canPlay(this.currentPlayer.handDeck.at(i)))
          return true
      }
    }

    return false

    function canPlayF (card) {
      if (['+4', 'cambio'].includes(card.special))
        return true
      else if (card.special)
        return this.discard.special === card.special || this.#currentColor === card.color
      else
        return this.discard.value === card.value || this.#currentColor === card.color
    }
  }

  #applyEffect (card) {
    if (!card)
      throw new Error('`card` CANNOT BE null -> Table.#applyEffect()')
    if (['+4', '+2', 'bloqueo'].includes(card.special)) {
      this.nextPlayer.blocked = true
      this.nextPlayer.draw = true
    }
    if (['+4', '+2'].includes(card.special)) {
      if (this.#deck.length > 3 && card.special === '+4')
        this.nextPlayer.handDeck.push(this.#deck.draw({ count: 4 }))
      else if (this.#deck.length < 4 && card.special === '+4') {
        let count = 0
        while (this.#deck.length !== 0) {
          this.nextPlayer.handDeck.push(this.#deck.draw())
          count++
        }
        this.#discardToDeck()
        this.nextPlayer.handDeck.push(this.#deck.draw({ count: 4 - count }))
      } else if (this.#deck.length > 1 && card.special === '+2')
        this.nextPlayer.handDeck.push(this.#deck.draw({ count: 2 }))
      else if (this.#deck.length < 2 && card.special === '+2') {
        this.nextPlayer.handDeck.push(this.#deck.draw())
        this.#discardToDeck()
        this.nextPlayer.handDeck.push(this.#deck.draw())
      }
    } else if (card.special === 'cambio')
      this.#currentColor = card.color
    else if (card.special === 'reversa') {
      this.#rightTurn = !this.#rightTurn
      if (this.#players.length === 2) {
        this.nextPlayer.blocked = true
        this.nextPlayer.draw = true
      }
    }
  }

  async endGame (type) {
    this.#turn.user = this.#players.at(this.#turn.index)
    this.#started = false
    this.#ended = true
    this.#endTimestamp = new Date()

    await tableEventEmitter.emit('end', this, this.startTimestamp, this.endTimestamp, type, this.#players.at(0).id)
  }

  async cancelGame () {
    this.#turn.user = this.#players.at(this.#turn.index)
    this.#started = false
    this.#ended = true
    await tableEventEmitter.emit('cancel', this)
  }

  #discardFirstCard () {
    let discardCard
    do {
      discardCard = this.#deck.draw()

      if (discardCard.special)
        this.#deck.push(discardCard)
    } while (discardCard.special)

    this.#currentColor = discardCard.color
    this.#discard.push(discardCard)
  }

  #discardToDeck () {
    this.#deck.push(this.#discard.cards)
    this.#discard = []
    this.#discardFirstCard()
  }
}

module.exports = {
  Table,
  tableEventEmitter
}

/**
 * Cambios para la v3
 * - Creación/Eliminación de una partida estará manejado por la API
 * - Crear una clase Collection como la de discord para manejar las partidas, dicha clase se encargará de manejar lo anterior, así como emitir 'create' y 'delete'
 * - Como adicional a lo anterior, también podrá emitir el evento 'exists' cuando se intenta crear una nueva partida y ya existe una con la misma ID
 * - Posiblemente un sistema de elos... y quizá hasta rangos...
 * - Quizá ponerle un timer
 */
