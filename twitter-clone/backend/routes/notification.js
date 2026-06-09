const express=require("express")
const {getNotifications,markNotificationAsRead}=require("../controllers/notification.js");
const {createNotification}=require("../services/notification.js");
const authenticationMiddleware=require("../middlewares/auth.js")

const router = express.Router();

router.get('/', authenticationMiddleware, getNotifications);

router.patch('/:id/read', authenticationMiddleware, markNotificationAsRead);


module.exports = router;