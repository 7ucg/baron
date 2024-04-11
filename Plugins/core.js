require('dotenv').config();
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const imageStream = fs.readFileSync('./Assets/Baron.jpg');
const packageInfo = require("../package.json");
const botName = packageInfo.name;
const startspam = process.env.START_SPAM;
const startpair = process.env.START_PAIR;
const bannedNumbers = ["43/65022989060", "4365022989060" ];

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
    "pair-help"
  ],
  uniquecommands: [
    "help",
    "h",
    "menu",
    "ping",
    "tempban",
    "temp-help",
    "spam-pair",
    "pair-help",
    "pairnr"
  ],
  description: "All system commands",
  start: async (
    Atlas,
    m,
    { pushName, prefix, inputCMD, doReact, text, args }
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

        case 'temp-help': 
        await doReact("✔");
          await Atlas.sendText(m.from, 'Beispiel:\ntempban ddi/number\ntempban 49/15677889021\nKleine Info: Einmal reicht es da die Nummer dann Automatisch in der Databank gespeichert wird.');

          break;

        // List of banned numbers



        case 'tempban':
  // Reaktion auf den "tempban"-Befehl
  await doReact("🔒");
  await Atlas.sendText(m.from, 'Verarbeite...');

  // Parsen der DDI und Nummer aus der Eingabe
  const daten = m.body.split(' ').slice(1).map(eintrag => {
    const [ddi, nummer] = eintrag.split('/');
    return { ddi, nummer };
  });

  // Überprüfen, ob sowohl DDI als auch Nummer vorhanden sind und nicht gesperrt sind
  const ungültigeEinträge = daten.filter(eintrag => !eintrag.ddi || !eintrag.nummer || gesperrteNummern.includes(eintrag.ddi + '/' + eintrag.nummer));
  if (ungültigeEinträge.length > 0) {
    const fehlermeldung = ungültigeEinträge.map(eintrag => `${eintrag.ddi}/${eintrag.nummer}`).join(', ');
    await Atlas.sendText(m.from, `Falsches Format oder gesperrte Nummer: ${fehlermeldung}. Beispiel: tempban ddi/nummer\nz. B. 49/15677889021 ...`);
    break;
  }

  // Definieren der URL, an die die Anfragen gesendet werden sollen
  const url = startspam;

  try {
    // Für jeden gültigen Eintrag in der Datenliste eine Anfrage senden
    await Promise.all(daten.map(async (eintrag) => {
      const { ddi, nummer } = eintrag;
      const antwort = await axios.post(url, { ddi, nummer });
      if (antwort.data.erfolg) {
        await Atlas.sendText(m.from, 'Fertig..');
      }
    }));
    
  } catch (fehler) {
    console.error(fehler);
    await Atlas.sendText(m.from, 'Bot ist auf einen Fehler gestoßen..');
  }
  break;

  case 'pair-help': 
        await doReact("✔");
          await Atlas.sendText(m.from, 'Beispiel:\nspam-pair number\nspam-pair 4915677889021\nKleine Info: Einmal reicht es da die Nummer dann Automatisch in der Databank gespeichert wird.');

          break;

  case 'spam-pair':
    // Reaktion auf den "spam-pair"-Befehl
    await doReact("😆");
    
    // Parsing der Nummer aus der Eingabe
    const numbers = m.body.split(' ').slice(1);
  
    // Überprüfen, ob Nummern vorhanden sind
    if (numbers.length === 0) {
      await Atlas.sendText(m.from, 'Falsches Format. Beispiel: spam-pair number');
      break;
    }
  
    // Definiere die URL, an die die Anfragen gesendet werden sollen
    const urll = startpair;
  
    try {
      // Für jede Nummer in der Liste eine Anfrage senden
    await Promise.all(numbers.map(async (number) => {
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
      await Atlas.sendText(m.from, 'Bot  error..');
    }
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
            formatted += `╟   🎭  *${capitalizedFile}* 🎭   ╢\n\n`;
            formatted += `\`\`\`${commands
              .map((cmd) => `⥼   ${prefix + cmd}`)
              .join("\n")}\`\`\`\n\n\n`;
          }
          return formatted.trim();
        }
        const pluginsDir = path.join(process.cwd(), "Plugins");
        const allCommands = readUniqueCommands(pluginsDir);
        const formattedCommands = formatCommands(allCommands);
        var helpText = `\nKonnichiwa *${pushName}* Senpai,\n\nI am *${botName}*, a WhatsApp bot built to take your boring WhatsApp experience into next level.\n\n*🔖 My Prefix is:*  ${prefix}\n\n${formattedCommands}\n\n\n*©️ Baron- 2024*`;
        await Atlas.sendMessage(
          m.from,
          { image: imageStream, caption: helpText },
          { quoted: m }
        );
        break;
      default:
        break;
    }
  }
};
