const express = require('express');
const { getNotifications, markNotificationAsRead } = require('../controllers/notificationController');
const authMiddleware  = require('../middleware/authMiddleware');
const { createNotification } = require('../services/notificationService');

const router = express.Router();


router.get('/', authMiddleware, getNotifications);

router.patch('/:id/read', authMiddleware, markNotificationAsRead);

router.post('/test', authMiddleware, async (req, res) => {

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