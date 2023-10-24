const mongoose = require('mongoose');
const colors = require("colors");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`.bgGreen.bold)
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit()
    }
}

module.exports = connectDB