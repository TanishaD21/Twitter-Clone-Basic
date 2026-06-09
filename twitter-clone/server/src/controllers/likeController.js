const {tweets,follows,likes}=require("../db/schema");
const db=require("../db");
const {eq,and}=require("drizzle-orm")

// Like a tweet
async function like(req,res)
{
    try{
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
        //Check if the tweet with the given tweetId exists in the database. If it does not exist, return a 404 Not Found response indicating that the tweet was not found.
        const tweet=await db.select().from(tweets).where(eq(tweets.id,tweetId));
        if(tweet.length===0)
        {
            return res.status(404).json({message:"Tweet not found"});
        }
        //Check if the authenticated user is the owner of the tweet or if they are following the owner of the tweet. If neither condition is true, return a 403 Forbidden response indicating that the user can only like tweets from users they are following.
        const isTweetOwner = tweet[0].userId === userId;
        const isValidUserForPerformingLike=await db.select().from(follows).where(and(eq(follows.followerId,userId),eq(follows.followingId,tweet[0].userId)));
        if(!isTweetOwner && isValidUserForPerformingLike.length===0)
        {
            return res.status(403).json({message:"You can only like on the tweet to whom you are following"});
        }

        // Check if the user has already liked the tweet by querying the likes table for a record that matches the userId and tweetId. If a record is found, return a 200 OK response indicating that the user has already liked the tweet. If no record is found, proceed to add a new like to the database.
        const existingLike=await db.select().from(likes).where(and(eq(likes.tweetId,tweetId),eq(likes.userId,userId)));
        if(existingLike.length>0)
        {
            return res.status(200).json({message:"You have already liked the tweet"});
        }
        const newLike=await db.insert(likes).values({tweetId:tweetId,userId:userId}).returning();
        return res.status(200).json({message:"Added like successfully",like:newLike[0]});
    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}





// Unlike a tweet
async function unlike(req,res)
{
    try{
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
        //Check if the tweet with the given tweetId exists in the database. If it does not exist, return a 404 Not Found response indicating that the tweet was not found.
        const tweet=await db.select().from(tweets).where(eq(tweets.id,tweetId));
        if(tweet.length===0)
        {
            return res.status(404).json({message:"Tweet not found"});
        }
        //Check if the authenticated user is the owner of the tweet or if they are following the owner of the tweet. If neither condition is true, return a 403 Forbidden response indicating that the user can only unlike tweets from users they are following.
        const isTweetOwner = tweet[0].userId === userId;
        const isValidUserForPerformingUnLike=await db.select().from(follows).where(and(eq(follows.followerId,userId),eq(follows.followingId,tweet[0].userId)));
        if(!isTweetOwner && isValidUserForPerformingUnLike.length===0)
        {
            return res.status(403).json({message:"You can only unlike on the tweet to whom you are following"});
        }
        // Check if the user has already liked the tweet by querying the likes table for a record that matches the userId and tweetId. If no record is found, return a 404 Not Found response indicating that the user has not liked the tweet. If a record is found, proceed to remove the like from the database.
        const hasLiked=await db.select().from(likes).where(and(eq(likes.userId,userId),eq(likes.tweetId,tweetId)));
        if(hasLiked.length===0)
        {
            return res.status(404).json({message:"You have not liked the tweet"});
        }
        const unliked=await db.delete(likes).where(and(eq(likes.userId,userId),eq(likes.tweetId,tweetId)));
        return res.status(200).json({message:"Tweet Unliked Successfully"});
    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports={
    like,unlike
}