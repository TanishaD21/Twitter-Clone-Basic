const express = require('express');

const {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.put('/edit', authMiddleware, updateUserProfile);

router.post('/follow/:id', authMiddleware, followUser);

router.delete('/unfollow/:id', authMiddleware, unfollowUser);

router.get('/followers/:id', authMiddleware, getFollowers);

router.get('/following/:id', authMiddleware, getFollowing);

router.get('/:id', authMiddleware, getUserProfile);

module.exports = router;