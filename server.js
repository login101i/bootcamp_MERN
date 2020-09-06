const express=require('express')
const dotenv=require('dotenv')
var colors =require('colors')




// ŁADUJEMY DOTENV
dotenv.config({path:'./config/config.env'})

const app=express();

const PORT=process.env.PORT || 5000

app.listen(PORT, console.log(`Serwer nasłuchuje na poziomie ${process.env.NODE_ENV} na porcie ${5000}`.bgBlue.brightWhite))