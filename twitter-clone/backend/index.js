const express=require("express");
const cors=require("cors");
require("dotenv").config()
const app=express();
const userroute=require("./routes/user.js");
const tweetroute=require("./routes/tweet.js");
const likeroute=require("./routes/like.js")
const commentroute=require("./routes/comment.js");
const authroute=require("./routes/auth.js");

app.use(cors({origin: "http://localhost:5173",credentials: true,}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user',userroute);
app.use('/tweet',tweetroute);
app.use('/like',likeroute);
app.use('/comment',commentroute);
app.use('/auth',authroute);

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`);
})