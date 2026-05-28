const express=require("express")
const {getNotifications,markNotificationAsRead,createNotification}=require("../controllers/notification.js");
const authenticationMiddleware=require("../middlewares/auth.js")

const router = express.Router();

router.get('/', authenticationMiddleware, getNotifications);

router.patch('/:id/read', authenticationMiddleware, markNotificationAsRead);

router.post('/test', authenticationMiddleware, async (req, res) => {
    try {
        await createNotification({
            recipientId: 1,
            senderId: req.user.id,
            type: "TEST",
            tweetId: 1,
        });

        res.status(200).json({
            success: true,
            message: "Test notification created successfully"
        });

    } catch(error) {
        console.log("Error testing notification route", error);
        res.status(500).json({
            success: false,
            message: "Failed to create test notification"
        });
    }
});

module.exports = router;