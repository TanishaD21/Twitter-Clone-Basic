const db = require("../db");
const { notifications } = require("../db/schema");
const { eq, desc } = require("drizzle-orm");


// Get notifications for the authenticated user by querying the notifications table for entries where the recipientId matches the user's ID
const getNotifications = async(req,res) => {
    try{
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({message: " you are not authenticated"});
        }
        // Fetch notifications for the authenticated user, ordered by creation date in descending order
        const data = await db.select()
        .from(notifications)
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
        const id = Number(req.params.id);
        if(!id){
            return res.status(400).json({ message: "Invalid notification ID" });
        }
        // Update the notification with the specified ID to mark it as read by setting the isRead field to true
        await db.update(notifications)
        .set({isRead: true})
        .where(eq(notifications.id, id))
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