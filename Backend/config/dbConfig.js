const mongoose = require('mongoose');

//Connection Logic

mongoose.connect(process.env.CONN_STRING);

//Connection State
const db = mongoose.connection;

//Check DB Connection
db.on('connected',()=>{
    console.log("Succesfully Connected");
})

db.on('err', ()=>{
    console.log('Connection Failed');
})

module.exports = db;