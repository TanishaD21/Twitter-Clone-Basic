const db=require("../config/db.js");
const {notifications}=require("../drizzle/schema.js");
const validTypes = [
            "FOLLOW",
            "LIKE",
            "COMMENT",
            "MENTION",
            "TEST"
        ];

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
        if(!validTypes.includes(type)){
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