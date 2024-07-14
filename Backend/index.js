// importing all the packages:
const express = require("express");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
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
const Blog = require("./Models/Blog");
const Message = require("./models/message");

//socket.io server
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log(`User : ${socket.id} Connected `);

    socket.on('sendmessage', (data) => {
        console.log('Message : ', data.message, "send by : ", data.senderId, "To : ", data.friendId);
        const payload = {
            message: data.message,
            sender: data.senderId,
            receiver: data.friendId,
            timeStamp: new Date(),
        }
        const newMessage = new Message({
            senderId: payload.sender,
            receiverId: payload.receiver,
            message: payload.message,
            timeStamp: new Date(),
        })
        newMessage.save();
        socket.broadcast.emit('message', payload);
    });


    socket.on('disconnect', () => {
        console.log(`user : ${socket.id} disconnected`);
    })
})

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
app.get("/",(req,res)=>{
    res.send("Server is Running!")
})

// endpoint for Sign Up:
app.post("/register", upload.single('image'), async (req, res) => {
    const { username, email, password } = req.body;
    const { buffer, mimetype } = req.file;
    try {

        const newUser = new User({
            name: username,
            email: email,
            password: password,
            image: {
                name: `${uuidv4()}.${mimetype.split('/')[1]}`,
                data: buffer,
                contentType: mimetype
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
        return res.status(200).json({ token: token });
    }).catch((err) => {
        console.log("Error while finding the user", err);
        return res.status(500).json({ message: "Some Error Occured" });
    })
})

// api endpoint for Verification Screen:
app.post("/verification/:userId", upload.single("image"), async (req, res) => {
    const userId = req.params.userId;
    const { flag } = req.body;
    const { buffer, mimetype } = req.file;
    console.log("entered");
    try {
        await User.findByIdAndUpdate(userId, {
            $set: {
                imageVerify: {
                    name: `${uuidv4()}.${mimetype.split('/')[1]}`,
                    data: buffer,
                    contentType: mimetype
                }
            }
        })
        await User.findByIdAndUpdate(userId, {
            $set: {
                sentVerificationImage: true
            }
        })
        console.log("added and set true");
        return res.status(200).json({ message: "Image Uploaded on DB For Verification" });
    }
    catch (err) {
        console.log("error in uploading the image to the DB for Verification: ", err);
        return res.status(500).json({ message: "Error in uploading the image to database" })
    }
})

// endpoint for checking if verification image uploaded
app.get("/hasSent/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById({ _id: userId });
        return res.status(200).json({ sentVerificationImage: user.sentVerificationImage, profileBuilt: user.profileBuilt });
    }
    catch (err) {
        console.log("error in getting the sentVerificationImage:", err);
        return res.status(500).json({ message: "error in getting the sentVerificationImage" });
    }
})

// api endpoint for handling profile details postReq:
app.post("/profileData/:userId", async (req, res) => {
    const { userId } = req.params;
    const { emergencyPhone1, emergencyPhone2, pregnancyStatus, birthPlan, numBabies, dueDate, profileBuilt } = req.body;
    try {
        await User.findByIdAndUpdate(userId, {
            $set: {
                emergencyPhone1, emergencyPhone2, pregnancyStatus, birthPlan, numBabies, dueDate, profileBuilt
            }
        })
        console.log("Profile Details Sent Successfully");
        return res.status(200).json({ message: "Profile Details Sent Successfully" });
    }
    catch (err) {
        console.log("error in sending profile data:", err);
        return res.status(500).json({ message: "error in sending profile details" })
    }
})

// api endpoint for fetching userData:
app.get("/getUserData/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        return res.status(200).json({ username: user.name, userImage: user.image });
    }
    catch (err) {
        console.log("error in getting user data: ", err);
        return res.status(500).json({ message: "error in getting user data" });
    }
})

// fetch user image:
app.get('/images/:name', async (req, res) => {
    const { name } = req.params;
    try {
        // Find user with matching image name
        const user = await User.findOne({ 'image.name': name });
        if (!user || !user.image) {
            return res.status(404).json({ success: false, message: 'Image not found.' });
        }

        // Set content type and send image data
        res.set('Content-Type', user.image.contentType);
        return res.send(user.image.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch image.' });
    }
});

// fetch blogPost image:
app.get('/blogImage/:name', async (req, res) => {
    const { name } = req.params;
    try {
        // Find user with matching image name
        const blog = await Blog.findOne({ 'image.name': name });
        if (!blog || !blog.image) {
            return res.status(404).json({ success: false, message: 'Image not found.' });
        }

        // Set content type and send image data
         res.set('Content-Type', blog.image.contentType);
        return res.send(blog.image.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch image.' });
    }
});

// api endpoint for fetching blogs:
app.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find({});
        return res.status(200).json({ blogs });
    }
    catch (err) {
        console.log("error in retrieving the blogs:", err);
        return res.status(500).json({ message: "error in retrieving the blogs" });
    }
})

// api endpoints for posting blog:
app.post("/postBlog", upload.single("image"), async (req, res) => {
    const { name, title, description, isAnonymous, imageSent, userImageName } = req.body;
    console.log("Image sent: ", imageSent);

    try {
        if (imageSent === 'true') {
            const { buffer, mimetype } = req.file;
            const newBlog = new Blog({
                name,
                userImageName,
                title,
                description,
                isAnonymous,
                imageSent: true,
                image: {
                    name: `${uuidv4()}.${mimetype.split('/')[1]}`,
                    data: buffer,
                    contentType: mimetype
                }
            });
            await newBlog.save();
        } else {
            const newBlog = new Blog({
                name,
                userImageName,
                title,
                description,
                isAnonymous,
                imageSent: false
            });
            await newBlog.save();
        }
        return res.status(200).json({ message: "Post saved in DB!" });
    } catch (err) {
        console.log("Error in saving the post to DB: ", err);
        return res.status(500).json({ message: "Error in saving the post to DB" });
    }
});

// api endpoint for liking a post:
app.post("/liked/:id", async (req, res) => {
    const postId = req.params.id;
    const { liked, userName } = req.body;
    try {
        if (liked === false) {
            await Blog.findByIdAndUpdate(postId, {
                $addToSet: {
                    likes: {
                        likedUser: userName
                    }
                }
            });
            console.log("changed to true");
        }
        else {
            await Blog.findByIdAndUpdate(postId, {
                $pull: {
                    likes: {
                        likedUser: userName
                    }
                }
            });
            console.log("changed to false");
        }
        return res.status(200).json({ message: "Like field chnaged!" })
    }
    catch (err) {
        console.log("Error in changing the like of post: ", err);
        return res.status(500).json({ message: "Error in changing the like of post" });
    }
})

// api endpoint to post comment:
app.post("/comment/:id", async (req, res) => {
    const id = req.params.id;
    const { name, userImageName, commentInp } = req.body;
    try {
        await Blog.findByIdAndUpdate(id, {
            $addToSet: {
                comments: {
                    user: name,
                    imageUser: userImageName,
                    comment: commentInp
                }
            }
        });
        return res.status(200).json({ message: "Successfully uploaded the comment!" });
    }
    catch (err) {
        console.log("Error in posting comment: ", err);
        return res.status(500).json({ message: "Error in posting comment" })
    }
})

// api endpoint for fetching the comments of a post:
app.get("/fetchComments/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const comments = await Blog.findById(id).select("comments");
        return res.status(200).json({ commentsArr: comments });
    }
    catch (err) {
        console.log("Error in fetching the comments: ", err);
        return res.status(500).json({ message: "Error in fetching the comments" });
    }
})

// api endpoint to fetch all the users except the active user:
app.get("/users/:userId", async (req, res) => {
    const loggedInUserId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const users = await User.find({ _id: { $ne: loggedInUserId } })
            .skip(skip)
            .limit(limit);
        const totalUsers = await User.countDocuments({ _id: { $ne: loggedInUserId } });
        return res.status(200).json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        });
    } catch (err) {
        console.log("Error retrieving users", err);
        return res.status(500).json({ message: "Error retrieving users" });
    }
});

// api endpoint for fetching the profile data:
// GET user data with specific fields by userId
app.get("/userProfileData/:userId", async (req, res) => {
    const userId = req.params.userId;
    console.log("entered");
    try {
        const user = await User.findById(userId, {
            pregnancyStatus: 1,
            numBabies: 1,
            birthPlan: 1,
            dueDate: 1,
            verified: 1,
            _id: 0
        });
        console.log(user);
        return res.status(200).json({ user });
    } catch (err) {
        console.error("Error in getting user data:", err);
        return res.status(500).json({ message: "Error in getting user data" });
    }
});

// api endpoint for fetching emergency contact of the user:
app.get("/getEmergency/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const emergencyContacts = await User.findById(id, {
            _id: 0,
            emergencyPhone1: 1,
            emergencyPhone2: 1
        });
        return res.status(200).json({ emergencyContacts });
    }
    catch (err) {
        console.log("Error in retrieving the Emergency contacts: ", err);
        return res.status(500).json({ message: "Error in retrieving the Emergency contacts" });
    }
})


// Fetch User Friends API
app.get('/friends/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('friends', 'name email image.name');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("User Friends: ", user.friends);
       return res.status(200).json(user.friends);
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching friends', details: err });
    }
});

// Fetch Sent Friend Requests API
app.get('/friend-requests/sent/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('sentFriendRequest', 'name email');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user.sentFriendRequest);
    } catch (err) {
        return  res.status(500).json({ error: 'Error fetching sent friend requests', details: err });
    }
});

// Send Friend Request API
app.post('/friend-request', async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        const currentUser = await User.findById(currentUserId);
        const selectedUser = await User.findById(selectedUserId);

        if (!currentUser || !selectedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (currentUser.friends.includes(selectedUserId)) {
            return res.status(400).json({ error: 'User is already a friend' });
        }

        if (currentUser.sentFriendRequest.includes(selectedUserId)) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        currentUser.sentFriendRequest.push(selectedUserId);
        selectedUser.friendRequest.push(currentUserId);

        await currentUser.save();
        await selectedUser.save();

       return res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Error sending friend request', details: err });
    }
});

// api endpoint to fetch friends name email image:
app.get("/friendsReqData/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate("friendRequest", "name email image.name").lean();
        const friends = user.friendRequest;
        console.log("req", friends);
        return res.status(200).json(friends);
    }
    catch (err) {
        console.log("Error retrieving the FriendsList", err);
        return res.status(500).json({ message: "internal server error" });
    }
})


// api endpoint to accept friend requests:
app.post("/friend-request/accept", async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        await User.findByIdAndUpdate(senderId, {
            $addToSet: { friends: receiverId },
            $pull: { sentFriendRequest: receiverId },
        })
        await User.findByIdAndUpdate(senderId, {
            $pull: { friendRequest: receiverId },
        })
        await User.findByIdAndUpdate(receiverId, {
            $addToSet: { friends: senderId },
            $pull: { friendRequest: senderId },
        })
        await User.findByIdAndUpdate(receiverId, {
            $pull: { sentFriendRequest: senderId },
        })
       return res.status(200).json({ message: " Friend Request accepted successfully ! " })
    }
    catch (err) {
        console.log("error in accepting the frined request : ", err);
        return res.status(500).json({ message: "internal server error " })
    }
})

// api endpoint for messages:
app.get("/messages/:userId/:friendId", async (req, res) => {
    try {
        const { userId, friendId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: friendId },
                { senderId: friendId, receiverId: userId }
            ]
        }).populate("senderId", "_id name");
        return res.status(200).json(messages);

    }
    catch (err) {
        console.log("Error fetching the messages : ", err);
        return res.status(500).json({ message: "internal error occurred" });
    }
})