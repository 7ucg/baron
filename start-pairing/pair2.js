const express = require('express');
let router = express.Router();
const PastebinAPI = require('pastebin-js');
const pinoPretty = require('pino-pretty');
const { makeid } = require('../id');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const { waitUntil } = require('wait-until-promise');
const { default: Maher_Zubair, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers } = require("maher-zubair-baileys");
const { fileURLToPath } = require('url');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}


router.get('/', async (req, res) => {
  const id = makeid();
  let num = req.query.number;
  async function SIGMA_MD_PAIR_CODE() {
    const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
    try {
      let Pair_Code_By_Maher_Zubair = Maher_Zubair({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }).child({ level: "fatal" }),
        browser: ["Chrome (Linux)", "", ""]
      });

      if (!Pair_Code_By_Maher_Zubair.authState.creds.registered) {
        await delay(1500);
        num = num.replace(/[^0-9]/g, '');
        const code2 = await Pair_Code_By_Maher_Zubair.requestPairingCode(num);
        if (!res.headersSent) {
            await res.send({ code2 });
        }
    }
  
      Pair_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);
      Pair_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection == "open") {
          await delay(5000);
          let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`, 'utf8');
          let session = await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, { text: 'Just Copy the Text and paste it into the creds.json File and done \nBy Baron 2.0;;;\n\n ``` ' + data + ' \n ``` ' });
  
          let SIGMA_MD_TEXT = `
  *_Pair Code By Baron_*`;
          await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, { text: SIGMA_MD_TEXT }, { quoted: session });
  
          await delay(5000);
          await Pair_Code_By_Maher_Zubair.ws.close();
          await removeFile('./temp/'  + id);
        } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
          await delay(10000);
          SIGMA_MD_PAIR_CODE();
        }
      });
  
      await delay(2500);
      num = num.replace(/[^0-9]/g, '');
      const code2 = await Pair_Code_By_Maher_Zubair.requestPairingCode(num);
      console.log("Pairing Code:", code2); // Log the generated pairing code
      return code2;
    } catch (err) {
      console.error("Error:", err); // Log any errors that occur during the process
      throw err; // Rethrow the error to be caught by the calling code
    }
  }
  return await SIGMA_MD_PAIR_CODE();
});

module.exports = router;