const db=require("../config/db.js");
const {notifications}=require("../drizzle/schema.js");


const createNotification = async ({
    recipientId,
    senderId,
    type,
    tweetId = null
}) => {
    try {
        if(recipientId === senderId){
            return;
        }

        await db.insert(notifications).values({
            recipientId,
            senderId,
            type,
            tweetId,
        });

    } catch(error){
        console.log("Notification Error", error);
    }
};

module.exports={
    createNotification
}