const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const NewsModel = new Schema({
    News_title: {type:String},
    News_description: {type:String},
    News_url: {type:String},
    News_urlToImage: {type:String},
    News_publishedAt: {type:Date},
    News_insertTime: {type:Date}
})


//When creating a collection, MongoDB will always make the model name lowercase and add and pluralizes it.

//.model() -> 
// first argument: model name (Reference within the code when querying data, you'd typically refer to the model name), 
// second argument: the schema structure, 
// third argument: sets the collection name.
module.exports = mongoose.model("News", NewsModel,"edureka_data")