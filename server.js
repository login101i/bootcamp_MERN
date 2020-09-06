const express = require('express')
const dotenv = require('dotenv')
var colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db')
const errorHandler=require('./middleware/error')


// ŁADUJEMY DOTENV
dotenv.config({ path: './config/config.env' })

// połącz z bazą danych Mongo DB
connectDB()

// Dane z routes
const bootcamps = require('./routes/bootcamps')


const app = express();
// Body parser
app.use(express.json())
// ____________________________________________

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// montujemy Router
app.use('/api/v1/bootcamps', bootcamps)

app.use(errorHandler)


const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Serwer nasłuchuje na poziomie ${process.env.NODE_ENV} na porcie ${5000}`.bgBlue.brightWhite))

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Nieznane odrzucenie: ${err.message}`.red)
    // Zamknij server i zakończ process
    server.close(() => process.exit(1))
})