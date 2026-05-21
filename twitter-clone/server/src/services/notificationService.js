const db = require("../db");
const { notifications } = require("../db/schema");

const createNotification = async( recipientId, senderId, type, tweetId = null) => {
    try{
        if(recipientId === senderId){
            return;
        }

        await db.insert(notifications).values({
            recipientId,
            senderId,
            type,
            tweetId,
        }).returning();

        

    }catch(error){
        console.log("Notification Error", error);
        
    }
};

module.exports = {
    createNotification
}