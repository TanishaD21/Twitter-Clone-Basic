const {tweets,users,follows,likes,notifications}=require("../drizzle/schema.js");
const db = require("../config/db");
const {eq,desc,inArray,and,or}=require("drizzle-orm")


// Get notifications for the authenticated user by querying the notifications table for entries where the recipientId matches the user's ID
const getNotifications = async(req,res) => {
    try{
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({message: " you are not authenticated"});
        }
        // Fetch notifications for the authenticated user, ordered by creation date in descending order
        const data = await db
            .select({
                id: notifications.id,
                type: notifications.type,
                isRead: notifications.isRead,
                createdAt: notifications.createdAt,
                senderId: users.id,
                senderName: users.name,
                senderUsername: users.username,
                tweetId: notifications.tweetId
            })
            .from(notifications)
            .innerJoin(users,
                eq(notifications.senderId, users.id)
            )
            .where(eq(notifications.recipientId, userId))
            .orderBy(desc(notifications.createdAt));

        res.status(200).json({ success: true, notifications: data });
    }catch(error){
        console.log("Error fetching notifications",error);
        res.status(500).json({message: "Failed to fetch notifications", error: error.message});
    }
};


const markNotificationAsRead = async(req,res) => {
    try{
        const userId=req.user?.id;
        const id = Number(req.params.id);
        if(!id){
            return res.status(400).json({ message: "Invalid notification ID" });
        }
        // Update the notification with the specified ID to mark it as read by setting the isRead field to true
        await db.update(notifications)
        .set({isRead: true})
        .where(and(eq(notifications.id, id),eq(notifications.recipientId,userId)))
        .returning();

        res.status(200).json({ success: true, message: "Notification marked as read"});
    }catch(error){
        console.log("Error marking notification as read", error);
        res.status(500).json({ message: " Failed to mark notification as read", error: error.message });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead
}