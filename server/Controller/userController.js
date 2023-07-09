const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY; // access the jwt_secret_key from .env

    return jwt.sign({ _id }, jwtkey, { expiresIn: "3days" })
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await userModel.findOne({email}); // find the same emaill
        
        if(user) 
            return res.status(400).json("User with the given email already exist..."); // if email already taken by a user
        if(!name || !email || !password) 
            return res.status(400).json("All fields are requried..."); // validates the inputs
        if(!validator.isEmail(email)) 
            return res.status(400).json("Email must be a valid email"); // validates emaill
        if(!validator.isStrongPassword(password)) 
            return res.status(400).json("Password must be a strong password"); // validates emaill
        
        user = new userModel({name, email, password}); // if the above condition is success, then proceed to post new User

        const salt = await bcrypt.genSalt(10); // makes a hash with 10 letters
        user.password = await bcrypt.hash(user.password, salt); // hashes the password
        await user.save(); // saves the user to the database 

        const token = createToken(user._id); // creates a token
        res.status(200).json({_id: user._id, name, email, token}); 
    } catch(error) {
        console.log(error);
        res.status(500).json(error); // sends error so that the server wont crush
    }
    
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await userModel.findOne({ email }); // find the email
        if (!user) 
            return res.status(400).json("Invalid email or password..."); // checks if there is a user with that email else error
        const isValidPassword = await bcrypt.compare(password, user.password); // making variable to compare the passwords from database and requested
        if (!isValidPassword) 
            return res.status(400).json("Invalid email or password...");  // checks if the password is the same as in the database with that email

        const token = createToken(user._id); // creates a jsonwebtoken
        res.status(200).json({_id: user._id, name: user.name, email, token});
    } catch(error) {
        console.log(error)
        res.status(500).json(error); // sends error so that the server wont crush
    }
};

const findUser = async (req, res) => {
    const userId = req.params.userId; // paramater from request (get)
    try {
        const user = await userModel.findById(userId); // finds user by id
        res.status(200).json(user);
    } catch(error) {
        console.log(error)
        res.status(500).json(error); // sends error so that the server wont crush
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find(); // gets all the users
        res.status(200).json(users);
    } catch(error) {
        console.log(error)
        res.status(500).json(error); // sends error so that the server wont crush
    }
}


module.exports = { registerUser, loginUser, findUser, getUsers };