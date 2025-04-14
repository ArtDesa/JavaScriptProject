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
//execute the call back functions 
require('./database')
//The NewList//ContactUSList
 let NewsModel = require('./Models/News_Model')
let  ContactusModel = require('./Models/Contact_Model')
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
//Function to get the get the weather user data
const getWeatherData = async (Lon, Lat) =>{
    //nEED THE API KEY(PLEASE RESOLVE)
    const key = "371e3350e42ff3618e3c67c091326f57";
    const Url = `http://api.openweathermap.org/data/2.5/weather?lon=${Lon}&lat=${Lat}&appid=${key}&units=metric`
    console.log("getWeather : apiUrl : ", Url)
    try{
        //use axios to connect said api
        return await axios.get(Url)
    }catch(err){
        console.log(err)
    }
}
app.get('/', (req,res)=>{

    getUserLoc().then((loc)=>{  
        const Lon = loc.longitude
        const Lat = loc.latitude
        console.log(Lon  + " " + Lat)
        //Get the weather  data as well 
        getWeatherData(Lon,Lat).then((response)=>{
            const weather = {
                Description: response.data.weather[0].main ,
                Icon: "http://openweathermap.org/img/wn/" + response.data.weather[0].icon + ".png",
                Temperature: response.data.main.temp,
                Temp_min: response.data.main.temp_min,
                Temp_max: response.data.main.temp_max,
                City: response.data.name
            }
            
            
            NewsModel.find({}).limit(3).sort( {"News_insertTime": -1} ).exec( (err,data)=>{
                console.log(err)
                const news = data
                //console.log("news : ", news)
                
                res.render('home', {
                    weather,
                    news
                })
            })
    
        })
    })
})
app.get('/sports',(req,response)=>
{   /*This API is part of NewsAPI, a service that provides access to worldwide news articles and headlines.
      This one in specific is to fetch top sports headlines from the United States.
      The API returns JSON-formatted news articles from various sources.
      NewsAPI offers a free plan, but you must sign up and create an account to use NewsAPI.
      Without an account, the API provided won’t work because the apiKey needs to be associated with a registered account.
      → Visit newsapi.org to create an account and get a key. */
    const apiUrl = 'https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=884aeb5b9df34b4080592935e05a5417'
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
app.get('/about_us', (req,res)=>{
    res.render('about_us.ejs')
})
app.get('/contact_us', (req,res)=>{
    
    res.render('contact_us.ejs', {
        msg: req.query.msg?req.query.msg:''
    })
})
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

let server = http.createServer(app).listen(app.get('port'),()=>{
    console.log("Creating the server chat rooms " + app.get('port'));
})

let io = socketIO(server)

io.sockets.on('connection',(socket)=>{


    socket.on('disconnect',()=>{
        const updateUsers = users.filter(user=> user != socket.nick)
        users = updateUsers
        socket.emit('userlist',users)
    })

    let list =socket.client.conn.server.clients
    let users=Object.keys(list)

    //emitting events with labels 
    socket.on('nick',(nickname)=>{
        socket.nickname=nickname
        users.push(nickname)
        socket.emit('userlist',users)
    })
    
    socket.on('chat',(data)=>{
        const d = new Date()
        const ts = d.toLocaleString()
        const response = `${ts} : ${socket.nickname}: ${data.message}`
        socket.emit('chat', response)
        socket.broadcast.emit('chat',response)
    })
})


