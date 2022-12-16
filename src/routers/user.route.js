const express = require('express');
const router = express.Router();
const { list, updateProfile, myProfile, Profile, updateImage } = require('../controllers/user.controller');
const jwtAuth = require('../middleware/jwtAuth');
const upload = require('../middleware/upload');

router.get('/user/list', jwtAuth, list).put('/user/update', jwtAuth, updateProfile).put('/user/update/photo', jwtAuth, upload, updateImage).get('/user/profile', jwtAuth, myProfile).get('/user/profile/:id', jwtAuth, Profile);
module.exports = router;
