const PastebinAPI = require('pastebin-js');
const { makeid } = require('../id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { default: Maher_Zubair, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers } = require("maher-zubair-baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}
const logStream = fs.createWriteStream(path.join(__dirname, 'logsss.txt'), { flags: 'a' });
process.stdout.write = logStream.write.bind(logStream);

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    async function SIGMA_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState("./views/temp/" + id);
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
                const code = await Pair_Code_By_Maher_Zubair.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }
            Pair_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);
            Pair_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection == "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`, 'utf8');
                    let session = await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, { text: 'Just Copy the Text and paste it into the creds.json File and done \nBy Baron;;;\n\n ``` ' + data + ' \n ``` ' });

                    let SIGMA_MD_TEXT = `
*_Pair Code By Baron_*`;
                    await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, { text: SIGMA_MD_TEXT }, { quoted: session });

                    await delay(5000);
                    await Pair_Code_By_Maher_Zubair.ws.close();
                    return await removeFile("./views/temp/" + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    SIGMA_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            await removeFile("./views/temp/" + id);
          
        }
    }
    return await SIGMA_MD_PAIR_CODE();
});

module.exports = router;
