const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken")


const regesterUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: await generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("Failed to create user")
    }

});


const authUser = asyncHandler(async (req, res) => {

      const {email, password} = req.body;

      const user = await User.findOne({email});

      if(user && ( await user.matchPassword(password))){
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: await generateToken(user._id),
          })
      }
      else{
        res.status(401);
        throw new Error("Invalid Email or Password")
      }

});

// /api/user?search = piysh
const allUsers = asyncHandler(async (req, res) => {
    let keyword = {};

    if (req.query.search) {
      keyword = {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } }
        ]
      };
    }

     try {
        const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });

        res.send(users);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
      }
      
})


module.exports = { regesterUser, authUser, allUsers }