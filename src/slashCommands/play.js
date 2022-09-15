/* global client */
const { SlashCommandBuilder } = require('discord.js')
const errors = require('../../assets/errors.json')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Jugar una carta')
    .addStringOption(option => option.setName('carta')
      .setDescription('La carta a jugar')
      .setRequired(true)
      .addChoices(
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
        { name: '4', value: '4' },
        { name: '5', value: '5' },
        { name: '6', value: '6' },
        { name: '7', value: '7' },
        { name: '8', value: '8' },
        { name: '9', value: '9' },
        { name: 'bloqueo', value: 'bloqueo' },
        { name: 'reversa', value: 'reversa' },
        { name: 'cambio', value: 'cambio' },
        { name: '+2', value: '+2' },
        { name: '+4', value: '+4' }
      )
    )
    .addStringOption(option => option.setName('color')
      .setDescription('El color de la carta')
      .setRequired(true)
      .addChoices(
        { name: 'azul', value: 'azul' },
        { name: 'rojo', value: 'rojo' },
        { name: 'verde', value: 'verde' },
        { name: 'amarillo', value: 'amarillo' }
      )
    ),
  /**
   * @param {import('discord.js').Interaction} int
   */
  exec: async (int, args) => {
    const table = client.partidas.find(p => p.room === int.channelId)
    if (!table)
      return await int.reply({ embeds: [client.error.setDescription('**No existe ninguna partida en esta sala.**')], ephemeral: true })

    try {
      table.editableObject.int = int
      await table.play({ playerId: int.user.id, card: [args[0].value, args[1].value] })
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
