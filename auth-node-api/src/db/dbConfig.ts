import mongoose from 'mongoose'


const uri = "mongodb+srv://lupesms97:FFUbyEC2M33XM2ce@cluster0.chyk6kv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const createConnectionDB = () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(uri)
        .then(() => console.log('Database connected'))
        .catch((error) => console.error('Error connecting to database:', error));
};