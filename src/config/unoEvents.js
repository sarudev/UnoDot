/* global client */
const { time, EmbedBuilder, formatEmoji } = require('discord.js')
const { tableEventEmitter, Table } = require('../../assets/Uno/Table.js') // eslint-disable-line no-unused-vars

const functions = {
  /**
   * @param {Table} table
   */
  create: async (table) => {
    const int = table.editableObject.int
    embeds.int = int

    await int.reply({ embeds: [embeds.create(table.creator.id)] })
  },
  /**
   * @param {Table} table
   */
  join: async (table, playerId) => {
    const int = table.editableObject.int

    await int.reply({ embeds: [embeds.join(playerId)] })
  },
  /**
   * @param {Table} table
   */
  leave: async (table, playerId, win) => {
    const int = table.editableObject.int

    if (table.editableObject.kick)
      await int.channel.send({ embeds: [embeds.kick(playerId)] })
    else if (win) {
      await int.channel.send({ embeds: [embeds.win(playerId)] })
    } else {
      await int.reply({ embeds: [embeds.leave(playerId)] })
    }
  },
  /**
   * @param {Table} table
   */
  start: async (table, playerId, card, color) => {
    const int = table.editableObject.int

    await int.reply({ embeds: [embeds.start(playerId, card, color)] })

    clearTimeout(table.editableObject.gameCreated)

    const kickPlayer = autoLeave(table, playerId)
    table.editableObject.kickPlayer = kickPlayer
  },
  /**
   * @param {Table} table
   */
  end: async (table, startTimestamp, endTimestamp, type, playerid) => {
    const int = table.editableObject.int

    await int.channel.send({ embeds: [embeds.end(playerid, startTimestamp, endTimestamp, type)] })

    clearTimeout(table.editableObject.kickPlayer)
    client.partidas.sweep(p => p.room === table.room)
  },
  /**
   * @param {Table} table
   */
  cancel: async (table) => {
    const int = table.editableObject.int

    await int.channel.send({ embeds: [embeds.cancel()] })

    clearTimeout(table.editableObject.gameCreated)
    client.partidas.sweep(p => p.room === table.room)
  },
  /**
   * @param {Table} table
   */
  turn: async (table, playerId) => {
    const int = table.editableObject.int

    await int.channel.send({ embeds: [embeds.turn(playerId, table.players)] })

    clearTimeout(table.editableObject.kickPlayer)
    const kickPlayer = autoLeave(table, playerId)
    table.editableObject.kickPlayer = kickPlayer
  },
  /**
   * @param {Table} table
   */
  draw: async (table, state, playerid, card) => {
    const int = table.editableObject.int

    await int.deferReply({ ephemeral: true })
    await int.followUp({ embeds: [embeds.drawed(playerid, card)] })
    await int.channel.send({ embeds: [embeds.draw(playerid, state, card)] })
  },
  /**
   * @param {Table} table
   */
  play: async (table, playerId, card, color, skipped) => {
    const int = table.editableObject.int

    await int.reply({ embeds: [embeds.play(playerId, card, color, skipped, table.players.length)] })
  },
  /**
   * @param {Table} table
   */
  uno: async (table, playerid) => {
    const int = table.editableObject.int

    await int.reply({ embeds: [embeds.uno(playerid)] })
  },
  /**
   * @param {Table} table
   */
  creatorChanged: async (table, newCreator) => {
    const int = table.editableObject.int

    await int.channel.send({ embeds: [embeds.creatorChanged(newCreator)] })
  }
}

function autoLeave (table, playerId) {
  const timeOut = setTimeout(async () => {
    table.editableObject.kick = true
    await table.leave({ playerId })
    table.editableObject.kick = false
  }, process.env.AUTO_LEAVE)
  return timeOut
}

const embeds = {
  get warning () {
    return formatEmoji('1018381367551201340', true)
  },
  create (playerid) {
    const player = this.player(playerid)

    return new EmbedBuilder()
      .setAuthor({ name: `Nueva partida - Sala N ° ${this.int.channelId}`, iconURL: client.user.avatarURL() })
      .setDescription(`**${player} acaba de crear una nueva partida en este canal.**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0xf61b2a)
      .setFields(
        [
          { name: '\u200b', value: '**Para unirte a la partida.\n> `/join`**', inline: true },
          { name: '\u200b', value: '**Para salirte de la partida.\n> `/leave`**', inline: true },
          { name: '\u200b', value: '**Para ver las reglas.\n> `/rules`**', inline: true },
          { name: '\u200b', value: '**Para ver los comandos.\n> `/commands`**', inline: true },
          { name: '\u200b', value: '**Para comenzar la partida.\n> `/start`**', inline: true },
          { name: '\u200b', value: `**${this.warning} Autocancel ${time(new Date(Date.now() + +process.env.AUTO_CANCEL), 'R')} ${this.warning}**\n\u200b` }
        ]
      )
      .setFooter({ text: `Made with 💖 by ${client.creator.username}`, iconURL: client.creator.avatarURL() })
  },
  join (playerid) {
    const player = this.player(playerid)

    return new EmbedBuilder()
      .setAuthor({ name: 'Nuevo jugador en la sala.', iconURL: client.user.avatarURL() })
      .setDescription(`**${player} se unió a la partida.**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x3dc9e3)
  },
  leave (playerid) {
    const player = this.player(playerid)

    return new EmbedBuilder()
      .setAuthor({ name: 'Un jugador se fue.', iconURL: client.user.avatarURL() })
      .setDescription(`**${player} abandonó la partida.**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x216e7d)
  },
  kick (playerid) {
    const player = this.player(playerid)

    return new EmbedBuilder()
      .setAuthor({ name: 'Un jugador fue expulsado.', iconURL: client.user.avatarURL() })
      .setDescription(`**${player} se quedó sin tiempo para jugar.**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x216e7d)
  },
  win (playerid) {
    const player = this.player(playerid)

    return new EmbedBuilder()
      .setAuthor({ name: 'Un jugador ganó.', iconURL: client.user.avatarURL() })
      .setDescription(`**${player} jugó todas sus cartas y ganó.**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x216e7d)
  },
  timeout () {
    return new EmbedBuilder()
      .setAuthor({ name: 'Tiempo excedido.', iconURL: client.user.avatarURL() })
      .setDescription('**Se excedió el tiempo límite de 5 minutos.\nLa partida fue cancelada.**')
      .setColor(0x5865f2)
  },
  start (playerid, card, color) {
    const player = this.player(playerid)
    const emojiId = client.gameEmojis[card.color + card.value]

    return new EmbedBuilder()
      .setAuthor({ name: 'La partida ha comenzado.', iconURL: client.user.avatarURL() })
      .setDescription(`**El primero en jugar es ${player}\n${this.warning} Autoleave ${time(new Date(Date.now() + +process.env.AUTO_LEAVE), 'R')} ${this.warning}**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x56aa55)
      .addFields(
        { name: '\u200b', value: '**👇 Descarte 👇**' }
      )
      .setImage(`https://cdn.discordapp.com/emojis/${emojiId}.png`)
  },
  play (playerid, card, color, skipped, cantPlayers) {
    const player = this.player(playerid)
    const emojiId = client.gameEmojis[color + (card.value || card.special.replace('+', '_'))]

    return new EmbedBuilder()
      .setAuthor({ name: 'Carta jugada.', iconURL: client.user.avatarURL() })
      .setDescription(
        `**${['+4', '+2', 'bloqueo'].includes(card.special) || (card.special === 'reversa' && cantPlayers === 2) ? `${this.player(skipped)} fue bloqueado.\n\n` : ''}👇 ${player} jugó 👇**`
      )
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x56aa55)
      .setImage(`https://cdn.discordapp.com/emojis/${emojiId}.png`)
  },
  turn (playerid, playerList) {
    const player = this.player(playerid)

    return new EmbedBuilder()
      .setAuthor({ name: 'Cambio de turno.', iconURL: client.user.avatarURL() })
      .setDescription(`**Turno de ${player}\n${this.warning} Autoleave ${time(new Date(Date.now() + +process.env.AUTO_LEAVE), 'R')} ${this.warning}**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x56aa55)
      .addFields(...this.turnFunc(playerList))
  },
  end (playerid, startTimestamp, endTimestamp, type) {
    const player = this.player(playerid)

    return new EmbedBuilder()
      .setAuthor({ name: 'Partida terminada.', iconURL: client.user.avatarURL() })
      .setDescription(`**El ${type === 'play' ? 'perdedor' : 'ganador'} es ${player}**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0xf61b2a)
      .addFields(
        { name: 'Comenzado', value: time(new Date(startTimestamp), 'T'), inline: true },
        { name: 'Finalizado', value: time(new Date(endTimestamp), 'T'), inline: true }
      )
  },
  cancel () {
    return new EmbedBuilder()
      .setAuthor({ name: 'Partida terminada.', iconURL: client.user.avatarURL() })
      .setDescription('**Se fueron todos los jugadores.\nLa sala fue eliminada automáticamente.**')
      .setColor(0x56aa55)
  },
  draw (playerid, state) {
    const player = this.player(playerid)

    return new EmbedBuilder()
      .setAuthor({ name: 'Carta tomada.', iconURL: client.user.avatarURL() })
      .setDescription(`**${player} tomó una carta y ${state ? '' : 'no'} puede jugar.**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x56aa55)
  },
  drawed (playerid, card) {
    const player = this.player(playerid)

    const emojiId = client.gameEmojis[(card.color || '') + (card.value || card.special.replace('+', '_'))]
    return new EmbedBuilder()
      .setAuthor({ name: 'Carta tomada.', iconURL: client.user.avatarURL() })
      .setDescription(`**¡Hey ${player.username}!\nEsta es tu carta.**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x56aa55)
      .setImage(`https://cdn.discordapp.com/emojis/${emojiId}.png`)
  },
  uno (playerid) {
    const player = this.player(playerid)

    return new EmbedBuilder()
      .setAuthor({ name: '¡UNO!', iconURL: client.user.avatarURL() })
      .setDescription(`**${player} cantó UNO**\nSi juega su última carta, ganará.`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x56aa55)
  },
  creatorChanged (playerid) {
    const player = this.player(playerid)

    return new EmbedBuilder()
      .setAuthor({ name: 'Cambio de Creador.', iconURL: client.user.avatarURL() })
      .setDescription(`**${player} es el nuevo creador de la sala.**`)
      .setThumbnail(player.avatarURL() || player.defaultAvatarURL)
      .setColor(0x56aa55)
  },
  turnFunc (playerList) {
    const fields = []
    playerList.forEach((p, i) => {
      fields.push({ name: '\u200b', value: `**<@${p.id}>\n> ${p.handDeck.length} ${p.handDeck.length > 1 ? 'cartas' : 'carta'} restantes.${p.uno ? '\nUNO' : ''}**`, inline: true })
      if ((i + 1) % 2 === 0)
        fields.push({ name: '\u200b', value: '\u200b', inline: true })
    })
    return fields
  },
  player (playerId) {
    return client.users.cache.get(playerId)
  }
}

module.exports = {
  load: () => {
    const names = Object.keys(functions)
    const funcs = Object.values(functions)
    for (const i in funcs)
      tableEventEmitter.on(names[i], funcs[i])
  }
}
