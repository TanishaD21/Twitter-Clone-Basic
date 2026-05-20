const { eq, and, sql } = require('drizzle-orm');
const db = require('../db');
const { users, follows } = require('../db/schema');




// Get user profile by ID, including follower and following counts
const getUserProfile = async (req, res) => {
    try {
        // Extract the user ID from the request parameters  
        const userId = parseInt(req.params.id);

        // Fetch the user profile from the database, including follower and following counts
        const existingUser = await db.select({
            id: users.id,
            name: users.name,
            username: users.username,
            email: users.email,
            bio: users.bio,
            profileImage: users.profileImage,
            createdAt: users.createdAt,
            followersCount: sql`(
            SELECT COUNT(*)
            FROM follows
            WHERE follows.following_id = ${userId}
        )`,

        followingCount: sql`(
            SELECT COUNT(*)
            FROM follows
            WHERE follows.follower_id = ${userId}
        )`
        }).from(users)
        .where(eq(users.id, userId));

        // If the user is not found, return a 404 error
        if(existingUser.length === 0){
            return res.status(404).json({ message: "User not found"});
        }

        // Return the user profile data in the response
        return res.status(200).json({ user: existingUser[0]});

    }catch(error){
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





// Update user profile information (name, bio, profile image)
const updateUserProfile = async (req,res) => {
    try {
        // Extract the authenticated user's ID from the request object (set by auth middleware)
        const userId = req.user.id;
        console.log(req.user);

        // Extract the updated profile information from the request body
        const { name, bio, profileImage } = req.body;

        // Update the user's profile in the database with the new information
        const updateUser = await db.update(users)
        .set({
            name:name,
            bio: bio,
            profileImage: profileImage
        })
        .where(eq(users.id,userId))
        .returning();

        // If the user is not found, return a 404 error
        if(updateUser.length === 0){
            return res.status(404).json({message:"User not found"});
        }

        // Return a success response with the updated user profile data
        return res.status(200).json({ message: " User profile updates successfully!", user: updateUser[0]});
    }catch(error){
        console.error("error updating the user profile:", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};






// Follow a user by creating a new follow relationship in the database
const followUser = async (req,res) => {
    try {
        const followerId = req.user.id;
        const followingId = parseInt(req.params.id);


        if(followerId === followingId){
            return res.status(400).json({ message: " you cannot follow yourself" });
        }

        const existingFollow = await db.select().from(follows).where(
            and(
                eq(follows.followerId, followerId),
                eq(follows.followingId, followingId)
            )
        );

        if(existingFollow.length > 0) {
            return res.status(400).json({ message: " you are already following this user" });
        }

        await db
            .insert(follows)
            .values({
                followerId: followerId,
                followingId: followingId
            });
        
        res.status(200).json(
            {message: "user followed!"}
        );

    }catch(error){
        console.error("error following the user:", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};






// Unfollow a user by deleting the follow relationship from the database
const unfollowUser = async (req,res) => {
    try {

        const followerId = req.user.id;
        const followingId = parseInt(req.params.id);

        await db
            .delete(follows)
            .where(
                and(
                    eq(follows.followerId, followerId),
                    eq(follows.followingId, followingId)
                )
            );
        
            res.status(200).json({ message: "user unfollowed!" });
    }catch(error){
        console.error("error following the user:", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};





// Get the list of followers for a user by querying the follows table for users who are following the specified user
const getFollowers = async (req,res) => {
    try {
        const userId = parseInt(req.params.id);

        const followers = await db
            .select().from(follows)
            .where(eq(follows.followingId, userId));

        res.status(200).json({ followers });
    }catch(error){
        console.error("error following the user:", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};






// Get the list of users that a user is following by querying the follows table for users that the specified user is following
const getFollowing = async (req,res) => {
    try {

        const  userId = parseInt(req.params.id);

        const following = await db
            .select().from(follows)
            .where(eq(follows.followerId, userId));

        res.status(200).json({ following });
    }catch(error){
        console.error("error following the user:", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};






module.exports = {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
};
