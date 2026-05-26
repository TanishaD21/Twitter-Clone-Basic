const {comments,tweets,follows}=require("../db/schema");
const db=require("../db");
const {eq,and}=require("drizzle-orm")

async function addComment(req,res)
{
    try{
        const {content}=req.body || {};
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





async function deleteComment(req,res)
{
    try{
        const userId=req.user?.id;
        const tweetId=Number(req.params.id);
        const commentId=req.body.id;
        if(!userId)
        {
            return res.status(401).json({message:"User not authenticated"});
        }
        if(!tweetId)
        {
            return res.status(400).json({message:"Tweet id not found"});
        }
        if(!commentId)
        {
            return res.status(400).json({message:"Comment id not found"});
        }
        const hasCommented=await db.select().from(comments).where(and(eq(comments.user_id,userId),eq(comments.tweet_id,tweetId)));
        if(hasCommented.length===0)
        {
            return res.status(404).json({message:"No comments found on particular tweet"});
        }
        const deletedComment=await db.delete(comments).where(eq(comments.id,commentId));
        return res.status(200).json({message:"Deleted Comment Succesfully"});
    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}





async function updateComment(req,res)
{
    try{
        const userId=req.user?.id;
        const tweetId=Number(req.params.id);
        const content=req.body.content;
        const commentId=req.body.id;
        if(!userId)
        {
            return res.status(401).json({message:"User not authenticated"});
        }
        if(!tweetId)
        {
            return res.status(400).json({message:"Tweet id not found"});
        }
        if(!commentId)
        {
            return res.status(400).json({message:"Comment id not found"});
        }
        const updatedCommented=await db.update(comments).set({comments})
    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}




async function viewOwnComment(req,res)
{
    const userId=req.user?.id;
    if(!userId)
    {
        return res.status(401).json({message:"User not authenticated"});
    }
    const viewComments=await db.select().from(comments).where(eq(comments.user_id,userId));
    if(viewComments.length===0)
    {
        return res.status(200).json({viewComments:viewComments});
    }
    return res.status(200).json({message:"View All your comments",comments:viewComments});
}





async function viewComments(req,res)
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
        if(tweet.length===0)
        {
            return res.status(404).json({message:"Tweet not found"});
        }
        const isValidUserForCommenting=await db.select().from(follows).where(and(eq(follows.followerId,userId),eq(follows.followingId,tweet[0].userId)));
        if(isValidUserForCommenting.length===0)
        {
            return res.status(403).json({message:"You can only comment on the tweet to whom you are following"});
        }
        const viewComments=await db.select().from(comments).where(eq(comments.tweet_id,tweetId));
        if(viewComments.length===0)
        {
            return res.status(200).json({comments:viewComments});
        }
        return res.status(200).json({message:"View comments on tweet",comments:viewComments});
    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
module.exports={
    addComment,deleteComment,updateComment,viewOwnComment,viewComments
}