import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import http from 'http'
import socketIO from 'socket.io'
import 'babel-polyfill'
import "core-js/stable";
import "regenerator-runtime/runtime";
import mongoose from 'mongoose'
const iplocate = require("node-iplocate")
const publicIp = require('public-ip')

// NEWS API KEY FROM NEWSAPI.ORG: 8083f0d49d034a579c04a12c80c1411a
//URL for business headlines: https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=8083f0d49d034a579c04a12c80c1411a
//URL for TechCrunch https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=8083f0d49d034a579c04a12c80c1411a
//URL for Wall Street Journal (last 6 months): https://newsapi.org/v2/everything?domains=wsj.com&apiKey=8083f0d49d034a579c04a12c80c1411a


//execute the call back functions 
require('./database')

//The NewList//ContactUSList
let NewsModel = require('./Models/News_Model')
let  ContactusModel = require('./Models/Contact_Model')
//Creates the Express.js application.
const app = express()

//Set the enviroment port
app.set('port', process.env.PORT || 7080);
app.use(express.static(path.join(__dirname, 'Public')));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

//Srt the view engine and find where the 
app.set('view engine', 'ejs')
app.set('views', './Views')

//Simple await call back function to get the userLocatioN
const getUserLoc = async ()=>{
    try{
        //GET THE IP ITSELF
        const ip = await publicIp.v4()
        const response =  await iplocate(ip);
        console.log(response);
        return   response;
    }catch(err){
        console.log(err);
    }
}

//WEATHER - Function to get the get the weather user data
const getWeatherData = async (Lon, Lat) =>{
    //source: https://openweathermap.org/current
    //PROVIDE THE API KEY HERE
    //New API key: b7bfe353452bd20e99c634fb3d0e3b1e
    const key = "b7bfe353452bd20e99c634fb3d0e3b1e";
    //PROVIDE THE API LINK HERE
    const Url = `http://api.openweathermap.org/data/2.5/weather?lon=${Lon}&lat=${Lat}&appid=${key}&units=metric`
    console.log("getWeather : apiUrl : ", Url)
    try{
        //use axios to connect said api. Install axion with npm b4 using app.
        /*Axios makes HTTP requests shorter and cleaner instead of using fetch() function. 
          Axios automatically converts responses to JSON. Axios catches errors more effectively and provides cleaner response objects. and other things.*/
        return axios.get(Url)
    }catch(err){
        console.log(err)
    }
}


//  WEATHER - Function that returns the weather data for Log and LAT of user
const getWeatherForUser = async () => {
    try {
        const loc = await getUserLoc();
        const Lon = loc.longitude;
        const Lat = loc.latitude;

        const weatherResponse = await getWeatherData(Lon, Lat);
        const weather = {
            Description: weatherResponse.data.weather[0].main,
            Icon: `http://openweathermap.org/img/wn/${weatherResponse.data.weather[0].icon}.png`,
            Temperature: weatherResponse.data.main.temp,
            Temp_min: weatherResponse.data.main.temp_min,
            Temp_max: weatherResponse.data.main.temp_max,
            City: weatherResponse.data.name
        };

        return weather; //returns the weather data

    } catch (error) {
        console.error("Error fetching weather:", error);
        return null; // Returns null in case of failure
    }
};

/*
    getUserLoc().then((loc)=>{  
            const Lon = loc.longitude
            const Lat = loc.latitude
            console.log(Lon  + " " + Lat)
            
            //Get the weather data using getWeatherData(). response -> result of getWeatherData(Lon,Lat)
            getWeatherData(Lon,Lat).then((weatherResponse)=>{
                const weather = {
                    Description: weatherResponse.data.weather[0].main ,
                    Icon: "http://openweathermap.org/img/wn/" + weatherResponse.data.weather[0].icon + ".png",
                    Temperature: weatherResponse.data.main.temp,
                    Temp_min: weatherResponse.data.main.temp_min,
                    Temp_max: weatherResponse.data.main.temp_max,
                    City: weatherResponse.data.name
                }

*/


/* Business News */
const getBusinessData = async () =>{
    //source: https://newsapi.org
    //PROVIDE THE API KEY HERE
    //New API key: 8083f0d49d034a579c04a12c80c1411a
    const key = "8083f0d49d034a579c04a12c80c1411a";
    //PROVIDE THE API LINK HERE
    const Url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=8083f0d49d034a579c04a12c80c1411a`
    console.log("getBusinessData : apiUrl : ", Url)
    
    try{
        //use axios to connect said api. Install axion with npm b4 using app.
        /*Axios makes HTTP requests shorter and cleaner instead of using fetch() function. 
          Axios automatically converts responses to JSON. Axios catches errors more effectively and provides cleaner response objects. and other things.*/
          return await axios.get(Url)
        }catch(err){
            console.log(err)
        }
    }


/* TechCrunch */
const getTechData = async () =>{
    //source: https://newsapi.org
    //PROVIDE THE API KEY HERE
    //New API key: 8083f0d49d034a579c04a12c80c1411a
    const key = "8083f0d49d034a579c04a12c80c1411a";
    //PROVIDE THE API LINK HERE
    const Url = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=8083f0d49d034a579c04a12c80c1411a`
    console.log("getTechData : apiUrl : ", Url)
    try{
        //use axios to connect said api. Install axion with npm b4 using app.
        /*Axios makes HTTP requests shorter and cleaner instead of using fetch() function. 
          Axios automatically converts responses to JSON. Axios catches errors more effectively and provides cleaner response objects. and other things.*/
          return await axios.get(Url)
        }catch(err){
            console.log(err)
        }
    }


/* Wall Street Journal */
const getWSJData = async () =>{
    //source: https://newsapi.org
    //PROVIDE THE API KEY HERE
    //New API key: 8083f0d49d034a579c04a12c80c1411a
    const key = "8083f0d49d034a579c04a12c80c1411a";
    //PROVIDE THE API LINK HERE
    const Url = `https://newsapi.org/v2/everything?domains=wsj.com&apiKey=8083f0d49d034a579c04a12c80c1411a`
    console.log("getWSJData : apiUrl : ", Url)
    try{
        //use axios to connect said api. Install axion with npm b4 using app.
        /*Axios makes HTTP requests shorter and cleaner instead of using fetch() function. 
          Axios automatically converts responses to JSON. Axios catches errors more effectively and provides cleaner response objects. and other things.*/
          return await axios.get(Url)
        }catch(err){
            console.log(err)
        }
    }



// Handles GET request for root directory.
/* Sets up a route handler for the root URL */
app.get('/', async (req,res)=>{
    //Gets user lon and lat based off of IP to determine weather after getUserLoc() resolves.
    //loc -> result of getUserLoc()
    
    /* ATTEMPT TO PLACE getUserLoc() AND getWeatherData(Lon,Lat).then((weatherResponse)=>{} BELOW INTO OWN FUNCTION
    HAVE THAT FUNCTION RETURN WEATHER CALL IT HERE TO ASSIGN TO const weather 
    THAT WAY I CAN HAVE ALL 4 APIs UNDER 
    res.render('home', {
                    weather,
                    news,
                    businessNews,
                    techNews,
                    wsjNews
                } */
    
    const weather = await getWeatherForUser()
    console.log("This is weather value: ", weather)




    NewsModel.find({}).limit(3).sort( {"News_insertTime": -1} ).exec( (err,data)=>{
                
        if (err) {
            console.error("Error fetching news data:", err);
        } else {
            console.log("Fetched news data:", data);  // Debugging output
        }
        //console.log(err)
        const news = data
        //console.log("news : ", news)
        
        res.render('home', {
            weather,
            news,
            //businessNews,
            //techNews,
            //wsjNews

        })
    })

    //--------------------------------------------------------------------------------------------------
    /*
    getUserLoc().then((loc)=>{  
        const Lon = loc.longitude
        const Lat = loc.latitude
        console.log(Lon  + " " + Lat)*/
        //Get the weather data using getWeatherData(). response -> result of getWeatherData(Lon,Lat)
        /*getWeatherData(Lon,Lat).then((weatherResponse)=>{
            const weather = {
                Description: weatherResponse.data.weather[0].main ,
                Icon: "http://openweathermap.org/img/wn/" + weatherResponse.data.weather[0].icon + ".png",
                Temperature: weatherResponse.data.main.temp,
                Temp_min: weatherResponse.data.main.temp_min,
                Temp_max: weatherResponse.data.main.temp_max,
                City: weatherResponse.data.name
            }*/
            
    



            /* Insert data from NewsAPI.org call for Business, TechCrunch, Wall Street Journal */
            
            /*const allBusinessNews = getBusinessData().then(businessResponse)
            const businessNews = allBusinessNews[0]
            */



            /*
            //Business news from NewsAPI.org
            const busUrl = 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=8083f0d49d034a579c04a12c80c1411a'
            axios.get(busUrl).then((businessResponse) =>
            {
                //Retrieve the most recent article from the articles array
                const businessNews = businessResponse.data.articles[0];

            }).catch(function(busErr){
                console.log("Error - could not retrieve business news: ", busErr);
            })
            
            //TechCrunch news from NewsAPI.org
            const techUrl = 'https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=8083f0d49d034a579c04a12c80c1411a'
            axios.get(techUrl).then((techResponse) =>
            {
                //Retrieve the most recent article from the articles array
                const techNews = techResponse.data.articles[0];

            }).catch(function(techErr){
                console.log("Error - could not retrieve tech news: ", techErr);
            })
            
            //Wall Street Journal news from NewsAPI.org
            const wsjUrl = 'https://newsapi.org/v2/everything?domains=wsj.com&apiKey=8083f0d49d034a579c04a12c80c1411a'
            axios.get(wsjUrl).then((wsjResponse) =>
            {
                //Retrieve the most recent article from the articles array
                const wsjNews = wsjResponse.data.articles[0];

            }).catch(function(wsjErr){
                console.log("Error - could not retrieve Wall Street Journal news: ", wsjErr);
            })
            */

            //Adds NewsModel collection from database 
            
            /*NewsModel.find({}).limit(3).sort( {"News_insertTime": -1} ).exec( (err,data)=>{
                
                if (err) {
                    console.error("Error fetching news data:", err);
                } else {
                    console.log("Fetched news data:", data);  // Debugging output
                }
                //console.log(err)
                const news = data
                //console.log("news : ", news)
                
                res.render('home', {
                    weather,
                    news,
                    //businessNews,
                    //techNews,
                    //wsjNews

                })
            })*/
            //////////////////////////////////////////////////////////////////////////////////////////////
        /*})*/
    /*})*/
    //-----------------------------------------------------------------------------------------------------
})

//SPORTS - from NewsAPI.org 
// Handles GET request for the /sports page
/* Sets up a route handler for the /sports page */
app.get('/sports',(req,response)=>
{   /*This API is part of NewsAPI, a service that provides access to worldwide news articles and headlines.
      This one in specific is to fetch top sports headlines from the United States.
      The API returns JSON-formatted news articles from various sources.
      NewsAPI offers a free plan, but you must sign up and create an account to use NewsAPI.
      Without an account, the API provided won’t work because the apiKey needs to be associated with a registered account.
      → Visit newsapi.org to create an account and get a key. 
      New API key: 8083f0d49d034a579c04a12c80c1411a*/
    const apiUrl = 'https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=8083f0d49d034a579c04a12c80c1411a'
    //include the todays_date in ISO format
    axios.get(apiUrl)
    .then((res) =>
    {
        const sport = res.data.articles;
        response.render('Sports.ejs',{sport})

    }).catch(function(err)
    {
        
        console.log("test error", err);
    })
    // res.render('Sports.ejs',{title:"test my title"});
})

//GET route handler for the /about_us page
app.get('/about_us', (req,res)=>{
    res.render('about_us.ejs')
})

//GET route handler for the /contact_us page
app.get('/contact_us', (req,res)=>{
    
    res.render('contact_us.ejs', {
        msg: req.query.msg?req.query.msg:''
    })
})

//POST route handler for the /addContactUs page
app.post('/addContactUs', (req,res)=>{
    console.log("/addContactUs : req.body : ", req.body)
    
    const record = req.body
    ContactusModel.create(
            record  
        , (err, data) => {
            if(err){
                const htmlMsg = encodeURIComponent('Error message (cannot send message) : ', error);
            
                res.redirect('/contact_us/?msg=' + htmlMsg)
            }else{
                const htmlMsg = encodeURIComponent('Your message was sucessfully sent!');
                res.redirect('/contact_us/?msg=' + htmlMsg)
            }
        }) 
    
})

// app.use(express.static(path.join(__dirname,'chat')))
// //Create the server for the chat rooms 
//     const server = http.createServer(app).listen(app.get('port'), () => {
//         console.log("Creating the server chat rooms " + app.get('port'));
//     });
//     const io = require('socket.io').listen(server);
//     let users = [];
//     io.on('connection',  (socket) => {

//         socket.on('connect', ()=>{
//             console.log("New connection socket.id : ", socket.id)
//         })

//         socket.on('disconnect', ()=>{
//             const updatedUsers = users.filter(user => user != socket.nickname)
//             users = updatedUsers
//             io.emit('userlist', users)
//         })

    
//         socket.on('nick', (nickname) => {
//             console.log("nick => nickname : ", nickname)
//             socket.nickname = nickname
//             users.push(nickname)

//             console.log("server : users : ", users)
        
//             io.emit('userlist', users);
//         });
//         socket.on('chat', (data) => {
//             console.log("chat => nickname : ", socket.nickname)
//             const d = new Date()
//             const ts = d.toLocaleString()
//             const response = `${ts} : ${socket.nickname} : ${data.message}`
//             io.emit('chat', response)
//         });
//     });

app.use(express.static(path.join(__dirname,'chat')))
//Create the server for the chat rooms 

//Creating a server using the Express.js application instance for the use of Chat rooms


let server = http.createServer(app).listen(app.get('port'),()=>{
    console.log("Creating the server chat rooms " + app.get('port'));
})

//Sets up to handle real-time communication between users on a server.
//Creates a WebSocket connection using Socket.io
//sockets -> communication endpoints that allow data to be exchanged between different systems, such as between a client (browser) and a server. They enable real-time communication.


let io = socketIO(server)

//Listens for new users connecting to the WebSocket.
//'socket' -> represents a unique connection for each user.
/*(socket)=>{} -> The second argument is for callback function that is expected.
  Give the parameter a name to refer to it and then define the callback function. */ 

  io.sockets.on('connection', (socket)=>{

    /*Each socket.on() call below listens for a different event the client might trigger.
    The 'connection' event creates a communication channel between the server and that specific client (socket) */

    /* Listens for disconnect event, removes the disconnected user from the users array. 
    Broadcasts the updated user list to all other users */
    
    socket.on('disconnect',()=>{
        const updateUsers = users.filter(user=> user != socket.nick)
        users = updateUsers
        socket.emit('userlist', users)
    })

    //Retrieves a list of all connected users
    
    let list = socket.client.conn.server.clients
    let users = Object.keys(list)

    //emitting events with labels 
    /* Listends for the 'nick' event
    Server stores their nickname and updates the user list. 
    The updated list is sent back to all users.
    (Sends the updated user list to the client) */
    
    socket.on('nick',(nickname)=>{
        socket.nickname=nickname
        users.push(nickname)
        socket.emit('userlist',users)
    })
    
    /* Handling Chat Messages 
    Listens for chat messages
    Formats messages with a timestamp. 
    Sends the message to the sender and to all users via socket.broadcast.emit() */
    
    socket.on('chat',(data)=>{
        const d = new Date()
        const ts = d.toLocaleString()
        const response = `${ts} : ${socket.nickname}: ${data.message}`
        socket.emit('chat', response)
        socket.broadcast.emit('chat',response)
    })

})


