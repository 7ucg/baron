
const mongoose = require("mongoose");


// MongoDB Schema
const SpamDataSchema = new mongoose.Schema({
    ddi: String,
    number: String,
    timestamp: { type: Date, default: Date.now }
});

const SpamData = mongoose.model('SpamData', SpamDataSchema);



const PairDataSchema = new mongoose.Schema({
    
    number: String,
    timestamp: { type: Date, default: Date.now }
});

const PairData = mongoose.model('PairData', PairDataSchema);


module.exports = { SpamData, PairData };