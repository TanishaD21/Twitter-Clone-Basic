const {comments,tweets,follows,likes}=require("../drizzle/schema.js");
const db=require("../config/db.js");
const {eq,desc,or,and}=require("drizzle-orm")

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
        const tweet=await db.select().from(tweets).where(eq(tweets.id,tweetId));
        const tweetOwnerId=tweet[0].userId;
        if(tweet.length==0)
        {
            return res.status(404).json({message:"Tweet not found"});
        }
        const isValidUserForPerformingLike=await db.select().from(follows).where(and(eq(follows.followerId,userId),eq(follows.followingId,tweet[0].userId)));
        if(isValidUserForPerformingLike.length==0)
        {
            return res.status(403).json({message:"You can only like on the tweet to whom you are following"});
        }
        const existingLike=await db.select().from(likes).where(and(eq(likes.tweet_id,tweetId),eq(likes.user_id,userId)));
        if(existingLike.length>0)
        {
            return res.status(200).json({message:"You have already liked the tweet"});
        }
        const newLike=await db.insert(likes).values({tweet_id:tweetId,user_id:userId}).returning();
        await createNotification({
            recipientId: tweetOwnerId,
            senderId: req.user.id,
            type: "LIKE",
            tweetId,
        });
        return res.status(200).json({message:"Added like successfully",like:newLike[0]});
    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

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
        const tweet=await db.select().from(tweets).where(eq(tweets.id,tweetId));
        if(tweet.length==0)
        {
            return res.status(404).json({message:"Tweet not found"});
        }
        const isValidUserForPerformingUnLike=await db.select().from(follows).where(and(eq(follows.followerId,userId),eq(follows.followingId,tweet[0].userId)));
        if(isValidUserForPerformingUnLike.length==0)
        {
            return res.status(403).json({message:"You can only unlike on the tweet to whom you are following"});
        }
        const hasLiked=await db.select().from(likes).where(and(eq(likes.user_id,userId),eq(likes.tweet_id,tweetId)));
        if(hasLiked.length==0)
        {
            return res.status(404).json({message:"You have not liked the tweet"});
        }
        const unliked=await db.delete().from(likes).where(and(eq(likes.user_id,userId),eq(likes.tweet_id,tweetId)));
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