const express=require("express")
const {like,unlike}=require("../controllers/likeController.js");
const authenticationMiddleware=require("../middleware/authMiddleware.js")
const router=express.Router();

router.post('/:id',authenticationMiddleware,like);
router.delete('/:id',authenticationMiddleware,unlike);

module.exports=router