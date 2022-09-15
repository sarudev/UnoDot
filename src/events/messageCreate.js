const { EmbedBuilder, hyperlink } = require('discord.js')
const saru = client.users.cache.get('999693766313123860')

module.exports = {
  name: 'messageCreate',
  /**
   * @param {import('discord.js').Message} int
   */
  exec: async (int) => {
    if (int.author.bot)
      return

    if (int.content.toLowerCase() === 'uno/play tu mama') {
      return await int.reply({
        content: 'https://cdn.discordapp.com/attachments/1006029432319901748/1009310854455513138/unknown.png',
        allowedMentions: {
          repliedUser: false
        }
      })
    }

    const args = int.content.trim().split(/ +/)
    const cmd = args.shift()
    const exec = args.join(' ')

    if (cmd === 'eval')
      console.log(eval(exec)) // eslint-disable-line no-eval
  }
}
