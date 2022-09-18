/* global client */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('destroy')
    .setDescription('Eliminar partida.'),
  exec: async (int) => {
    const table = client.partidas.find(p => p.room === int.channelId)
    if (!table)
      return await int.reply({ embeds: [client.error.setDescription('**No existe ninguna partida en esta sala.**')], ephemeral: true })

    if (!table.started)
      return await int.reply({ embeds: [client.error.setDescription('**Este comando solo funciona con partidas ya comenzadas.\nUtiliza el comando `/cancel` en su lugar.**')], ephemeral: true })

    if (int.user.id !== table.creator.id)
      return await int.reply({ embeds: [client.error.setDescription('**No eres el creador de la sala.**')], ephemeral: true })

    clearTimeout(table.editableObject.kickPlayer)
    client.partidas.sweep(p => p.room === int.channelId)
    return await int.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `No me quiero ir señor ${client.creator.username}...`, iconURL: client.user.avatarURL() })
          .setColor(0xf61b29)
          .setImage('https://pa1.narvii.com/6941/9dcc7a45fa7d826f7a7e624cb425c13760de8c64r1-320-124_hq.gif')
      ]
    })
  }
}
