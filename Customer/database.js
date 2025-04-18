
const mongoose = require('mongoose');
//database name and connection number 

//Does this need to be changed to "edureka_data"?
//News_Model.js refers to the "edureka_data" collection
//Contact_Model.js refers to the "edureka_contacts" collection
const mongodb_url = "mongodb://127.0.0.1:27017/edureka_name"

mongoose.connect( mongodb_url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(()=>{
    console.log("Connecting to the database for edureka_data")
}).catch((err) => {
    console.log("Not connected to the database ", err);
})