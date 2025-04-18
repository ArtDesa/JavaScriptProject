//Get the app from the itself
const App = require('./app')

let app = App.app;
//Import the Express framework (Node.js framework)
const express = require('express')

const port = 7100;


//Imports Body-Parser middleware. Used in Express.js to handle/parse incoming bodies of HTTP requests.
const bodyParser =  require('body-parser')
/*.use() function is used to apply middleware to the application. 
Code that runs between a request and a response, helping with things like processing data, authentication, logging, and error handling. */
//Configure Body-Parser to parse data from URL-encoded form submissions. Extended option enables nested objects to be parsed.
app.use(bodyParser.urlencoded({extended:true}))
//Allows app to parse JSON request bodies, converting them into JavaScript objects. Allows Express to understand incoming JSON data from APIs.
app.use(bodyParser.json())


//Imports the express-session middleware. Used in Express.js to manage sessions for users.
const session = require('express-session')
//Sets up session management in Express.js.
app.use(session({
  //Secret key used to sign the session ID.
  secret: 'edurekaSecret',
  //Prevents the session from being saved on every request, unless it’s modified.
  resave: false,
  //Creates a session for every user, even if they haven’t modified it. (tracking new visitors b4 interaction with app)
  saveUninitialized: true
}));

//Configure Express.js settigns for managing static files and template rendering.
/* express.static() - serves files without requiring an entire route.
__dirname + '/public' - static files can be found in the public folder in root directory. */
app.use(express.static(__dirname + '/public'))
//.set() function used for configuring settings and properties for the app.  
/* In Express.js, view engine is a templating system that allows you to generate dynamic HTML content using JavaScript. 
This sets the view engine in Express.js to use EJS for rendering views. */
app.set('view engine', 'ejs')
/* Sets where Express.js should look for views (ejs files), in the Views folder. */
app.set('views', './Views')

//Refers to News_Model from app.js
const Newslist =  app.newslist;
//Refers to User_Model from app.js
const Contactuslist = app.user;


//Varaible to hold session objects in route handlers below
let sess;


// Handles GET request for root directory.
/* Sets up a route handler for the root URL */
app.get('/',(req,res) => {
  //Current session object  
  sess=req.session;
  //Sets email to blank
  sess.email=" ";
  
  //Tells Express.js app to render signin.js
  res.render('signin',
    //Second argument {} passes data (in this case values of invalid and msg) to signin.ejs for it to use
    //Searches for query parameter named invalid in the request URL. 
    { invalid: req.query.invalid ? req.query.invalid:'',
      //Searches for query parameter named msg in the request URL.
      msg: req.query.msg ? req.query.msg:''})
    
})

// Handles POST requests sent from client to /api/addContactUs. 
// Receives form data from contact_us.ejs and sends it to the api to the database. 
app.post('/api/addContactUs', (req,res)=>{
  //Prints the req.body to the console so we can see it.
  console.log("/api/addContactUs : req.body : ", req.body)
  //req.body - contains the form data.
  const record = req.body
  
  //Attempst to insert the form data into the mongoose schema defined in User_Model.js
  Contactuslist.create(
              //First argument -> data to be inserted into MongoDB.
              record, 
              //Second optional argument -> Callback function to handle success or failure.
              (err, data) => {
                //err -> Holds an error object if the database operation fails.
                //data -> Contains the newly inserted document if successful.
                //If error, return code 500 response with message
                if(err) return res.status(500).send('There was a problem registering user')
                //If no error, print to console message with data and return code 200 response with message
                console.log(`Inserted ... ${data} `)
                return res.status(200).send("Inserted")
            }) 
})


// Handles GET requests sent from client to /api/getLatestNews. 
app.get('/api/getLatestNews', (req,res) => {
  //Queries the Newslist collection of data in MongoDB database.
  //.find({}) -> retrieves all documents. .limit(3) -> limits the results to the latest 3 news items
  //.sort( {News_insertTime: -1} ) -> sorts results in descending order, latest first.
  //.exec() -> execute the Mongoose database query. If optional argument is provided, it is expected to be a callback funtion.
  Newslist.find({}).limit(3).sort( {News_insertTime: -1} ).exec((err,data)=>{
    //If error occures, return code 500 status and send err. Else, 
    if (err) res.status(500).send(err)
    else res.json(data)
    //else res.json(data) -> return data as JSON instead of HTML
  })

})

//Starts the Express.js server and has it listen to requests on port 7100.
const server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});