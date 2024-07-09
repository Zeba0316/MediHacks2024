// importing all the packages:
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const ip = require("ip");
require("dotenv").config();

// express app initialized and port assigned:
const app = express();
const port = 3000;
// enabling cors and parsing:
app.use(cors());
app.use(bodyParser.json());

// finding the ip address for locally running:
const ipAddress = ip.address();

// server initialized:
const server = app.listen(port, (req, res) => {
    console.log(`Server is running on ${ipAddress}:${port}`);
});

// MongoDB connected:
const passDb = process.env.passwordOfDatabase;
mongoose.connect(`mongodb+srv://raza:${passDb}@cluster0.euagu12.mongodb.net/`, {}).then(() => {
    console.log("Database connected successfully!");
}).catch((err) => {
    console.log(`Error in connecting to DB : ${err}`);
});

// Importing Models:
const User = require("./Models/user");

//Api:
// endpoint for Sign Up:
app.post("/register", (req, res) => {
    const { username, email, pass } = req.body;
    console.log(username, email, pass);
    try {

        res.status(200).json({ message: "Sign Up Successful!" });
    }
    catch (err) {
        console.log("Error in Signing Up:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})