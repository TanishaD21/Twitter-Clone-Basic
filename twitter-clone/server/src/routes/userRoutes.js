const express = require('express');

const {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowingProfile
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.put('/edit', authMiddleware, updateUserProfile);

router.post('/follow/:id', authMiddleware, followUser);

router.delete('/unfollow/:id', authMiddleware, unfollowUser);

router.get('/followers', authMiddleware, getFollowers);

router.get('/following', authMiddleware, getFollowing);

router.get('/', authMiddleware, getUserProfile);

router.get('/:id', authMiddleware, getFollowingProfile);

module.exports = router;