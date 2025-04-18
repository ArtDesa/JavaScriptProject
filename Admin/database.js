//Imports Mongoose JavaScript library for using NoSQL MongoDB.
//Install it first with npm.
const mongoose = require('mongoose');

// mongpdb atlas database name : db_media
const mongodb_url = "mongodb://127.0.0.1:27017/edureka_name"
/* 127.0.0.1 -> local MongoDB server 
   27017 -> default MongoDB port 
   edureka_name -> database name */

//Initiates connection to MongoDB
mongoose.connect( mongodb_url, {
    //{ useNewUrlParser: true } -> option that ensures the new MongoDB connection string parser is used (improving URL handling).
    useNewUrlParser: true, 
    useUnifiedTopology: true 
    }).then(()=>{
        console.log("Connected to Database")
    }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
})
/* .connect().then(() => {}).catch( (err) => {})
   .then() and .catch() success and error handlers for connecting to the MongoDB database */

/* 
mongod -> start MongoDB server 
mongod by default tries to find the /data folder at C:\data\db. 
To use the mongod.config file to specify where to find the data folder, run the command: mongod --config "C:\Program Files\MongoDB\Server\8.0\mongod.cfg"
Instead of running that long command every single time, I've created a .bat (batch) file in the \bin directory with the above command:
echo mongod --config "C:\Program Files\MongoDB\Server\8.0\mongod.cfg" > "C:\Program Files\MongoDB\Server\8.0\bin\mongod.bat"
With the Path "C:\Program Files\MongoDB\Server\8.0\bin in Environment Variables, 
Now when I run mongod in terminal it will prioritize mongod.bat over mongod.exe and run the long command with --config as shown above. 

Check if MongoDB is running:
tasklist | findstr mongod


mongosh -> start MongoDB Shell in a new terminal to run the commands below:
(for Command Prompt, use .\mongosh.exe for Powershell)

Commands in MongoDB Shell: 
show dbs ->  # List databases
use myDatabase ->  # Switch to a database (creates it if it doesn't exist)
db.createCollection("users") ->  # Create a collection
db.users.insertOne({ name: "Alice", age: 25 }) ->  # Insert a document
db.users.find() ->  # Retrieve data
use admin -> switches to admin database. You can create a 
db.createUser({
  user: "",
  pwd: "",
  roles: [{ role: "", db: "" }]
})


To stop MongoDB server: 
If MongoDB server is running use this commadn to safely stop in from MongoDB Shell:
db.getSiblingDB('admin').shutdownServer()

This is you are doing it from inside Command Prompt or Powershell
mongo --eval "db.getSiblingDB('admin').shutdownServer()"

GUI -> MongoDB Compass



*/