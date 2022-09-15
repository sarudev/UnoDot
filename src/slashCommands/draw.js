/* global client */
const { SlashCommandBuilder } = require('discord.js')
const errors = require('../../assets/errors.json')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('draw')
    .setDescription('Tomar una carta de la baraja.'),
  exec: async (int) => {
    const table = client.partidas.find(p => p.room === int.channelId)
    if (!table)
      return await int.reply({ embeds: [client.error.setDescription('**No existe ninguna partida en esta sala.**')], ephemeral: true })

    try {
      table.editableObject.int = int
      await table.draw({ playerId: int.user.id })
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
