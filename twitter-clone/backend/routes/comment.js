const express=require("express")
const {addComment,deleteComment,updateComment,viewOwnComment,viewComments}=require("../controllers/comment.js");
const authenticationMiddleware=require("../middlewares/auth.js")
const router=express.Router();

router.post('/:id',authenticationMiddleware,addComment);
router.delete('/:id',authenticationMiddleware,deleteComment);
router.post('/:id',authenticationMiddleware,updateComment);
router.get('/',authenticationMiddleware,viewOwnComment);
router.get('/:id',authenticationMiddleware,viewComments);
module.exports=router