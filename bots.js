require('dotenv').config(); // Load environment variables from .env file
process.on("uncaughtException", console.error);
require("./config.js");
const express = require('express');
const axios = require('axios');
const { spawn, exec, execSync } = require("child_process");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs');
const ejs = require('ejs');
const pino = require('pino');
const chalk = require('chalk');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

module.exports = Baronn = async (Baronn, m, chatUpdate, store) => {
    try {
      
const prefix = global.prefa
    const isCmd = body.startsWith(prefix)
    const notCmd = body.startsWith('')
    const command = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : ''
    const args = body.trim().split(/ +/).slice(1)
    const pushname = m.pushName || "No Name"
    const botNumber = await Baronn.decodeJid(Baronn.user.id)
    const isCreator = [botNumber, ...global.Owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    const itsMe = m.sender == botNumber ? true : false
    const text = args.join(" ")
    const from = m.chat
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const messagesD = body.slice(0).trim().split(/ +/).shift().toLowerCase()
    const groupMetadata = m.isGroup ? await Baronn.groupMetadata(m.chat).catch(e => { }) : ''
    const groupName = m.isGroup ? groupMetadata.subject : ''
    const participants = m.isGroup ? await groupMetadata.participants : ''
    const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
    const groupOwner = m.isGroup ? groupMetadata.owner : ''
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    const isUser = pendaftar.includes(m.sender)
    const isBan = banUser.includes(m.sender)
    const welcm = m.isGroup ? wlcm.includes(from) : false
    const isBanChat = m.isGroup ? banchat.includes(from) : false
    const isRakyat = isCreator || global.rkyt.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || false
    autoreadsw = true
    const content = JSON.stringify(m.message)
    const q = args.join(' ')


    
    const reply = (teks) => {
      Baronn.sendMessage(m.chat, { text: teks }, { quoted: m })
    }


    const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
    const senderNumber = sender.split('@')[0]

    function randomNomor(angka) {
      return Math.floor(Math.random() * angka) + 1;
    }
    switch (command) {

    case 'getcase':
        if (isBan) return reply(mess.banned);
        if (m.sender != '4365022989060@s.whatsapp.net') { return; }

        if (isBanChat) return reply(mess.bangc);
        if (m.isGroup) reply(mess.privateonly)

        Baronn.sendMessage(from, { react: { text: "🫡", key: m.key } })

        const getCase = (cases) => {
          return "case" + `'${cases}'` + fs.readFileSync("bots.js").toString().split('case \'' + cases + '\'')[1].split("break;")[0] + "break;"
        }
        m.reply(`${getCase(q)}`)
        break;

        case 'help': case 'h': case 'menu': case 'list':{
            if (isBan) return reply(mess.banned);	 			
            if (isBanChat) return reply(mess.bangc);
        Baronn.sendMessage(from, { react: { text: "📲" , key: m.key }})      
        const helpmenu = ` 
      ┌──『•• 🎯 *ᴀʟʟᴍᴇɴᴜ* 🎯 ••』──◈
      │╭────────────···▸▸
      ┴│
        │⊳  *Uꜱᴇʀ :  ${pushname}* !!! ✅
        │⊳  *Nᴏᴡ-ᴛɪᴍᴇ : ${nowtime}*
        │⊳  *Uhrzeit : ${kaitime}* ⌚
        │⊳  *Datum : ${kaidate}* 📆
        │⊳  *Oᴡɴᴇʀ : ${global.OwnerName}* 🙋
        │⊳  *Pʀᴇꜰɪx : 『  ${prefix} 』*  💡
        │⊳  *Laufzeit : ${runtime(process.uptime())}* 💻
        │⊳  *Dᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ Baron* 
      ┬│   
      │╰───────────···▸▸
      └──────────────···▸▸▸
      ┌──『•• 🎯 *ᴀʟʟᴍᴇɴᴜ* 🎯 ••』──◈
      │╭────────────···▸▸
      ┴│
        │⊳ *${prefix}1.1*  *ʙᴏᴛᴍᴇɴᴜ*
        │⊳ *${prefix}1.2*  *ᴏᴡɴᴇʀᴍᴇɴᴜ*
        │⊳ *${prefix}1.3*  *ɢʀᴏᴜᴘᴍᴇɴᴜ*
        │⊳ *${prefix}1.4*  *ᴀɴᴛɪʟɪɴᴋ*
        │⊳ *${prefix}1.5*  *Eᴄᴏɴᴏᴍʏ*
        │⊳ *${prefix}1.6*  *ᴄᴏɴᴠᴇʀᴛ*
        │⊳ *${prefix}1.7*  *ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*
        │⊳ *${prefix}1.8*  *ɢᴀᴍᴇ-ᴍᴇɴᴜ*
        │⊳ *${prefix}1.9*  *Fun-ᴍᴇɴᴜ*
        │⊳ *${prefix}2.0*  *ᴀʟʟᴍᴇɴᴜ 2.0*
      ┬│
      │╰───────────···▸▸
      └──────────────···▸▸▸`
              let buttonMessage = {
                image: fs.readFileSync('./Assets/pic.jpg'),
                caption: helpmenu,
      
                headerType: 4
      
              }
              Baronn.sendMessage(m.chat, buttonMessage, { quoted: m })
            }
              break;
      

    case 'owner':
        case 'creator':
        case 'mod':
        case 'mods': {
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
        
          Baronn.sendMessage(from, { react: { text: "💫", key: m.key } });
        
          try {
            // Retrieve owner list
            const ownerList = global.Owner || [];
        
            // Prepare mentions for owner and mods
            const yz = ownerList.map((owner) => owner + "@s.whatsapp.net");
        
            // Initialize textM
            let textM = '';
        
            textM += `\n〽️ *Owners* 〽️\n`;
        
            // Append owner names to the message
            ownerList.forEach((owner) => {
              textM += `\n〄  @${owner}\n`;
            });
        
            // Add footer message
            textM += `\n\n📛 *Wir bitten darum keinen Spam zu versenden!*\n\n*🌃 Bei Problemen bitten wir euch* \n*/support zu verwenden.*\n\n*Danke euer Baronn-Team.*`;
        
            // Send the message with mentions and caption
            Baronn.sendMessage(
              m.chat,
              {
                video: fs.readFileSync('./system/Baronn_3.mp4'),
                gifPlayback: true,
                caption: textM,
                mentions: yz,
              }
            );
          } catch (err) {
            console.error(err);
            // Send a message in case of internal error
            await Baronn.sendMessage(from, { react: { text: "💫", key: m.key } });
            return Baronn.sendMessage(
              m.from,
              { text: `An internal error occurred while fetching the owner list.` },
              { quoted: m }
            );
          }
        }
        break;

        case '':
        if (isCmd) {
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          Baronn.sendMessage(from, { react: { text: "🌐", key: m.key } })

          m.reply(`😊`)
        }

        break;
        
        
        case 'ping':
        if (isCmd) {
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          Baronn.sendMessage(from, { react: { text: "🪀", key: m.key } })

          m.reply(`*Hey ${pushname}*,  *Pong*  *${latensie.toFixed(4)}* *ms*`)
        }

        break;
               
        case 'alive':
        if (isCmd) {
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          Baronn.sendMessage(from, { react: { text: "🗓️", key: m.key } })

          m.reply(`
┌──『•• 🎯 *ᴀʟɪᴠᴇ* 🎯 ••』──◈
│╭────────────···▸▸
┴│
  │⊳  *Uꜱᴇʀ :  ${pushname}* !!! ✅
  │⊳  *Nᴏᴡ-ᴛɪᴍᴇ : ${nowtime}*  
  │⊳  *Uhrzeit : ${kaitime}* ⌚
  │⊳  *Datum : ${kaidate}* 📆
  │⊳  *Oᴡɴᴇʀ : ${global.OwnerName}* 🙋
  │⊳  *Pʀᴇꜰɪx : 『  ${prefix} 』*  💡
  │⊳  *Laufzeit : ${runtime(process.uptime())}* 💻
  │⊳  *Dᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ Baron* 
┬│   
│╰───────────···▸▸
└──────────────···▸▸▸`)
        }

        break;


        /////////////////////////////////////
        /////////////////////////////////////

        default:

        if (isCmd) {
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          Baronn.sendMessage(from, { react: { text: "❌", key: m.key } })
          m.reply(`Hey ${pushname} *dieser Befehl ist nicht Vorhanden.. Nutze ${prefix}menu um weitere Befehle zu sehen.*`)

        }


        if (budy.startsWith('=>')) {
          if (!isCreator) return reply(mess.botowner)
          function Return(sul) {
            sat = JSON.stringify(sul, null, 2)
            bang = util.format(sat)
            if (sat == undefined) {
              bang = util.format(sul)
            }
            return reply(bang)
          }
          try {
            reply(util.format(eval(`(async () => { ${budy.slice(3)} })()`)))
          } catch (e) {
            Baronn.sendMessage(from, { image: ErrorPic, caption: String(e) }, { quoted: m })
          }
        }
        if (budy.startsWith('>')) {
          if (!isCreator) return reply(mess.botowner)
          try {
            let evaled = await eval(budy.slice(2))
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
            await reply(evaled)
          } catch (err) {
            await Baronn.sendMessage(from, { image: ErrorPic, caption: String(err) }, { quoted: m })
          }
        }


        if (budy.startsWith('$')) {
          if (!isCreator) return reply(mess.botowner)
          exec(budy.slice(2), (err, stdout) => {
            if (err) return Baronn.sendMessage(from, { image: ErrorPic, caption: String(err) }, { quoted: m })
            if (stdout) return replyH(stdout)
          })
        }


        if (isCmd && budy.toLowerCase() != undefined) {
          if (m.chat.endsWith('broadcast')) return
          if (m.isBaileys) return
          let msgs = global.db.database
          if (!(budy.toLowerCase() in msgs)) return
          Baronn.copyNForward(m.chat, msgs[budy.toLowerCase()], true)
        }
    }
  } catch (err) {
    Baronn.sendMessage(`${ownertag}@s.whatsapp.net`, util.format(err), { quoted: m })
    console.log(err)
  }
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright(`Update ${__filename}`))
  delete require.cache[file]
  require(file)
})

////////////

