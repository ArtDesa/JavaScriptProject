require('@babel/register')({})
module.exports=require('./app')


/* Notes while bug fixing: */

/* Current Status: */
/* 
Issues:

On clean start in new machine:
1. Need to create at least 3 news sources in the MongoDB database (edureka_names), 
through the use of Admin connection at localhost:7100 in the NewsForm page.
Otherwise Customers will have an error if you try to connect to localhost:7080.

For Customers:
    Home page:
        Weather at top bar seems strange. It says "Ocoee", "Clear" (with grey circle).
        Current, Max, and Min temperatures at listed  but could use better formatting.
        -> edit CSS and HTML/EJS files on home.

        Main center "News" square is overflowing outside of it's container. It does cycle though.
        3 "News" pieces in the 3 squares below it seem to be fine.

    Sports page:
        Seems to be working perfectly.
        -> No formatting issues
        -> Sports news API is functioning correctly. Sports news is listed in each square and 
           clicking on the image will take the user to the website of that news piece.

    Contact Us page:
        -> Footer bar with phone number and Copyright is not sticking to the bottom of the page.

        -> Looks (mostly) correct.
        -> providing email and message and clicking Submit works.
        -> After hittin Submit, a light blue bar covering the entire width from left to right 
           pops up saying "Your message was successfully sent!" 

    About Us page:
        -> The "TCS Incorporated" text box is empty and flat
        -> Footer bar with phone number and Copyright is not sticking to the bottom of the page.

        -> Company location show correctly in integrated Google Maps API.




*/