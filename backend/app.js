import express from "express";
import connectToMongoDB from "./db/connectToDb.js";
import cors from 'cors';

const port = 3001;
const app = express();

// Set up CORS
app.use(cors({
    origin: '*', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],

}));

import initDbRoute from './routes/initDb.routes.js';
import transactionRoute from './routes/transactions.routes.js';

app.get('/', (req, res) => {    
    try {
        connectToMongoDB();
        res.send("this is home route");
    } catch (error) {
        console.log(error);
    }
});

app.use('/api/initDb', initDbRoute);
app.use('/api/transactions', transactionRoute);

app.listen(port, () => {
    console.log("App is listening on port : " + port);
});