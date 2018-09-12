const express = require('express')
const app = express()
const morgan = require('morgan'); //morgan library for response log
const bodyParser=require('body-parser'); //body-parser library for parse response body
const port= 3000; 
const mongoose = require('mongoose');

var mongodbUri = 'mongodb://localhost/user_db_task_1';
mongoose.connect(mongodbUri,{useNewUrlParser:true});
let conn = mongoose.connection; //create mongoose connnection stream

conn.on('disconnected', ()=>{
	console.log('MongoDB disconnected!');
	setTimeout(()=>{
		mongoose.connect(mongodbUri); //restart mongoconnection after 3 seconds 
	}, 3000);
});
conn.on('error', (error)=>{
	console.error('Error in MongoDb connection: ' + error);
	mongoose.disconnect();
});
conn.on('connected', ()=>{
	console.log('connected with mongodb');
});

app.use(morgan('dev')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
require("./server/route.js")(app);
app.listen(port);
console.log('App is listening on port: ' + port);