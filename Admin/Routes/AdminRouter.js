//Imports Express.js module
const express = require('express');
//Creates an instance of Express.js Router.
const router = express.Router();

/*Imports LocalStorage class from node-localstorage package from Node.js
It's used to store data locally in a Node.js environment. 
It emulates a browser localStorage but stores data files on the server. */
const LocalStorage = require('node-localstorage').LocalStorage;
//Creates a new instance of LocalStorage, using /Scratch as the directory the data will be stored in. 
const localStorage = new LocalStorage('./Scratch');

//Imports config.js
const config = require('../config');


/* Imports security-related modules using Node.js 
Must be previously installed using npm so they are available from the node_modules folder for use */
/*JWT (JSON Web Token) - used for authentication and secure data exchange. 
Helps create and verify tokens for user sessions, without storing sensitive information on the server. */
const jwt = require('jsonwebtoken');
/* Bcrypt - library for securely hashing passwords. */
const bcrypt = require('bcryptjs');


//Imports Body-Parser middleware. Used in Express.js to handle/parse incoming bodies of HTTP requests.
const bodyParser = require('body-parser');
//Configure Body-Parser to parse data from URL-encoded form submissions. Extended option enables nested objects to be parsed.
router.use(bodyParser.urlencoded({ extended: true }));
//Allows app to parse JSON request bodies, converting them into JavaScript objects. Allows Express to understand incoming JSON data from APIs.
router.use(bodyParser.json());

//Imports User_Model.js
const User = require('../Models/User_Model');
//Imports News_Model.js
const Newslist = require('../Models/News_Model');

//Creates Express.js app
const app = express();

//This sets the view engine in Express.js to use EJS for rendering views.
app.set('view engine', 'ejs');
//Sets where Express.js should look for views (ejs files), in the Views folder.
app.set('views', './Views');

/* express.static() - serves files without requiring an entire route.
__dirname + '/public' - static files can be found in the public folder in root directory. */
app.use(express.static(__dirname+'/public'));

/*Imports the express-session module. Used for session management in Express.js 
express-session is middleware that allows session data to be stored across multiple requests. 
This helps with: user authentication/keeping users logged in, storing items across pages, temporary user preferences  */
const session = require('express-session');

/* Configures express-session middleware. 
router.use(session()) -> Applies session handling to all routes that use router 
session({secret: 'edurekaSecret1', resave: false, saveUninitialized: true}) 
secret: 'edurekaSecret1' -> secret key used to sign session cookies. Protects session data from tampering. 
resave: false -> Prevents the session from being saved on every request, unless it changes. 
saveUninitialized: true -> Allows sessions to be saved even if they are empty. Useful for tracking unauthenticated users. */
router.use(session({secret: 'edurekaSecret1', resave: false, saveUninitialized: true}));
/* After applied, you can store session data in requests like:
   router.get('/dashboard', (req, res) => {
    req.session.username = "JohnDoe"; // Saves username in session
    res.send(`Welcome, ${req.session.username}`);
   });
If a user visits /dashboard, their session retains "JohnDoe" across multiple requests. 
If an attacker attempts to modify the session cookie without knowing the secret key, the app will reject it. */

/* Handles POST requests from server. (providing new data, such as login details, form submissions, or file uploads, etc) 
Handles POST requests to /login (signin.ejs) */
router.post('/login', (req, res) => {
    //Searches the MongoDB database Schema (User_Model.js) for a user stored with an email (User_Email) that matches req.body.User_Email.
    User.findOne({ User_Email: req.body.User_Email }, (err, user) => {
      /*user -> if a user is found in the MongoDB database with a User_Email field that matches the req.body.User_Email, 
      then 'user' represents the user retrieved from the database. */
      console.log("/login : user => ", user)
      //If error in trying to find matching user, return code 500 response with message
      if (err) return res.status(500).send('Error on the server.');
      
      let htmlMsg
      //If User_Email is not found... (aka: null. user = null -> null === falsy -> !null = true)
      if (!user) { 
        //encodeURIComponent() -> ensures special characters in message don’t break the URL.
        htmlMsg = encodeURIComponent('Email not found, try again ...');
        //Express.js app redirects to /?invalid= with the encoded error message
        res.redirect('/?invalid=' + htmlMsg);
      
      //If User_Email IS FOUND -> validate password.
      }else{
        /*bcrypt.compareSync() -> Checks if the hash of the password in MongoDB database (user.User_Password) 
        matches the submitted password (req.body.User_Password) */
        const passwordIsValid = bcrypt.compareSync(req.body.User_Password, user.User_Password);
        //If DO NOT match:
        if (!passwordIsValid) {
          //Return code 401 response. Provide values 'auth'=false and 'token'=null values.  
          return res.status(401).send({ auth: false, token: null });
        }

        //If DO match -> Generate & Store a JWT Token
        /*Create jwt token using users user._id value in the database and the secret from config.js 
        Even though User_Model schema has no _id field, MongoDB automatically assigns a unique _id to every document/user when it is created. */
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours (86400 seconds)
        });
        /*Stores the token in localStorage (/Scratch folder) 
        'authtoken' -> name for token in Scratch folder. token -> the jwt token we created. */
        localStorage.setItem('authtoken', token)

        //User is redirected to /admin/newsForm after successful login.
        res.redirect(`/admin/newsForm`)
      }
    });
});

/* Handles GET requests from /newsForm.ejs. 
   Checks authentication first b4 rendering the page. */
router.get('/newsForm', (req, res)=>{
    //Gets token named 'authtoken' from localStorage (Scratch folder)
    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)

    //If token is missing...
    if (!token) {
        //Redirect user to root page
        res.redirect('/')
    }
    //Checks if the token is valid by comparing the token to the secret key in config.js to see if it matches
    jwt.verify(token, config.secret, (err, decoded)=>{
        //If verification fails, err, (expired or modified token), the user is redirected to root /
        if (err) { res.redirect('/') }
        /*If token matches... 
        ->Checks if the user _id stored in the token upon creation matches any stored _id in MongoDB database */
        /*{ User_Password: 0} -> excludes the password from the returned data by setting it to 0. 
        In Mongoose, setting a field to 0 inside the second argument of a query means "do not include this field in the returned document." */
        User.findById(decoded.id, { User_Password: 0}, (err,user)=>{
            //If error during search process -> redirect to root /
            if (err) {res.redirect('/')}
            //If _id user is not found in the MongoDB database -> redirect to root /
            if (!user) {res.redirect('/')} 
            console.log("/newsForm : user ==> ", user)   
            /*If FOUND -> render the news_form page
            user and msg are passed to news_form as optional arguments to be rendered on the page. */
            res.render('news_form', {
                user,
                //If req.query.msg exists return it, otherwise return ''
                msg: req.query.msg ? req.query.msg:''
            })
        })
    })
})

/* Handles GET requests from /getNews (header.ejs). 
   Checks authentication first b4 rendering the page. */
router.get('/getNews', (req, res)=>{
    //Gets token named 'authtoken' from localStorage (Scratch folder)
    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    
    //If token is missing...
    if (!token) {
        res.redirect('/')
    }
    
    //Checks if the token is valid by comparing the token to the secret key in config.js to see if it matches
    jwt.verify(token, config.secret, (err, decoded)=>{
        //If error during search process -> redirect to root /
        if (err) { res.redirect('/') }
        
        /*If token matches... 
        ->Checks if the user _id stored in the token upon creation matches any stored _id in MongoDB database */
        /*{ User_Password: 0} -> excludes the password from the returned data by setting it to 0. 
        In Mongoose, setting a field to 0 inside the second argument of a query means "do not include this field in the returned document." */
        User.findById(decoded.id, { User_Password: 0}, (err,user)=>{
            //If error during search process -> redirect to root /
            if (err) {res.redirect('/')}
            //If _id user is not found in the MongoDB database -> redirect to root /
            if (!user) {res.redirect('/')} 
            console.log("/newsForm : user ==> ", user)   

            /*If user with _id is FOUND -> obtain all news in News_Model schema database
            find({}, (err,data)=>{}) -> the {} for the first argument indicates to return all found entries in the database */
            Newslist.find({}, (err,data)=>{
                //If error during search and retrieval, return code 500 response and send error
                if(err) res.status(500).send(err)
                else{ //If no error, render the news_table page and provide optional arguments user and data to the rendered page.
                    res.render('news_table', {
                        user,
                        data
                    })
                }        
            })
          
        })
    })
})

//POST (browser/page date -> server) - send data to server from the browser/page. GET (server data -> browser/page) - retrieves data from server requested by the browser/page
router.post('/find_by_id', (req,res)=>{
    const id = req.body.id
    console.log("/find_by_id : id : ", id)
    Newslist.find({_id: id}, (err,data)=>{
        if(err) res.status(500).send(err)
        else{
            console.log("/find_by_id : data : ", data)
            res.send(data)
        }
    })
})

//PUT - update or replace
router.put('/updateNews', (req,res)=>{
    const id = req.body.id
    console.log("/updateNews : id : ", id)
    Newslist.findOneAndUpdate({_id: id},{
        $set:{
            News_title: req.body.News_title,
            News_description: req.body.News_description,
            News_url: req.body.News_url,
            News_urlToImage: req.body.News_urlToImage,
            News_publishedAt: req.body.News_publishedAt,
            News_insertTime: Date.now()
        }
    },{
        upsert: true
    }, (err,result)=>{
        if(err) return res.send(err)
        res.send("Updated ...")
    }) 
})

//DELETE a resource from the server
router.delete('/deleteNews', (req,res)=>{
    const id = req.body.id
    console.log("/deleteNews : id : ", id)
    Newslist.findOneAndDelete({_id: id}, (err,result)=>{
        if(err) return res.status(500).send(err)
        res.send({message: 'deleted ...'})
        console.log(result)
    })
})

router.post('/addNews', (req, res)=>{
    console.log("/addNews : req.body : ", req.body)
    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if (err) { res.redirect('/') }
        User.findById(decoded.id, { password: 0}, (err,user)=>{
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')} 
            console.log("/newsForm : user ==> ", user)   
            
            const d = Date.now()
            const news = {...req.body,News_insertTime: d }
            console.log("/addNews : news => ", news)

            Newslist.create(
                news
            , (err, data) => {
                if(err) return res.status(500).send('There was a problem registering user')
                console.log(`Inserted ... ${data} `)
                const htmlMsg = encodeURIComponent('Added News DONE !');
                res.redirect('/admin/newsForm/?msg=' + htmlMsg)
            })            

        })
    })
})

router.get('/logout', (req,res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/');
})


router.post('/register', (req,res) => {
    console.log("/register : req.body ==> ", req.body)
    User.findOne({User_Email: req.body.User_Email }, (err, user) => {
      if (err) return res.status(500).send('Error on the server.');
      let htmlMsg
      if(!user){ //add new user
        const hashedPasword = bcrypt.hashSync(req.body.User_Password, 8);
        User.create({
            User_Name: req.body.User_Name,
            User_Email: req.body.User_Email,
            User_Password: hashedPasword
        }, (err, user) => {
            if(err) return res.status(500).send('There was a problem registering user')
            htmlMsg = encodeURIComponent('Registered OK !');
            res.redirect('/?msg=' + htmlMsg)
        })
      }else{ //duplicate
        htmlMsg = encodeURIComponent('Email existing, please enter a new one ...');
        res.redirect('/?msg=' + htmlMsg);
      }
    })     
})

router.get('/register',(req,res) =>
{
        
        res.render("signup.ejs");
        
})


module.exports = {router,User,Newslist};