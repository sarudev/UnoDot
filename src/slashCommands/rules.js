const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Muestra las reglas del UNO.'),
  exec: async (int) => {
    const embed = new EmbedBuilder()
      .setColor(0xec2127)
      .setAuthor({ name: 'Uno BOT', iconURL: client.user.avatarURL() })
      .setThumbnail(client.user.avatarURL())
      .addFields(
        { name: 'Bloqueo', value: '> Bloquea al siguiente jugador.\n\u200b' },
        { name: 'Reversa', value: '> Se invierte el giro de la ronda.\n\u200b' },
        { name: 'Cambio', value: '> Cambia el color del descarte.\n\u200b' },
        { name: '+2', value: '> El siguiente jugador se come `2` cartas y pierde un turno.\n\u200b' },
        { name: '+4', value: '> El siguiente jugador se come `4` cartas y pierde un turno.\n\u200b' },
        { name: 'Jugada', value: '> Solo se puede jugar una carta del mismo **color**, **valor** o **símbolo** que la carta del descarte.\n\u200b' },
        { name: 'Especiales', value: '> Las cartas `+4` y `cambio` se pueden tirar en cualquier momento.\n\u200b' },
        { name: '+2 y +4', value: '> Cuando un jugador tira un `+2`, el siguiente no puede tirar un `+4`, y viceversa.\n\u200b' },
        { name: '2 jugadores', value: '> Cuando solo hay dos jugadores, una carta `reversa` funciona como una `bloqueo`.\n\u200b' }
      )
      .setFooter({
        text: `v${require('../../package.json').version} • Made with 💖 by ${client.creator.username}#${client.creator.discriminator}`,
        iconURL: client.creator.avatarURL()
      })

    await int.reply({ embeds: [embed], ephemeral: false })
  }
}
