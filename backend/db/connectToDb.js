import mongoose from 'mongoose';

const connectToMongoDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/test-data");
        console.log("Connected to mongodb");
    } catch (error) {
        console.log("Errow while connecting to MONGODB : " + error.message);
    }
};

export default connectToMongoDB;