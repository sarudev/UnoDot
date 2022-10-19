/* global client */
const { Client, GatewayIntentBits, Collection, Routes } = require('discord.js')
const { REST } = require('@discordjs/rest')
const glob = require('glob')
const chalk = require('chalk')
const diona = require('./src/config/logs')
require('dotenv').config()

;(async () => {
  try {
    globalThis.client = new Client({
      intents: [
        // Acceder a las guilds
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })

    // Cargar eventos para la API de UNO
    require('./src/config/unoEvents').load()

    // Guardar la ID de la guild de test y la ID del cliente
    const clientId = '1008822242957856810'
    // const guildId = '999699194589753424'

    // Colecciones para los comandos y las partidas
    client.slashCommands = new Collection()
    client.partidas = new Collection()
    client.gameEmojis = {}

    // Glob para los archivos y require.resolve para las rutas completas
    const slashCommands = glob.sync('./src/slashCommands/**/*.js')
      .map(f => require.resolve(f))

    // Pushear a la coleccion de comandos, los archivos ya requeridos
    for (const command of slashCommands) {
      const cmd = require(command)
      if (cmd.slashCommand)
        client.slashCommands.set(command, cmd)
    }

    // Conectarse a rest
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN)

    // array con los directorios de los eventos eventos. nested
    const events = glob.sync('./src/events/**/*.js', { ignore: './src/events/index.js' })
    // transformar el directorio de los archivos con require.resolve
      .map(f => require.resolve(f))
    // por cada archivo, suscribirse al evento indicado
    for (const file of events) {
      // requerir cada evento inidividualmente
      const event = require(file)
      diona.info('loaded event %s', event.name, 'cyan')
      // suscribirse al evento con nombre event.name
      client.on(event.name, async (...args) => {
        try {
          // re-requerir el evento y ejecutar su función asociada
          await event.exec(...args)
        } catch (e) {
          console.log(chalk.red('#'.repeat(process.stdout.columns)))
          diona.err('Error in event %s', event.name, 'cyan')
          diona.err(e)
          console.log(chalk.red('#'.repeat(process.stdout.columns)))
        }
      })
    }

    // Recargar comandos de barra
    diona.info('Started refreshing application (/) commands...')

    const body = Array.from(client.slashCommands.values()).map(c => c.slashCommand.toJSON())

    const data = await rest.put(Routes.applicationCommands(clientId), { body })

    diona.info(`Successfully reloaded ${data} application (/) commands.`)

    client.login(process.env.BOT_TOKEN)
  } catch (e) {
    console.log(chalk.red('#'.repeat(process.stdout.columns)))
    diona.err('Error reloading %s', 'commands', 'cyan')
    diona.err(e)
    console.log(chalk.red('#'.repeat(process.stdout.columns)))
  }
})()
