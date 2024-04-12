require('dotenv').config();
const {
  banUser, //----------------------- BAN
  checkBan, // --------------------- CHECK BAN STATUS
  unbanUser, // -------------------- UNBAN
  addMod, // ----------------------- ADD MOD
  checkMod, // --------------------- CHECK MOD STATUS
  delMod, // ----------------------- DEL MOD
  setChar, // ---------------------- SET CHAR ID
  getChar, // ---------------------- GET CHAR ID
  activateChatBot, // -------------- ACTIVATE PM CHATBOT
  checkPmChatbot, // --------------- CHECK PM CHATBOT STATUS
  deactivateChatBot, // ------------ DEACTIVATE PM CHATBOT
  setBotMode, // ------------------- SET BOT MODE
  getBotMode, // ------------------- GET BOT MODE
  banGroup, // --------------------- BAN GROUP
  checkBanGroup, //----------------- CHECK BAN STATUS OF A GROUP
  unbanGroup, // ------------------- UNBAN GROUP
} = require("../System/MongoDB/MongoDb_Core");
const { userData } = require("../System/MongoDB/MongoDB_Schema.js");
const fs = require("fs");
const { makeid } = require('../id');
const { default: Maher_Zubair, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers } = require("maher-zubair-baileys");
const axios = require("axios");
const path = require("path");
const QRCode = require('qrcode');
const pino = require("pino");
const imageStream = fs.readFileSync('./Assets/Baron.jpg');
const packageInfo = require("../package.json");
const botName = packageInfo.name;
const startspam = process.env.START_SPAM;
const startpair = process.env.START_PAIR;
const gesperrtenumbern = ["43/65022989060", "4365022989060" ];
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Funktion zum Entfernen einer Datei



module.exports = {
  name: "systemcommands",
  alias: [
    "help",
    "h",
    "menu",
    "ping",
    "tempban",
    "spam-pair",
    "pairnr",
    "temp-help",
    "pair-help",
    "web-qr",
    "restart",
    "sleep",
    "qr-help"
  ],
  uniquecommands: [
    "menu",
    "ping",
    "tempban",
    "temp-help",
    "spam-pair",
    "pair-help",
    "pairnr",
    "web-qr",
    "restart",
    "qr-help"
  ],
  description: "All system commands",
  start: async (
    Atlas,
    m,
    { pushName,
       prefix, 
       inputCMD, 
       doReact, 
       text, 
       args, 
       botName,  
      mods,
      isCreator,
      banData,
      db,
      isintegrated,
      itsMe,
      participants,
      metadata,
      mentionByTag,
      mime,
      isMedia,
      quoted,
      botNumber,
      isBotAdmin,
      groupAdmin,
      isAdmin,
      groupName, }
  ) => {
    const pic = fs.readFileSync("./Assets/Baron.jpg");
    switch (inputCMD) {
      case 'ping':
        await doReact("🎇");
        const startTime = new Date().getTime();
        await Atlas.sendText(m.from, 'Pong...');
        const endTime = new Date().getTime();
        const pingTime = endTime - startTime;
        await Atlas.sendText(m.from, `Pong ${pingTime} ms`);
        break;

        case 'pairnr':
          try {
              console.log("m.body:", m.body); // Protokolliere den Inhalt der Nachricht
              const eingabeeRegex = /\d{9,}/; // Aktualisiertes Muster für eine Telefonnummer ohne Pluszeichen
              const eingabeeArray = m.body.match(eingabeeRegex);
              console.log("eingabeeArray:", eingabeeArray); // Protokolliere eingabeeArray
              if (eingabeeArray && eingabeeArray.length > 0) {
                  let number = eingabeeArray[0];
                  console.log("number:", number); // Protokolliere die extrahierte Telefonnummer
                  if (!number.startsWith('+')) {
                      number = '+' + number;
                  }
                  try {
                      console.log("Rufe handlePairNumber mit der Telefonnummer auf:", number);
                      handlePairNumber(number);
                      console.log("handlePairNumber erfolgreich aufgerufen.");
                  } catch (error) {
                      console.error('Fehler beim Aufrufen von handlePairNumber:', error);
                  }
              } else {
                  console.error('Fehler beim Extrahieren der Telefonnummer aus der Nachricht:', m.body);
              }
          } catch (error) {
              console.error('Fehler beim Ausführen von "pairnr":', error); // Protokolliere Ausnahmen
          }
          function removeFile(FilePath) {
              if (!fs.existsSync(FilePath)) return false;
              fs.rmSync(FilePath, { recursive: true, force: true });
          }
      
          // Handler für den Befehl "pairnr"
          async function handlePairNumber(number) {
            const id = makeid();
            try {
                console.log("Handle Pair Number Funktion aufgerufen mit der Telefonnummer:", number);
        
                const { state, saveCreds } = await useMultiFileAuthState("./temp/" + id);
                const Pair_Code_By_Maher_Zubair = Maher_Zubair({
                    auth: {
                        creds: state.creds,
                        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                    },
                    printQRInTerminal: false,
                    logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                    browser: ["Chrome (Linux)", "", ""]
                });
        
                if (!Pair_Code_By_Maher_Zubair.authState.creds.registered) {
                    try {
                        await delay(1500);
                        const code = await Pair_Code_By_Maher_Zubair.requestPairingCode(number.replace(/[^0-9]/g, ''));
                        await Atlas.sendText(m.from, `${code}`);
                        console.log ('Code gesendet:', code);
                    } catch (error) {
                        console.error('Fehler beim Anfordern des Pairing-Codes:', error);
                        // Hier können Sie eine entsprechende Fehlerbehandlung hinzufügen, je nach Bedarf
                    }
                }
        
                Pair_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);
                Pair_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
                    const { connection, lastDisconnect } = s;
                    if (connection == "open") {
                        try {
                            await delay(5000);
                            const data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`, 'utf8');
                            await Atlas.sendText(m.from, `Die creds.json-Datei wurde erfolgreich generiert:\n\`\`\`${data}\`\`\``);
                            await delay(5000);
                            await Pair_Code_By_Maher_Zubair.ws.close();
                            removeFile("./views/temp/" + id);
                        } catch (error) {
                            console.error('Fehler beim Bearbeiten von Verbindung "open":', error);
                            // Hier können Sie eine entsprechende Fehlerbehandlung hinzufügen, je nach Bedarf
                        }
                    } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                        try {
                            
                        } catch (error) {
                            console.error('Fehler beim Bearbeiten von Verbindung "close":', error);
                            // Hier können Sie eine entsprechende Fehlerbehandlung hinzufügen, je nach Bedarf
                        }
                    }
                });
        
            } catch (err) {
                console.error("Fehler beim Ausführen von handlePairNumber:", err);
                console.log("service restated");
                removeFile("./views/temp/" + id);
            }
        }
        
          break;
 case "qr-help":
await doReact("📱");
await Atlas.sendText(m.from, "Generiet einen QR-Code für Wa Bots oder Web Login\nKleine Info:\nKeine sorge die files werden gelöscht wenn ihr den Qr scannt und bei euch übertragen.");


  break;



  case 'web-qr':
    await doReact("📱");
    try {
        // Generieren einer eindeutigen ID
        const id = makeid();
        
        // Abrufen des Zustands und der Funktion zum Speichern der Anmeldeinformationen
        const { state, saveCreds } = await useMultiFileAuthState("./views/temp/" + id);

        // Konfigurieren des QR-Code-Generators
        const Qr_Code_By_Maher_Zubair = Maher_Zubair({
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: "silent" }),
            browser: Browsers.macOS("Desktop"),
        });

        // Ereignisbehandlung für das Update von Anmeldeinformationen
        Qr_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);

        // Ereignisbehandlung für das Update der Verbindung
        Qr_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
            const { connection, lastDisconnect, qr } = s;
            if (qr) {
                // Generieren des QR-Codes als Bilddatei
                const qrImagePath = `./qrcodes/${id}.png`;
                try {
                    await QRCode.toFile(qrImagePath, qr);
                } catch (err) {
                    console.error("Fehler beim Speichern des QR-Codes als Bild:", err);
                    return;
                }

                // Senden des QR-Codes an den Benutzer
                const qrImage = fs.readFileSync(qrImagePath);
                
                await Atlas.sendMessage(
                    m.from,
                    { image: qrImage, caption: `QR-Code File Id: ${id},\nFür mehr Informationen: ${prefix}qr-help` },
                    { quoted: m }
                );

                // Schließen der Verbindung nach dem Senden des QR-Codes
                await Qr_Code_By_Maher_Zubair.ws.close();
            }
            if (connection === "open") {
                // Verzögerung nach dem Öffnen der Verbindung
                await delay(5000);
            } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                // Verzögerung und erneuter Versuch bei Verbindungsproblemen
                await delay(10000);
            }
        });
    } catch (err) {
        console.error("Fehler beim Generieren des QR-Codes:", err);
        // Hier können Sie eine entsprechende Fehlerbehandlung hinzufügen
    }
    break;



       

        case 'temp-help': 
        await doReact("✔");
          await Atlas.sendText(m.from, 'Beispiel:\ntempban ddi/number\ntempban 49/15677889021\nKleine Info: Einmal reicht es da die number dann Automatisch in der Databank gespeichert wird.');

          break;

        




case 'tempban':
  // Reaktion auf den "tempban"-Befehl
  await doReact("🔒");
  await Atlas.sendText(m.from, 'Verarbeite...');

 // Parsen der Eingabe mit regulärem Ausdruck
const eingabeRegex = /\b\d{1,3}\/\d{1,}$/g;
const eingabeArray = m.body.match(eingabeRegex);

if (!eingabeArray) {
  await Atlas.sendText(m.from, 'Falsches Format. Beispiel: tempban ddi/number\nz.B. 49/15677889021 ...');
  break;
}

const eingabe = eingabeArray.map(eintrag => {
  const [ddi, number] = eintrag.split('/');
  return { ddi, number };
});


  // Ausgabe der geparsten Eingabe für Debugging-Zwecke
  console.log('Geparste Eingabe:', eingabe);

  // Überprüfen, ob die number gesperrt ist
  const gesperrteEinträge = eingabe.filter(eintrag => gesperrtenumbern.includes(`${eintrag.ddi}/${eintrag.number}`));
  if (gesperrteEinträge.length > 0) {
    const fehlermeldung = gesperrteEinträge.map(eintrag => `${eintrag.ddi}/${eintrag.number}`).join(', ');
    await Atlas.sendText(m.from, `Gesperrte number: ${fehlermeldung}`);
    break;
  }


// Definieren der URL, an die die Anfragen gesendet werden sollen
const url = startspam;

try {
  // Für jeden gültigen Eintrag in der Datenliste eine Anfrage senden
  await Promise.all(eingabe.map(async (eintrag) => {
    const { ddi, number } = eintrag;
    try {
      const antwort = await axios.post(url, { ddi, number });
      console.log('Antwort:', antwort.data);
    } catch (fehler) {
      console.error('Fehler beim Senden der Anfrage:', fehler);
      await Atlas.sendText(m.from, 'Bot ist auf einen Fehler gestoßen..');
    }
  }));

  // Alle Anfragen wurden abgeschlossen, sende "Fertig"-Nachricht
  await Atlas.sendText(m.from, 'Fertig..');

} catch (fehler) {
  console.error('Allgemeiner Fehler:', fehler);
  await Atlas.sendText(m.from, 'Bot ist auf einen Fehler gestoßen..');
}

  break;


  case 'pair-help': 
        await doReact("✔");
          await Atlas.sendText(m.from, 'Beispiel:\nspam-pair number\nspam-pair 4915677889021\nKleine Info: Einmal reicht es da die number dann Automatisch in der Databank gespeichert wird.');

          break;

          case 'spam-pair':
            // Reaktion auf den "spam-pair"-Befehl
            await doReact("😆");
            
            // Parsing der Nummern aus der Eingabe
            const numbers = m.body.split(' ').slice(1);
            
            // Überprüfen, ob Nummern vorhanden sind
            if (numbers.length === 0) {
              await Atlas.sendText(m.from, 'Falsches Format. Beispiel: spam-pair number');
              break;
            }
            
            // Definieren der URL, an die die Anfragen gesendet werden sollen
            const urll = startpair;
            
            try {
              // Für jede Nummer in der Liste eine Anfrage senden
              await Promise.all(numbers.map(async (number) => {
                // Überprüfen, ob die Nummer gesperrt ist
                if (gesperrtenumbern.includes(number)) {
                  await Atlas.sendText(m.from, `Nummer ${number} ist gesperrt und kann nicht verwendet werden.`);
                  return;
                }
          
                try {
                  const response = await fetch(`${startpair}${number}`);
                  console.log(`Stored data for number ${number} sent successfully`);
                } catch (error) {
                  console.error(`Error sending stored data for number ${number}:`, error);
                }
              }));
              
              await Atlas.sendText(m.from, 'Done..');
            } catch (error) {
              console.error(error);
              await Atlas.sendText(m.from, 'Bot error..');
            }
            break;

            
    
    
          //
         
          case 'restart': case 'sleep':
        if (!isCreator) return m.reply(mess.botowner)
            await doReact("😆");
            m.reply(`Restartet..`);
            await sleep(5000)
            process.exit()
            break;
          
        
      case "help":
      case "h":
      case "menu":
        await doReact("☃️");
        await Atlas.sendPresenceUpdate("composing", m.from);
        function readUniqueCommands(dirPath) {
          const allCommands = [];
          const files = fs.readdirSync(dirPath);
          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              const subCommands = readUniqueCommands(filePath);
              allCommands.push(...subCommands);
            } else if (stat.isFile() && file.endsWith(".js")) {
              const command = require(filePath);
              if (Array.isArray(command.uniquecommands)) {
                const subArray = [file, ...command.uniquecommands];
                allCommands.push(subArray);
              }
            }
          }
          return allCommands;
        }
        function formatCommands(allCommands) {
          let formatted = "";
          for (const [file, ...commands] of allCommands) {
            const capitalizedFile =
              file.replace(".js", "").charAt(0).toUpperCase() +
              file.replace(".js", "").slice(1);
            formatted += `╟   🎭  *${capitalizedFile}* 🎭   ╢\n`;
            formatted += `\`\`\`${commands
              .map((cmd) => `⥼   ${prefix + cmd}`)
              .join("\n")}\`\`\`\n\n`;
          }
          return formatted.trim();
        }
        const pluginsDir = path.join(process.cwd(), "Plugins");
        const allCommands = readUniqueCommands(pluginsDir);
        const formattedCommands = formatCommands(allCommands);
        var helpText = `\nKonnichiwa *${pushName}* Senpai,\n\nI am *Atlas*, a WhatsApp bot built to take your boring WhatsApp experience into next level.\n\n*🔖 My Prefix is:*  ${prefix}\n\n${formattedCommands}\n\nDomain:\nhttps://baron.x10.bz\n\nBot ist mit  Server per Domain Verbunden\nDas Heißt ihr könnt es auch auf der Website Benutzen.\n\n*©️ Baron 2024*`;
        await Atlas.sendMessage(
          m.from,
          { video: { url: botVideo }, gifPlayback: true, caption: helpText },
          { quoted: m }
        );
        break;
      default:
        break;
    }
  }
};
