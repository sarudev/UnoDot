/* global client */
const { SlashCommandBuilder, formatEmoji } = require('discord.js')
const errors = require('../../assets/errors.json')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('deck')
    .setDescription('Ver tu propio mazo.'),
  exec: async (int) => {
    const table = client.partidas.find(p => p.room === int.channelId)
    if (!table)
      return await int.reply({ embeds: [client.error.setDescription('**No existe ninguna partida en esta sala.**')], ephemeral: true })

    try {
      return await int.reply({
        content: convert(table, int.user.id),
        ephemeral: true
      })
    } catch (e) {
      const error = errors[e.message]
      if (error)
        return await int.reply({ embeds: [client.error.setDescription(`**${error}**`)], ephemeral: true })
      else {
        console.log(e)
        return await int.reply({ embeds: [client.error.setDescription(`**Este error no debería aparecer, por favor contactate con Saru#5673 para que pueda solucionarlo.\n${e.message}**`)] })
      }
    }
  }
}

function convert (table, playerId) {
  const cartas = table.handDeck({ playerId }).map(c => client.gameEmojis[(c.color || '') + (c.value || c.special.replace('+', '_'))])
  const discard = client.gameEmojis[table.currentColor + (table.discard.value || table.discard.special.replace('+', '_'))]
  return (`${formatEmoji(client.gameEmojis.mazo)}\n${cartas.map(c => formatEmoji(c)).join('')}\n${formatEmoji(client.gameEmojis.desc)} ${formatEmoji(client.gameEmojis.arte)}\n${formatEmoji(discard)}`)
}
