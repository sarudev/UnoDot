/* global client */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Table } = require('../../assets/Uno/Table.js')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Crear partida.'),
  /**
   * @param {import('discord.js').Interaction} int
   */
  exec: async (int) => {
    let table = client.partidas.find(p => p.room === int.channelId)
    if (table)
      return await int.reply({ embeds: [client.error.setDescription('**Ya existe una partida en esta sala.**')], ephemeral: true })

    const gameCreated = setTimeout(() => {
      int.channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: 'Tiempo excedido.', iconURL: client.user.avatarURL() })
            .setDescription('**Se excedió el tiempo límite de 5 minutos.\nLa partida fue cancelada.**')
            .setColor(0x5865f2)
        ]
      })
      client.partidas.sweep(p => p.room === int.channelId)
    }, process.env.AUTO_CANCEL)

    table = new Table({ creatorId: int.user.id, roomId: int.channelId, editableObject: { gameCreated, int } })
    client.partidas.set(int.channelId, table)
  }
}
