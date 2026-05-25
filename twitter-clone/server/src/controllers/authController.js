const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { eq } = require("drizzle-orm");
const db = require("../db");
const { users } = require("../db/schema");




// Register a new user
const registerUser = async (req,res) => {
    try {
        const { name, username, email, password } = req.body;

        // Validate input fields
        if(!name || ! username || !email || !password){
            return res.status(400).json({ message: "Fill all the fields"});
        }

        // Check if the user already exists
        const existingUser = await db.select().from(users).where(eq(users.email,email));

        if(existingUser.length > 0){
            return res.status(400).json({ message:"User already exists"});
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const newUser = await db.insert(users).values({
            name,
            username,
            email,
            password: hashedPassword
        })
        .returning();

        // Generate a JWT token for the newly registered user
        const token = jwt.sign({ id: newUser[0].id, email: newUser[0].email}, process.env.JWT_SECRET,{ expiresIn: "7d" });

        res.status(201).json({
            message: "User registered!",
            token,
            user: {
                id: newUser[0].id,
                name: newUser[0].name,
                username: newUser[0].username,
                email: newUser[0].email
            }
        });


    }catch (error){
        // Handle any errors that occur during registration
        res.status(500).json({message: "Server error", error: error.message});
    }
};








// Login an existing user
const loginUser = async (req,res) => {
    try {
        const { email,password } = req.body;

        // Validate input fields
        if(!email || !password){
            return res.status(400).json({ message: "Fill all the fields"});
        }

        // Check if the user exists in the database
        const existingUser = await db.select().from(users).where(eq(users.email,email));

        // If the user does not exist, return an error response
        if(existingUser.length === 0){
            return res.status(400).json({ message: "Invalid credentials"});
        }

        const user = existingUser[0];

        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials"});
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ id: user.id, email: user.email}, process.env.JWT_SECRET,{ expiresIn: "7d" });

        // Return a success response with the generated token and user information
        res.status(200).json({message: "Login succesful!", token, user: {
                                                                            id: user.id,
                                                                            name: user.name,
                                                                            username: user.username,
                                                                            email: user.email
                                                                        }});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};








// Get the profile of the authenticated user
const getProfile = async (req,res) => {
    try {
        // Retrieve the authenticated user's information from the database using their ID
        const existingUser = await db.select().from(users).where(eq(users.id,req.user.id));
    
        if(existingUser.length === 0){
            return res.status(404).json({ message: "User not found"});
        }

        return res.status(200).json({ user: existingUser[0]});
    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
};






module.exports ={
    registerUser,
    loginUser,
    getProfile
};

