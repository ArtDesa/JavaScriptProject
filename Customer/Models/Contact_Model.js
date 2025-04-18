const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const ContactUsModel = new Schema(
{
    Contact_email:{type:String},
    Contact_message:{type:String},
})


//When creating a collection, MongoDB will always make the model name lowercase and add and pluralizes it.

//.model() -> 
// first argument: model name (Reference within the code when querying data, you'd typically refer to the model name), 
// second argument: the schema structure, 
// third argument: sets the collection name.
module.exports = mongoose.model("Contactus", ContactUsModel,"edureka_contacts")

