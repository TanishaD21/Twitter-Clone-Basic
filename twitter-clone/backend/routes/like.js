const express=require("express")
const {like,unlike}=require("../controllers/like.js");
const authenticationMiddleware=require("../middlewares/auth.js")
const router=express.Router();

router.post('/:id',authenticationMiddleware,like);
router.delete('/:id',authenticationMiddleware,unlike);

module.exports=router