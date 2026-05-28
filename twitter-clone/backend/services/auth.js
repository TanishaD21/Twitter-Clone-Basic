const db=require("../config/db.js");
const {users}=require("../drizzle/schema.js");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const {eq,or}=require("drizzle-orm")

const secret=process.env.JWT_SECRET;

// This function is registered function which is used for signing up user.
async function register(req,res)
{
    // Name,username,email,password are required fields.
    const {name,username,email,password}=req.body || {};
    // If any of the required fields are not present then it will throw the error.
    if(!name || !username || !email || !password)
    {
        return res.status(400).json({message:"All fields are required"});
    }
    // If user already exists it will give user already exists message.
    const existinguser=await db.select().from(users).where(or(eq(users.username,username),eq(users.email,email)));
    if(existinguser.length>0)
    {
        return res.status(409).json({message:"User already exists"});
    }
    // Hashed the password using bcrypt with salting value as 10.
    const hashedPassword=await bcrypt.hash(password,10);
    // Added the user into the database.
    const createdUser=await db.insert(users).values({
        name,
        username,
        email,
        password:hashedPassword
    }).returning();
    // Created the jwt token while signing up so that users logins directly.
    const token=jwt.sign(
        {
            id:createdUser[0].id,
            username:createdUser[0].username,
            email:createdUser[0].email
        },secret);
    return res.status(201).json({message:"User created successfully",user:createdUser[0],token});
}

async function login(req,res)
{
    try{
        const {username,password}=req.body || {};
        if(!username || !password)
        {
            return res.status(400).json({message:"Enter both the username and password"});
        }
        const foundUser=await db.select().from(users).where(eq(users.username,username));
        if(foundUser.length==0)
        {
            return res.status(401).json({message:"Invalid credentials"});
        }
        const isPasswordValid=await bcrypt.compare(password,foundUser[0].password);
        if(!isPasswordValid)
        {
            return res.status(401).json({message:"Invalid Credentials"});
        }
        const token=jwt.sign({
            id:foundUser[0].id,
            username:foundUser[0].username,
            email:foundUser[0].email
        },secret);
        return res.status(200).json({message:"Login Successful",user:foundUser[0],token});
    }
    catch(error)
    {
        return res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports={
    register,login
}