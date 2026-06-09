const {comments,tweets,follows, users}=require("../db/schema");
const db=require("../db");
const {eq,and, desc}=require("drizzle-orm")

//Add comment on a tweet
async function addComment(req,res)
{
    try{
        //Extract content from request body, userId from authenticated user, and tweetId from request parameters
        const {content}=req.body || {};
        const userId=req.user?.id;
        const tweetId=Number(req.params.id);
        // Validate the presence of userId, tweetId, and content. If any of these are missing or invalid, return appropriate error responses.
        if(!userId)
        {
            return res.status(401).json({message:"User not authenticated"});
        }
        if(!tweetId)
        {
            return res.status(400).json({message:"Tweet id not found"});
        }
        // Validate that the content is not empty or just whitespace. If it is, return a 400 Bad Request response indicating that the content should not be empty.
        const trimmed=content.trim();
        if(trimmed.length===0)
        {
            return res.status(400).json({message:"Content in comment should not be empty"})
        }
        // Check if the tweet with the given tweetId exists in the database. If it does not exist, return a 404 Not Found response indicating that the tweet was not found.
        const tweet=await db.select().from(tweets).where(eq(tweets.id,tweetId));
        if(tweet.length===0)
        {
            return res.status(404).json({message:"Tweet not found"});
        }
        // Check if the authenticated user is the owner of the tweet or if they are following the owner of the tweet. If neither condition is true, return a 403 Forbidden response indicating that the user can only comment on tweets from users they are following.
        const isTweetOwner = tweet[0].userId === userId;
        const isValidUserForCommenting=await db.select().from(follows).where(and(eq(follows.followerId,userId),eq(follows.followingId,tweet[0].userId)));

        // If the user is authorized to comment, insert the new comment into the database with the associated tweetId, userId, and content. Return a 201 Created response with a success message and the newly created comment.
        if(!isTweetOwner && isValidUserForCommenting.length===0)
        {
            return res.status(403).json({message:"You can only comment on the tweet to whom you are following"});
        }
        // Insert the new comment into the database with the associated tweetId, userId, and content. Return a 201 Created response with a success message and the newly created comment.
        const newComment=await db.insert(comments).values({tweetId:tweetId,userId:userId,content:trimmed}).returning();
        return res.status(201).json({message:"Comment Added successfully",comment:newComment[0]});
    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}




//Delete comment on a tweet
async function deleteComment(req,res)
{
    try{
        //Extract userId from authenticated user, tweetId from request parameters, and commentId from request body
        const userId=req.user?.id;
        const tweetId=Number(req.params.id);
        const commentId=req.body.id;
        //Validate the presence of userId, tweetId, and commentId.
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

        //Check if the user has commented on the tweet by querying the comments table with the provided commentId, userId, and tweetId. If no matching comment is found, return a 404 Not Found response indicating that no comments were found on the particular tweet.
        const hasCommented=await db
            .select()
            .from(comments)
            .where(
                and(
                    eq(comments.id,commentId),
                    eq(comments.userId,userId),
                    eq(comments.tweetId,tweetId
                    )));

        //If a matching comment is found, proceed to delete the comment from the database using the provided commentId. Return a 200 OK response with a success message indicating that the comment was deleted successfully.
        if(hasCommented.length===0)
        {
            return res.status(404).json({message:"No comments found on particular tweet"});
        }
        
        await db.delete(comments).where(eq(comments.id,commentId));

        return res.status(200).json({message:"Deleted Comment Succesfully"});
    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}




//update comment on a tweet
async function updateComment(req,res)
{
    try{
        //Extract userId from authenticated user, tweetId from request parameters, commentId and content from request body
        const userId=req.user?.id;
        const tweetId=Number(req.params.id);
        const content=req.body.content;
        const commentId=req.body.id;
        //Validate the presence of userId, tweetId, commentId, and content. If any of these are missing or invalid, return appropriate error responses.
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
        if(!content){
            return res.status(400).json({message:"Content is required"});
        }
        //Validate that the content is not empty or just whitespace. If it is, return a 400 Bad Request response indicating that the content should not be empty.
        const trimmed= content.trim();

        if(trimmed.length === 0){
            return res.status(400).json({message:"Comment cannot be empty"});
        }

        //Check if the user has commented on the tweet by querying the comments table with the provided commentId, userId, and tweetId. If no matching comment is found, return a 404 Not Found response indicating that no such comment was found.
        const existingComment = await db.select().from(comments).where(
            and(
                eq(comments.id, commentId),
                eq(comments.userId, userId),
                eq(comments.tweetId,tweetId)
            )
        );

        if(existingComment.length === 0){
            return res.status(404).json({message: " No such comment found"});
        }

        //If a matching comment is found, proceed to update the content of the comment in the database using the provided commentId. Return a 200 OK response with a success message and the updated comment.
        const updatedCommented=await db.update(comments)
        .set({
            content:trimmed,
            updatedAt: new Date()
        })
        .where(
            eq(comments.id,commentId)
        ).returning();

        return res.status(200).json({message:"Comment updated successfully", comment:updatedCommented[0]});
    }
    catch(error)
    {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}



//View your own comment
async function viewOwnComment(req,res)
{
    const userId=req.user?.id;
    if(!userId)
    {
        return res.status(401).json({message:"User not authenticated"});
    }
    //Fetch all comments made by the authenticated user by querying the comments table and joining it with the users table to retrieve the username. The results are ordered by the createdAt timestamp in descending order. If no comments are found, return a 200 OK response with an empty array. Otherwise, return a 200 OK response with a success message and the list of comments made by the user.
    const viewComments=await db
    .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        username: users.username,
        userId: users.id,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId,users.id))
    .where(eq(comments.userId,userId))
    .orderBy(desc(comments.createdAt));

    // If no comments are found, return a 200 OK response with an empty array. Otherwise, return a 200 OK response with a success message and the list of comments made by the user.
    if(viewComments.length===0)
    {
        return res.status(200).json({viewComments:viewComments});
    }
    return res.status(200).json({message:"View All your comments",comments:viewComments});
}



// View comments on a tweet
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

        //Check if the tweet with the given tweetId exists in the database. If it does not exist, return a 404 Not Found response indicating that the tweet was not found.
        const tweet=await db.select().from(tweets).where(eq(tweets.id,tweetId));

        if(tweet.length===0)
        {
            return res.status(404).json({message:"Tweet not found"});
        }

        //Check if the authenticated user is the owner of the tweet or if they are following the owner of the tweet. If neither condition is true, return a 403 Forbidden response indicating that the user can only view comments on tweets from users they are following.
        const isTweetOwner = tweet[0].userId === userId;
        const isValidUserForCommenting=await db.select().from(follows).where(and(eq(follows.followerId,userId),eq(follows.followingId,tweet[0].userId)));

        if(!isTweetOwner && isValidUserForCommenting.length===0)
        {
            return res.status(403).json({message:"You can only comment on the tweet to whom you are following"});
        }

        //If the user is authorized to view comments, fetch all comments on the specified tweet by querying the comments table and joining it with the users table to retrieve the username of each commenter. The results are ordered by the createdAt timestamp in descending order. If no comments are found, return a 200 OK response with an empty array. Otherwise, return a 200 OK response with a success message and the list of comments on the tweet.
        const viewComments=await db
        .select({
            id:comments.id,
            content:comments.content,
            createdAt:comments.createdAt,
            username:users.username,
            userId:users.id
        })
        .from(comments)
        .innerJoin(users,eq(comments.userId,users.id))
        .where(eq(comments.tweetId,tweetId))
        .orderBy(desc(comments.createdAt));

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