const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  slashCommand: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Ayuda sobre los comandos.'),
  exec: async (int) => {
    const embed = new EmbedBuilder()
      .setColor(0xec2127)
      .setAuthor({ name: 'Uno BOT', iconURL: client.user.avatarURL() })
      .setThumbnail(client.user.avatarURL())
      .addFields(
        ...cmds(client.slashCommands.map(s => ({ name: s.slashCommand.name, description: s.slashCommand.description })))
      )
      .setFooter({
        text: `v${require('../../package.json').version} • Made with 💖 by ${client.creator.username}#${client.creator.discriminator}`,
        iconURL: client.creator.avatarURL()
      })

    await int.reply({ embeds: [embed], ephemeral: false })
  }
}

function cmds (cmdList) {
  const fields = []
  cmdList.forEach((p, i) => {
    fields.push({ name: '\u200b', value: `**${p.description}**\n> \`/${p.name}\``, inline: true })
    if ((i + 1) % 2 === 0 || i === cmdList.length - 1)
      fields.push({ name: '\u200b', value: '\u200b', inline: true })
  })
  return fields
}
