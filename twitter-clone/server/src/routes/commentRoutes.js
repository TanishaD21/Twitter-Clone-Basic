const express=require("express")
const {addComment,deleteComment,updateComment,viewOwnComment,viewComments}=require("../controllers/commentController.js");
const authenticationMiddleware=require("../middleware/authMiddleware.js")
const router=express.Router();

//Add comment route which takes id of the tweet
router.post('/:id',authenticationMiddleware,addComment);

//Delete comment route which takes 
router.delete('/:id',authenticationMiddleware,deleteComment);
router.patch('/:id',authenticationMiddleware,updateComment);
router.get('/',authenticationMiddleware,viewOwnComment);
router.get('/:id',authenticationMiddleware,viewComments);
module.exports=router