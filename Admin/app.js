//Imports Express.js
const express = require('express');

//Creates Express.js application.
const app = express();

//Imports the database from /database folder
const db = require('./database');


//Imports AdminRouter.js file
const Routes = require('./Routes/AdminRouter')

/* Attaches the Express Router instance in AdminRouter.js ('router') to handle any requests starting with /Admin in URL. 
Ex: GET /Admin/dashboard or GET /Admin/settings -> handled by AdminRouter.js 
This keeps Admin-related routes separate from the main app. */
app.use('/Admin', Routes.router)

//May need to change Routes.user to Routes.User
//User in AdminRouter.js refers to User_Model.js
let user = Routes.User;

//May need to change Routes.newslist to Routes.Newslist
//Newslist in AdminRouter.js refers to News_Model.js
let newslist = Routes.Newslist;

//Exports app, user, and mewslist to be accessible from app.js
module.exports = {app , user, newslist};