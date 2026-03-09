const mongoose = require("mongoose")
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {});
        console.log("MONGO DB IS CONNECTED");
    } catch (error) {
        console.log(`Mongo DB error ${error}`);
        process.exit(1);
    }
}
module.exports = connectDB;