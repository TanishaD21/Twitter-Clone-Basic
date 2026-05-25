const express=require("express");

const {
    createTweet,
    deleteTweet,
    viewOurTweets,
    updateTweet,
    viewAllTweets}=require("../controllers/tweetController.js");

const authMiddleware=require("../middleware/authMiddleware.js");

const router=express.Router();

// Tweet creation route
router.post('/',authMiddleware,createTweet);

// Tweet deletion route
router.delete('/:id',authMiddleware,deleteTweet);

// Tweet update route
router.patch('/:id',authMiddleware,updateTweet);

// Get our tweets route
router.get('/view',authMiddleware,viewOurTweets);

// Get all tweets route
router.get('/',authMiddleware,viewAllTweets);

module.exports=router;