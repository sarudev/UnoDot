/* global client */
const chalk = require('chalk')
const diona = require('../config/logs')

module.exports = {
  name: 'interactionCreate',
  /**
   * @param {import('discord.js').Interaction} int
   */
  exec: async (int) => {
    if (!int.isCommand())
      return

    if (!(await int.guild.members.fetch(client.user.id)).permissionsIn(int.channel).has('3072'))
      return int.reply({ content: 'No puedo ver/enviar mensajes a este canal.\nMissing Access', ephemeral: true })

    const cmd = client.slashCommands.find(sc => sc.slashCommand.name === int.commandName)

    if (!cmd)
      return

    try {
      return await cmd.exec(int, int.options._hoistedOptions)
    } catch (e) {
      console.log(chalk.red('#'.repeat(process.stdout.columns)))
      diona.err('Error in slashCommand %s', cmd.slashCommand.name, 'cyan')
      diona.err(e)
      console.log(chalk.red('#'.repeat(process.stdout.columns)))
    }
  }
}
