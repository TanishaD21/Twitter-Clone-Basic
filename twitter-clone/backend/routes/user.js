const express = require('express');

const {
    getUserProfile,
    updateUserProfile,
    viewOtherProfiles,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} = require('../controllers/user');

const authenticationMiddleware = require("../middlewares/auth.js");

const router = express.Router();

router.get('/', authenticationMiddleware, getUserProfile);

router.put('/edit', authenticationMiddleware, updateUserProfile);

router.post('/view',authenticationMiddleware,viewOtherProfiles);

router.post('/follow/:id', authenticationMiddleware, followUser);

router.delete('/unfollow/:id', authenticationMiddleware, unfollowUser);

router.get('/followers', authenticationMiddleware, getFollowers);

router.get('/following', authenticationMiddleware, getFollowing);

module.exports = router;