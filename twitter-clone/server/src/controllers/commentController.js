const { tweets, users, follows, comments }= require("../db/schema.js");
const db = require("../db");
const { eq, desc, and , or }=require("drizzle-orm");

async function addComment(req,res)
{
    try{
        const {content}=req.body||[];
        const userId=req.user?.id;
        const tweetId=Number(req.params.id);
        if(!userId)
        {
            return res.status(401).json({message:"User not authenticated"});
        }
        if(!tweetId)
        {
            return res.status(400).json({message:"Tweet id not found"});
        }
        const trimmed=content.trim();
        if(trimmed.length===0)
        {
            return res.status(400).json({message:"Content in comment should not be empty"})
        }
        const tweet=await db.select().from(tweets).where(eq(tweets.id,tweetId));
        if(tweet.length===0)
        {
            return res.status(404).json({message:"Tweet not found"});
        }
        const isValidUserForCommenting=await db.select().from(follows).where(and(eq(follows.followerId,userId),eq(follows.followingId,tweet[0].userId)));
        if(isValidUserForCommenting.length===0)
        {
            return res.status(403).json({message:"You can only comment on the tweet to whom you are following"});
        }
        const newComment=await db.insert(comments).values({tweet_id:tweetId,user_id:userId,content:trimmed}).returning();
        return res.status(201).json({message:"Comment Added successfully",comment:newComment[0]});
    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports={
    addComment
}