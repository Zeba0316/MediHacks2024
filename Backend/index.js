// importing all the packages:
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
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

// Multer Setup 
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Token Creation Function:
const createToken = (userId) => {
    const payload = {
        userId: userId
    };
    const token = jwt.sign(payload, "KeyRandom", { expiresIn: "1h" });
    return token;
}

//Api:

// endpoint for Sign Up:
app.post("/register", upload.single('image'), async (req, res) => {
    const { username, email, password } = req.body;
    const image = req.file;
    try {
        if (!username || !email || !password || !image) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        const uniqueImageName = `${uuidv4()}-${image.originalname}`;
        const newUser = new User({
            name: username,
            email: email,
            password: password,
            image: {
                name: uniqueImageName,
                data: image.buffer,
                contentType: image.mimetype
            }
        });
        await newUser.save();
        return res.status(200).json({ message: "Sign Up Successful!" });
    } catch (err) {
        console.log("Error in Signing Up:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// endpoint for Login:
app.post("/login", (req, res) => {
    const { username, pass } = req.body;

    User.findOne({ name: username }).then((user) => {
        console.log("1");
        if (!user) {
            console.log("2");
            return res.status(404).json({ message: "user not found " })
        }

        if (user.password != pass) {
            console.log("3");
            return res.status(404).json({ message: "Password is Invalid" })
        }
        const token = createToken(user._id);
        console.log("login successful");
        return res.status(200).json({ token });
    }).catch((err) => {
        console.log("Error while finding the user", err);
        return res.status(500).json({ message: "Some Error Occured" });
    })
})