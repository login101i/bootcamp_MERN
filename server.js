const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
var colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');



// ŁADUJEMY DOTENV
dotenv.config({ path: './config/config.env' })

// połącz z bazą danych Mongo DB
connectDB()

// Dane z routes
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth=require('./routes/auth')
const users=require('./routes/users')


const app = express();
// Body parser
app.use(express.json())
// Cookie parser
app.use(cookieParser())
// ____________________________________________

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// upload pliki
app.use(fileupload())

// ustatwienie statycznych plików
app.use(express.static(path.join(__dirname, 'public')))
// a po co to nie wiem po co to jest. Bez tego chyba też działa.. aaaa już wiem
// jak to zrobimy do ten folder co jest w bulic czyli obrazy można zrobić w przeglądarce tak:
// http://localhost:5000/obrazy/photo_5d725a1b7b292f5f8ceff788.jpg

// montujemy Router
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)

app.use(errorHandler)


const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Serwer nasłuchuje na poziomie ${process.env.NODE_ENV} na porcie ${5000}`.bgBlue.brightWhite))

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Nieznane odrzucenie: ${err.message}`.red)
    // Zamknij server i zakończ process
    server.close(() => process.exit(1))
})