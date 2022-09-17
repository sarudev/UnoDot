/* global client */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('howtoplay')
    .setDescription('Instrucciones del juego.'),
  exec: async (int) => {
    const embed = new EmbedBuilder()
      .setColor(0xec2127)
      .setAuthor({ name: 'Uno BOT', iconURL: client.user.avatarURL() })
      .setThumbnail(client.user.avatarURL())
      .addFields(
        { name: 'Primer turno', value: '> El primer turno se elige al azar entre los jugadores.\n\u200b' },
        { name: 'Sentido', value: '> El *giro* de la ronda va en el mismo orden de como entraron los jugadores a la mesa.\n\u200b' },
        { name: 'Uno', value: '> Solo es posible cantar `UNO` (`/uno`) cuando es tu turno y tienes dos cartas, a partir de entonces estarás marcado como *cantante* (al cambiar de turno, debajo de tu cantidad de cartas dice "**UNO**").\n> Cuando sea tu turno nuevamente deberás jugar tu última carta para ganar.\n> Perderás el estado de *cantante* cuando tengas más de una carta en tu mazo.\n\u200b' },
        { name: 'Creador', value: '> Si el creador (`/info`) abandona la partida (`/leave`), su permiso como "creador" es dado al siguiente jugador.\n\u200b' },
        { name: 'Abandonar', value: '> Los jugadores pueden salirse en cualquier momento.\n\u200b' },
        { name: 'Saltar turno', value: '> Si se salta el turno (`/skip`) sin haber tomado una carta, se agarra una carta automáticamente.\n\u200b' },
        { name: 'Tomar carta', value: '> Si al tomar una carta (`/draw`) no es posible realizar una jugada, el turno es saltado de manera automática.\n\u200b' },
        { name: 'Ganar', value: '> Gana quien pueda tirar todas sus cartas.\n\u200b' },
        { name: 'Perder', value: '> Pierde quien se quede en la mesa cuando todos los demás ganaron.\n\u200b' }
      )
      .setFooter({
        text: `v${require('../../package.json').version} • Made with 💖 by ${client.creator.username}#${client.creator.discriminator}`,
        iconURL: client.creator.avatarURL()
      })

    await int.reply({ embeds: [embed], ephemeral: true })
  }
}
