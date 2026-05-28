const express=require("express")
const {createTweet,deleteTweet,updateTweet,viewOurTweets,viewTweetsByUsername,viewAllTweets}=require("../controllers/tweet.js")
const authenticationMiddleware=require("../middlewares/auth.js")
const router=express.Router();

router.post('/',authenticationMiddleware,createTweet);
router.delete('/:id',authenticationMiddleware,deleteTweet);
router.patch('/:id',authenticationMiddleware,updateTweet);
router.get('/view',authenticationMiddleware,viewOurTweets);
router.get('/:username',authenticationMiddleware,viewTweetsByUsername);
router.get('/',authenticationMiddleware,viewAllTweets);

module.exports=router