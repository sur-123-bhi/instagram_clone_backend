const express = require("express");
const { connection } = require('./config/db');
require("dotenv").config();
const { userRouter } = require('./routes/user.routes');

const app = express();
app.use(express.json());
app.use('/users', userRouter);

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log(`Server is running at Port ${process.env.port}`);
    } catch (err) {
        console.log(err);
    }
})