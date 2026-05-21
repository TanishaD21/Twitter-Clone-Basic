const express=require("express")
const {addComment}=require("../controllers/commentController.js");
const authenticationMiddleware=require("../middleware/authMiddleware.js")
const router=express.Router();
 
router.post('/:id',authenticationMiddleware,addComment);

module.exports=router;