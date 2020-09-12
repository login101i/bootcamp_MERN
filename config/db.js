const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    })

    console.log(`MongoDB jest połączone z Bazą Danych ${conn.connection.host} i ma się dobrze`.bgGray.blue)
}

module.exports=connectDB