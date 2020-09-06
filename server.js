const express = require('express')
const dotenv = require('dotenv')
var colors = require('colors')
const morgan=require('morgan')

// Dane z routes
const bootcamps=require('./routes/bootcamps')




// ŁADUJEMY DOTENV
dotenv.config({ path: './config/config.env' })

const app = express();
// ____________________________________________

// Dev logging middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

// montujemy Router
app.use('/api/v1/bootcamps', bootcamps)


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Serwer nasłuchuje na poziomie ${process.env.NODE_ENV} na porcie ${5000}`.bgBlue.brightWhite))