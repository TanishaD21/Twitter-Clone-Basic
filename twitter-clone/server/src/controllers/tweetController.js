const { tweets,users, likes, comments, follows }= require("../db/schema.js");
const db = require("../db");
const { eq, desc, inArray  }=require("drizzle-orm");

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
        const id=Number(req.params.id);
        const userId=req.user?.id;
        if(!id)
        {
            return res.status(400).json({message:"Tweet id not found"});
        }
        if(!userId)
        {
            return res.status(401).json({message:"User not authenticated"})
        }
        //Check if the tweet with the given id exists in the database. If it does not exist, return a 404 Not Found response indicating that the tweet was not found.
        const existingTweet=await db.select().from(tweets).where(eq(tweets.id,id));
        if(existingTweet.length===0)
        {
            return res.status(404).json({message:"Tweet not found"});
        }
        if(existingTweet[0].userId!==userId)
        {
            return res.status(403).json({message:"You can only delete your own tweets"});
        }
        await db.delete(tweets).where(eq(tweets.id,id)).returning();
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
    // Fetch all tweets posted by the authenticated user from the database, ordered by creation date in descending order (newest first)
    const viewTweets = await db
        .select({
            id: tweets.id,
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
    // Extract the tweet IDs from the fetched tweets to use in subsequent queries for likes and comments related to these tweets.
    const ids = viewTweets.map((tweet) => tweet.id);
 
    const tweetLikes = await db
        .select({
            likeId: likes.id,
            id: likes.tweetId,
            likerId: users.id,
            likerUsername: users.username,
            likerName: users.name,
            likedAt: likes.createdAt,
        })
        .from(likes)
        .innerJoin(users, eq(likes.userId, users.id))
        .where(inArray(likes.tweetId, ids))
        .orderBy(desc(likes.createdAt));

    const tweetComments = await db.select({
            tweetId:comments.tweetId,
        })
        .from(comments)
        .where(inArray(comments.tweetId, ids));
 
    const likesMap = {};
 
    for (const like of tweetLikes) {
        if (!likesMap[like.id]) {
            likesMap[like.id] = [];
        }
 
        likesMap[like.id].push({
            likeId: like.likeId,
            userId: like.likerId,
            name: like.likerName,
            username: like.likerUsername,
            likedAt: like.likedAt,
        });
    }
    
    
    const commentsMap = {};

        for (const comment of tweetComments) {

            if (!commentsMap[comment.tweetId]) {
                commentsMap[comment.tweetId] = 0;
            }

            commentsMap[comment.tweetId]++;
        }
 
    const result = viewTweets.map((tweet) => ({
        ...tweet,
        likesCount: (likesMap[tweet.id] || []).length,
        commentsCount: (commentsMap[tweet.id] || 0),
        likes: likesMap[tweet.id] || [],
        likedByCurrentUser: (likesMap[tweet.id] || []).some(
            (like) => like.userId === userId
),
    }));
 
    return res.status(200).json({
        message: "View User Tweets",
        tweets: result,
    });
} 


// This is the update tweet function where the user can update their own tweets.
async function updateTweet(req,res)
{
    const {newContent}=req.body || {};
    const userId=req.user?.id;
    const id=Number(req.params.id);
    if(!userId)
    {
        return res.status(401).json({message:"User not authenticated"});
    }
    if(!id)
    {
        return res.status(400).json({message:"Tweet not found"});
    }
    const existingTweet=await db.select().from(tweets).where(eq(tweets.id,id));
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
    const updatedTweet=await db.update(tweets).set({content:newContent.trim(),updatedAt:new Date()}).where(eq(tweets.id,id)).returning();
    return res.status(200).json({message:"Content changed successfully",Updated_Content:updatedTweet[0]});
}


// This is the view all tweets function where the user can see all the tweets posted by all the users.
async function viewAllTweets(req, res) {
    try {
        const userId = req.user?.id;

        const viewAllTweets = await db
            .select({
                id: tweets.id,
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

        const ids = viewAllTweets.map((tweet) => tweet.id);
    
        const tweetLikes = await db
            .select({
                likeId: likes.id,
                id: likes.tweetId,
                likerId: users.id,
                likerUsername: users.username,
                likerName: users.name,
                likedAt: likes.createdAt,
            })
            .from(likes)
            .innerJoin(users, eq(likes.userId, users.id))
            .where(inArray(likes.tweetId, ids))
            .orderBy(desc(likes.createdAt));


        const tweetComments = await db.select({
            tweetId:comments.tweetId,
        })
        .from(comments)
        .where(inArray(comments.tweetId, ids));
    
        const likesMap = {};
    
        for (const like of tweetLikes) {
            if (!likesMap[like.id]) {
                likesMap[like.id] = [];
            }
    
            likesMap[like.id].push({
                likeId: like.likeId,
                userId: like.likerId,
                name: like.likerName,
                username: like.likerUsername,
                likedAt: like.likedAt,
            });
        }
    
        const commentsMap = {};

        for (const comment of tweetComments) {

            if (!commentsMap[comment.tweetId]) {
                commentsMap[comment.tweetId] = 0;
            }

            commentsMap[comment.tweetId]++;
        }
        
        const result = viewAllTweets.map((tweet) => ({
            ...tweet,
            likesCount: (likesMap[tweet.id] || []).length,
            commentsCount: (commentsMap[tweet.id] || 0),
            likes: likesMap[tweet.id] || [],
            likedByCurrentUser: (likesMap[tweet.id] || []).some(
                (like) => like.userId === userId
                ),
        }));
    
        return res.status(200).json({
            message: "View All User Tweets",
            tweets: result,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

async function viewFollowingTweets(req,res)
{
    try{
        const userId=req.user?.id;
        if(!userId)
        {
            return res.status(403).json({message:"User not authenticated"});
        }
 
        const viewAllTweets=await db.select({id:tweets.id,content:tweets.content,createdAt:tweets.createdAt,userId:users.id,name:users.name,username:users.username}).from(tweets).innerJoin(users,eq(tweets.userId,users.id)).innerJoin(follows,eq(follows.followingId,tweets.userId)).where(eq(follows.followerId,userId)).orderBy(desc(tweets.createdAt));
        if(viewAllTweets.length===0)
        {
            return res.status(200).json({message:"No tweets found"})
        }

        const ids = viewAllTweets.map((tweet) => tweet.id);
    
        const tweetLikes = await db
            .select({
                likeId: likes.id,
                id: likes.tweetId,
                likerId: users.id,
                likerUsername: users.username,
                likerName: users.name,
                likedAt: likes.createdAt,
            })
            .from(likes)
            .innerJoin(users, eq(likes.userId, users.id))
            .where(inArray(likes.tweetId, ids))
            .orderBy(desc(likes.createdAt));


        const tweetComments = await db.select({
            tweetId:comments.tweetId,
        })
        .from(comments)
        .where(inArray(comments.tweetId, ids));
    
        const likesMap = {};
    
        for (const like of tweetLikes) {
            if (!likesMap[like.id]) {
                likesMap[like.id] = [];
            }
    
            likesMap[like.id].push({
                likeId: like.likeId,
                userId: like.likerId,
                name: like.likerName,
                username: like.likerUsername,
                likedAt: like.likedAt,
            });
        }
    
        const commentsMap = {};

        for (const comment of tweetComments) {

            if (!commentsMap[comment.tweetId]) {
                commentsMap[comment.tweetId] = 0;
            }

            commentsMap[comment.tweetId]++;
        }

        const result = viewAllTweets.map((tweet) => ({
            ...tweet,
            likesCount: (likesMap[tweet.id] || []).length,
            commentsCount: (commentsMap[tweet.id] || 0),
            likes: likesMap[tweet.id] || [],
            likedByCurrentUser: (likesMap[tweet.id] || []).some(
                (like) => like.userId === userId
                ),
        }));
    
        return res.status(200).json({
            message: "View Following User Tweets",
            tweets: result,
        });

    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


module.exports={
    createTweet,deleteTweet,viewOurTweets,updateTweet,viewAllTweets,viewFollowingTweets
};