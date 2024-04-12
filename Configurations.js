require("dotenv").config();
const fs = require("fs");
const chalk = require("chalk")

let gg = process.env.MODS;
if (!gg) {
  gg = "436502298060";   // You can replace this number with yours //
}


global.owner = gg.split(",");
global.mongodb = process.env.MONGODB || "mongodb+srv://baron:baron2006@lionbot.ymq2zpo.mongodb.net/?retryWrites=true&w=majority&appName=LionBot";
global.sessionId = process.env.SESSION_ID || "baron";
global.prefa = process.env.PREFIX || "#";
global.tenorApiKey = process.env.TENOR_API_KEY || "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c";
global.packname = process.env.PACKNAME || `Baron`;
global.author = process.env.AUTHOR || "by: Baron";
global.port2 = process.env.PORT2 || "10000";
global.openAiAPI = process.env.OPENAI_API || "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";
global.owner = gg.split(",");



//
global.Owner = ["4365022989060"];   
global.owner = ["4365022989060"];        
global.OwnerNumber = [ "4365022989060"];   
global.ownertag = [ "4365022989060"];
global.OwnerName = "Baron";
global.botName = "Atlas";
global.packname = "By Tool Bot";                             //Do not change.
global.author = "Baron";                               //Do not change.


//
global.location = "Deutschland, Unknown";
global.reactmoji = "💞";
global.themeemoji = "😂";
global.websites = "https://baron.x10.bz";
global.lolhuman = "Tool-BOT";


//
global.BotLogo = fs.readFileSync("./Assets/pic.jpg");
global.Thumb = fs.readFileSync("./Assets/pic.jpg");
global.Thumb1 = fs.readFileSync("./Assets/pic.jpg");
global.ErrorPic = fs.readFileSync("./Assets/pic.jpg");

//
global.mess = {
  jobdone: '*Tadaaa✨!*',
  useradmin: '*Dieser Befehl kann nur von einem Admin verwendet werden.* !',
  botadmin: 'Sorry, i cant execute this command without being an *Admin* of this group.',
  botowner: 'Nur meine *Owner* können diesen Befehl benutzen!',
  privateonly: 'Dieser Befehl ist nur für *Private Chats* Verfügbar!',
  botonly: 'Only the *Bot itself* can use this command!',
  waiting: '* ich arbeite daran...*',
  error: 'Error!',
  banned: 'You are *Banned* fron using commands!',
  bangc: 'This Group is *Banned* from using Commands!',
  
}


global.keysZens = ['c2459db922', '37CC845916', '6fb0eff124']
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63']
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]
global.lolkeysapi = ['GataDios']


global.APIs = {
  zenz: "https://zenzapis.xyz",
  xteam: 'https://api.xteam.xyz', 
  dzx: 'https://api.dhamzxploit.my.id',
  lol: 'https://api.lolhuman.xyz',
  violetics: 'https://violetics.pw',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://zenzapis.xyz',
  akuari: 'https://api.akuari.my.id',
  akuari2: 'https://apimu.my.id',
  nrtm: 'https://fg-nrtm.ddns.net',
  bg: 'http://bochil.ddns.net',
  fgmods: 'https://api-fgmods.ddns.net'
  
};
global.APIKeys = {
  "https://zenzapis.xyz": "5d1197db351b",
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
  'https://api.neoxr.my.id': `${keysneoxr}`,	
  'https://violetics.pw': 'beta',
  'https://api-fgmods.ddns.net': 'fg-dylux'
};


module.exports = {
  mongodb: global.mongodb,
};
