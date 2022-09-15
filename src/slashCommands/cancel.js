/* global client */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('cancel')
    .setDescription('Cancelar partida.'),
  exec: async (int) => {
    const table = client.partidas.find(p => p.room === int.channelId)
    if (!table)
      return await int.reply({ embeds: [client.error.setDescription('**No existe ninguna partida en esta sala.**')], ephemeral: true })

    if (table.started)
      return await int.reply({ embeds: [client.error.setDescription('**No se puede cancelar una partida que ya comenzó**')], ephemeral: true })

    if (table.creator.id !== int.user.id)
      return await int.reply({ embeds: [client.error.setDescription('**No eres el creador de la sala.**')], ephemeral: true })

    client.partidas.sweep(p => p.room === int.channelId)
    clearTimeout(table.editableObject.gameCreated)
    return await int.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: 'SystemSuccess', iconURL: client.user.avatarURL() })
          .setColor(0xf61b2a)
          .setDescription('**Sala cancelada exitosamente.**')
      ]
    }) // EMBED
  }
}
