//Imports Mongoose JavaScript library for using NoSQL MongoDB.
//Install it first with npm.
const mongoose = require('mongoose')
//Creates a mongoose Schema object
const Schema = mongoose.Schema

//Create new Schema called ContactModel
const ContactModel = new Schema({
    Contact_Email: {type:String},
    Contact_Message: {type:String},
})

//When creating a collection, MongoDB will always make the model name lowercase and add and pluralizes it.

//.model() -> 
// first argument: model name (Reference within the code when querying data, you'd typically refer to the model name), 
// second argument: the schema structure, 
// third argument: sets the collection name.
module.exports = mongoose.model('contactus', ContactModel, 'edureka_contacts')