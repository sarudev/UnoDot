/* global client */
const chalk = require('chalk')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'ready',
  exec: async () => {
    client.error = new EmbedBuilder()
      .setAuthor({ name: 'SystemError', iconURL: client.user.avatarURL() })
      .setColor(0x325432)
    client.gameEmojis = {
      amarillo1: '1019135805605818370',
      amarillo2: '1019135807392591912',
      amarillo3: '1019135809389068371',
      amarillo4: '1019135811519774750',
      amarillo5: '1019135813050712065',
      amarillo6: '1019135815193993236',
      amarillo7: '1019135752682090547',
      amarillo8: '1019135754028453948',
      amarillo9: '1019135754938626069',
      amarilloreversa: '1019135758105333811',
      amarillobloqueo: '1019135756725399573',
      amarillo_2: '1019136105859268618',
      amarillo_4: '1019136083860131910',
      amarillocambio: '1019136085143597096',
      azul1: '1019135759585906750',
      azul2: '1019135760844193832',
      azul3: '1019135762152828949',
      azul4: '1019135763247550517',
      azul5: '1019135764904288277',
      azul6: '1019135766426832897',
      azul7: '1019135767483777025',
      azul8: '1019135769429946408',
      azul9: '1019135770868584518',
      azulreversa: '1019135773536178236',
      azulbloqueo: '1019135772177211402',
      azul_2: '1019136086494167050',
      azul_4: '1019136087869890571',
      azulcambio: '1019136089207869500',
      rojo1: '1019135774400192543',
      rojo2: '1019135776048566292',
      rojo3: '1019135777491390545',
      rojo4: '1019135778254749697',
      rojo5: '1019135780297392159',
      rojo6: '1019135781647958046',
      rojo7: '1019135783094980650',
      rojo8: '1019135784395231252',
      rojo9: '1019135785699651635',
      rojoreversa: '1019135788388200549',
      rojobloqueo: '1019135787092160512',
      rojo_2: '1019136095646130227',
      rojo_4: '1019136096560480280',
      rojocambio: '1019136098460516362',
      verde1: '1019135789776506895',
      verde2: '1019135791194177606',
      verde3: '1019135792544747531',
      verde4: '1019135794193121280',
      verde5: '1019135795665309716',
      verde6: '1019135797242363934',
      verde7: '1019135798492287016',
      verde8: '1019135799847030784',
      verde9: '1019135801168252948',
      verdereversa: '1019135804246855710',
      verdebloqueo: '1019135802707562516',
      verde_2: '1019136099974647848',
      verde_4: '1019136101526548511',
      verdecambio: '1019136102705135656',
      _4: '1019136104135409724',
      cambio: '1019136094324928552',
      mazo: '1019330277274833017',
      desc: '1019330275878129664',
      arte: '1019330274363965491'
    }
    client.creator = await client.users.fetch('999693766313123860')
    console.log(`\nLogged in as ${chalk.cyan(client.user.tag)}!\n`)
  }
}