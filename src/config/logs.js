const chalk = require('chalk')
const glob = require('glob')

/**
 *
 * @param  {...any} args - Argumentos a mostrar en el log [DEBUG]
 * Lo correcto es enviar en pares de tres (string, variable, color)
 * No enviando el tercer argumento, usa el color blanco por defecto
 * No enviando el segundo argumento, usa únicamente el primer argumento
 */
const debug = (...args) => console.log(chalk.cyan('[DEBUG]'), args.length > 1 ? stringTransform(...args) : args[0])

/**
 *
 * @param  {...any} args - Argumentos a mostrar en el log [INFO]
 */

const info = (...args) => console.log(chalk.yellow('[INFO]'), args.length > 1 ? stringTransform(...args) : args[0])

/**
 *
 * @param  {...any} args - Argumentos a mostrar en el log [ERROR]
 */
const err = (...args) => console.log(chalk.red(`[${date()}] [ERROR]`), args.length > 1 ? stringTransform(...args) : args[0])

/**
 *
 * @param {Array} files - Array de directorios de archivos .js
 */
const clearCache = (files) => {
  files = typeof files === 'string' ? [files] : files
  for (const file of files)
    delete require.cache[file]
}

/**
 *
 * @param {String} pattern - Patrón de búsqueda según glob
 * @returns {Array} - Array con los directorios de los archivos
 */
const resolve = (pattern) => glob.sync(pattern).map(f => require.resolve(__dirname.split('src')[0] + f))

function date () {
  const date = new Date(Date.now())
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  return `${hour}:${minute}:${seconds}`
}

function stringTransform (...args) {
  let msg = args[0]
  for (let i = 1; i < args.length; i += 2) {
    const variable = args[i]
    const color = chalk[args[i + 1]] || chalk.white

    if (msg.includes('%s'))
      msg = msg.replace('%s', color(variable)) + ' '
  }
  const message = msg.split(' ')
  for (let i = 0; i < message.length; i++) {
    if (msg.includes('%s'))
      msg = msg.replace('%s', chalk.red('undefined'))
  }
  return msg
}

module.exports = {
  debug,
  info,
  err,
  clearCache,
  resolve
}
