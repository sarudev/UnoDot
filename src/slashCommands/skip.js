/* global client */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const errors = require('../../assets/errors.json')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Saltar tu turno.'),
  /**
     * @param {import('discord.js').Interaction} int
     */
  exec: async (int) => {
    const table = client.partidas.find(p => p.room === int.channelId)
    if (!table)
      return await int.reply({ embeds: [client.error.setDescription('**No existe ninguna partida en esta sala.**')], ephemeral: true })

    if (table.currentPlayer.id !== int.user.id)
      return await int.reply({ embeds: [client.error.setDescription('**No es tu turno.**')], ephemeral: true })

    try {
      await int.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: 'Jugada saltada.', iconURL: client.user.avatarURL() })
            .setDescription(`**<@${int.user.id}> saltó su turno.${table.currentPlayer.draw ? '' : '\nSe comió una carta por no haber levantado antes.'}**`)
            .setThumbnail(int.user.avatarURL() || int.user.defaultAvatarURL)
            .setColor(0x435276)
        ]
      })
      table.editableObject.int = int
      await table.nextTurn({ playerId: int.user.id })
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
