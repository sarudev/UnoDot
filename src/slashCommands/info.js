/* global client */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Información sobre el bot.'),
  exec: async (int) => {
    const table = client.partidas.find(t => t.room === int.channelId)
    const embed = new EmbedBuilder()
      .setColor(0xec2127)
      .setAuthor({ name: 'Uno BOT', iconURL: client.user.avatarURL() })
      .setThumbnail(client.user.avatarURL())
    if (table)
      embed.addFields(
        { name: '----------- Esta partida -----------', value: `**Creador**\n>  <@${table.creator.id}>`, inline: true },
        { name: '\u200B', value: `**Estado**\n> ${table.started ? 'Jugando' : 'En espera'}`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '\u200B', value: `**Jugadores**\n> \` ${table.players.length} \` actualmente`, inline: true }
      )
    if (table && !table.started)
      embed.addFields(
        { name: '\u200B', value: `**Tiempo restante (autocancel)**\n> en \` ${Math.floor(timeLeft(table?.editableObject?.gameCreated) / 1000)} \` segundos`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '\u200B', value: '\u200B' }
      )
    if (table && table.started)
      embed.addFields(
        { name: '\u200B', value: `**Tiempo restante (autoleave)**\n> en \` ${Math.floor(timeLeft(table?.editableObject?.kickPlayer) / 1000)} \` segundos`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '\u200B', value: `**Turno actual**\n> <@${table.currentPlayer.id}>`, inline: true },
        { name: '\u200B', value: `**Siguiente turno (posible)**\n> <@${table.players.at(table.leftTurn ? table.turn.index + 1 : table.turn.index - 1).id}>`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '\u200B', value: `**Baraja**\n> \` ${table.deck.length} \` cartas restantes`, inline: true },
        { name: '\u200B', value: `**Mano**\n> \` ${table.currentPlayer.handDeck.length} \` cartas restantes`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '\u200B', value: `**Sentido**\n> ${table.leftTurn ? '` ↓ `\n> En orden de entrada de jugadores' : '` ↑ `\n> Contrario al orden de entrada de jugadores'}` },
        { name: '\u200B', value: '\u200B' }
      )
    embed.addFields(
      { name: '----------- General -----------', value: '**Para ver los comandos**\n> `/commands`', inline: true },
      { name: '\u200B', value: '**Para ver las reglas**\n> `/rules`', inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: '\u200B', value: `**Latencia con el usuario**\n> \`${Math.abs(Date.now() - int.createdTimestamp)}ms\` `, inline: true },
      { name: '\u200B', value: `**Latencia con discord**\n> \`${Math.round(client.ws.ping)}ms\`\n\u200B`, inline: true },
      { name: '\u200B', value: '\u200B', inline: true }
    )
    // .setTimestamp(1661381926152)
      .setFooter({
        text: `v${require('../../package.json').version} • Made with 💖 by ${client.creator.username}#${client.creator.discriminator}`,
        iconURL: client.creator.avatarURL()
      })

    int.reply({ embeds: [embed], ephemeral: true })
  }
}

function timeLeft (timeout) {
  if (!timeout)
    return null
  return Math.floor(((timeout._idleStart + timeout._idleTimeout) / 1000 - process.uptime()) * 1000)
}
