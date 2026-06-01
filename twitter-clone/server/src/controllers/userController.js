const { eq, and, sql, desc } = require('drizzle-orm');
const db = require('../db');
const { users, follows } = require('../db/schema');




// Get user profile by ID, including follower and following counts
const getUserProfile = async (req, res) => {
    try {
        // Extract the user ID from the request object (set by auth middleware)
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ message: "You are not authenticated" });
        }
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


const getFollowingProfile = async (req, res) => {

    try {

        const followingId = Number(req.params.id);
        if(!followingId) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }
        
        const userId = req.user?.id;
        if(!userId) {
            return res.status(401).json({
                message: "You are not authenticated"
            });
        }

        // Find user
        const existingUser = await db
            .select({id: users.id,
            name: users.name,
            username: users.username,
            email: users.email,
            bio: users.bio,
            profileImage: users.profileImage,
            createdAt: users.createdAt
        })
            .from(users)
            .where(eq(users.id, followingId));

        if (existingUser.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if current user follows this profile
        const isFollowing = await db
            .select()
            .from(follows)
            .where(
                and(
                    eq(follows.followerId, userId),
                    eq(follows.followingId, followingId)
                )
            );

        if (isFollowing.length === 0) {

            existingUser[0].isFollowing = false;

            return res.status(400).json({
                message: "You are not following this user"
            });
        }

        existingUser[0].isFollowing = true;

        // Followers count
        const followersCount = await db
            .select({
                count: sql`count(*)`
            })
            .from(follows)
            .where(eq(follows.followingId, followingId));

        // Following count
        const followingCount = await db
            .select({
                count: sql`count(*)`
            })
            .from(follows)
            .where(eq(follows.followerId, followingId));

        return res.status(200).json({
            user: existingUser[0],
            followersCount: followersCount[0].count,
            followingCount: followingCount[0].count
        });

    } catch (error) {

        console.error("Error fetching user profile:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// Update user profile information (name, bio, profile image)
const updateUserProfile = async (req,res) => {
    try {
        // Extract the authenticated user's ID from the request object (set by auth middleware)
        const userId = req.user?.id;
        console.log(req.user);
        if(!userId){
            return res.status(401).json({ message: "You are not authenticated" });
        }
        // Extract the updated profile information from the request body
        const { name, username, bio, profileImage } = req.body;
        
        // Update the user's profile in the database with the new information
        const updateUser = await db.update(users)
        .set({
            name:name,
            username: username,
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
        const followerId = req.user?.id;
        const followingId = parseInt(req.params.id);

        if(!followerId){
            return res.status(401).json({ message: "You are not authenticated" });
        }

        if(!followingId){
            return res.status(400).json({ message: "Invalid user ID" });
        }

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

        const followerId = req.user?.id;
        const followingId = parseInt(req.params.id);

        if(!followerId){
            return res.status(401).json({ message: "You are not authenticated" });
        }
        if(!followingId){
            return res.status(400).json({ message: "Invalid user ID" });
        }
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
        const userId = req.user?.id;
        const id=req.query.id;
        if(!userId)
        {
            return res.status(403).json({message:"User not authenticated"});
        }
        let followers;
        if(!id)
        {
            followers=await db
                .select({username:users.username,userId:users.id,name:users.name,followingId:follows.followingId}).from(follows)
                .where(eq(follows.followingId, userId)).innerJoin(users,eq(follows.followerId,users.id)).orderBy(desc(follows.createdAt));
        }
        else{
            followers=await db
            .select({username:users.username,userId:users.id,name:users.name,followingId:follows.followingId}).from(follows)
            .where(eq(follows.followingId, id)).innerJoin(users,eq(follows.followerId,users.id)).orderBy(desc(follows.createdAt));
        }
        res.status(200).json({ followers });
    }catch(error){
        console.error("error following the user:", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};






// Get the list of users that a user is following by querying the follows table for users that the specified user is following
const getFollowing = async (req,res) => {
    try {

        const  userId = req.user.id;
        const id=req.query.id;
        if(!userId)
        {
            return res.status(403).json({message:"User not authenticated"});
        }
        const finalId=id?Number(id):userId;

        const following = await db
            .select({username:users.username,userId:users.id,name:users.name,followerId:follows.followerId}).from(follows)
            .where(eq(follows.followerId, finalId)).innerJoin(users,eq(follows.followingId,users.id)).orderBy(desc(follows.createdAt));

        res.status(200).json({ following });
    }catch(error){
        console.error("error following the user:", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};


const viewOtherProfiles=async(req,res)=>{
    try{
        const userId=req.user?.id;
        const username=req.body.username;
        if(!userId)
        {
            return res.status(403).json({message:"User not authenticated"});
        }
        if(!username)
        {
            return res.status(404).json({message:"Username not found"});
        }
        const userid=await db.select({id:users.id}).from(users).where(eq(users.username,username));
        if(userid.length===0)
        {
            return res.status(404).json({message:"Username not found"});
        }
        const existingFollow = await db
            .select()
            .from(follows)
            .where(
                and(
                    eq(follows.followerId, userId),
                    eq(follows.followingId, userid[0].id)
                )
            );
        const profile=await db.select({
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
                WHERE follows.following_id = ${userid[0].id}
            )`,
 
            followingCount: sql`(
                SELECT COUNT(*)
                FROM follows
                WHERE follows.follower_id = ${userid[0].id}
            )`,
            isFollowing: sql`${existingFollow.length > 0}`
 
        }).from(users).where(eq(users.username,username));
 
        if(profile.length===0)
        {
            return res.status(404).json({message:"Not such profile is found"});
        }
        return res.status(200).json({message:"User profile found",profile:profile[0]});
    }
    catch(error)
    {
        console.log("Error",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}



module.exports = {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowingProfile,
    viewOtherProfiles
};
