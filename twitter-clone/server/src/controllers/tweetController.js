const { tweets,users, likes }= require("../db/schema.js");
const db = require("../db");
const { eq, desc, inArray }=require("drizzle-orm");

// This is the create tweet function where user is able to create tweet.
async function createTweet(req,res)
{
    try{
        const {content}=req.body;
        const userId=req.user?.id;
        if(!userId)
        {
            return res.status(401).json({message:"User not authenticated"});
        }
        // If no text is there in the content the tweet will not be posted.
        const trimmed=content.trim();
        if(!trimmed)
        {
            return res.status(400).json({message:"Content is required in the tweet"});
        }
        const insertedTweet=await db.insert(tweets).values({content:trimmed,userId:userId}).returning();

        return res.status(201).json({message:"Tweet created successfully",tweet: insertedTweet[0]});
    }
    catch(error)
    {
        console.log("Tweet Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
};

// This is the delete tweet function where the user can delete their own tweets.
async function deleteTweet(req,res)
{
    try{
        const tweetId=Number(req.params.id);
        const userId=req.user?.id;
        if(!tweetId)
        {
            return res.status(400).json({message:"Tweet id not found"});
        }
        if(!userId)
        {
            return res.status(401).json({message:"User not authenticated"})
        }
        const existingTweet=await db.select().from(tweets).where(eq(tweets.id,tweetId));
        if(existingTweet.length===0)
        {
            return res.status(404).json({message:"Tweet not found"});
        }
        if(existingTweet[0].userId!==userId)
        {
            return res.status(403).json({message:"You can only delete your own tweets"});
        }
        await db.delete(tweets).where(eq(tweets.id,tweetId)).returning();
        return res.status(200).json({message:"Tweet deleted successfully"});
    }
    catch(error)
    {
        console.log("Error",error);
    }
}


// This is the view our tweets function where the user can see all the tweets posted by them.
async function viewOurTweets(req, res) {
    const userId = req.user?.id;
 
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
 
    const viewTweets = await db
        .select({
            tweetId: tweets.id,
            content: tweets.content,
            createdAt: tweets.createdAt,
            updatedAt: tweets.updatedAt,
        })
        .from(tweets)
        .where(eq(tweets.userId, userId))
        .orderBy(desc(tweets.createdAt));
 
    if (viewTweets.length === 0) {
        return res.status(200).json({ tweets: viewTweets});
    }
 
    const tweetIds = viewTweets.map((tweet) => tweet.tweetId);
 
    const tweetLikes = await db
        .select({
            likeId: likes.id,
            tweetId: likes.tweet_id,
            likerId: users.id,
            likerUsername: users.username,
            likerName: users.name,
            likedAt: likes.createdAt,
        })
        .from(likes)
        .innerJoin(users, eq(likes.user_id, users.id))
        .where(inArray(likes.tweet_id, tweetIds))
        .orderBy(desc(likes.createdAt));
 
    const likesMap = {};
 
    for (const like of tweetLikes) {
        if (!likesMap[like.tweetId]) {
            likesMap[like.tweetId] = [];
        }
 
        likesMap[like.tweetId].push({
            likeId: like.likeId,
            userId: like.likerId,
            name: like.likerName,
            username: like.likerUsername,
            likedAt: like.likedAt,
        });
    }
 
    const result = viewTweets.map((tweet) => ({
        ...tweet,
        likesCount: (likesMap[tweet.tweetId] || []).length,
        likes: likesMap[tweet.tweetId] || [],
    }));
 
    return res.status(200).json({
        message: "View All User Tweets",
        tweets: result,
    });
} 


// This is the update tweet function where the user can update their own tweets.
async function updateTweet(req,res)
{
    const {newContent}=req.body || {};
    const userId=req.user?.id;
    const tweetId=Number(req.params.id);
    if(!userId)
    {
        return res.status(401).json({message:"User not authenticated"});
    }
    if(!tweetId)
    {
        return res.status(400).json({message:"Tweet not found"});
    }
    const existingTweet=await db.select().from(tweets).where(eq(tweets.id,tweetId));
    if(existingTweet.length===0)
    {
        return res.status(404).json({message:"Tweet not found"});
    }
    if(existingTweet[0].userId!==userId)
    {
        return res.status(403).json({message:"You can only update your own tweets"});
    }
    const trimmed=newContent.trim();
    if(!trimmed)
    {
        return res.status(400).json({message:"The tweet cannot be empty. Add some content in it"});
    }
    const updatedTweet=await db.update(tweets).set({content:newContent.trim(),updatedAt:new Date()}).where(eq(tweets.id,tweetId)).returning();
    return res.status(200).json({message:"Content changed successfully",Updated_Content:updatedTweet[0]});
}


// This is the view all tweets function where the user can see all the tweets posted by all the users.
async function viewAllTweets(req, res) {
    try {
        const viewAllTweets = await db
            .select({
                tweetId: tweets.id,
                content: tweets.content,
                createdAt: tweets.createdAt,
                userId: users.id,
                name: users.name,
                username: users.username
            })
            .from(tweets)
            .innerJoin(users, eq(tweets.userId, users.id))
            .orderBy(desc(tweets.createdAt)); // Order tweets by creation date in descending order (newest first)

        if (viewAllTweets.length === 0) {
            return res.status(200).json({
                message: "No tweets found"
            });
        }

        return res.status(200).json({
            message: "View All Tweets",
            AllTweets: viewAllTweets
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports={
    createTweet,deleteTweet,viewOurTweets,updateTweet,viewAllTweets
};