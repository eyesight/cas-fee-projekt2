"use strict";
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const chatController = require('../controllers/chatController');
const avatarController = require('../controllers/avatarController');
const klasseController = require('../controllers/KlasseController');
const security = require('../util/security');

router.get('/something', function(req, res, next) {
  console.log('Enter something.');
});

router.put("/user/update", userController.updateUser);
router.get("/user/show", userController.getAllUserDetails);
router.put("/user/avatar", avatarController.avatarUpload);
router.get("/user/contents", userController.getAllUserContents);
router.put("/user/approve/:id", userController.approveUser);
router.delete("/user/:id", userController.deleteUser);
router.put("/user/passwordchange", security.handlePasswordChange);
router.get("/chat/getall", chatController.getMessages);

router.get("/classlist/all", klasseController.getKlasseListAll);
router.get("/classlist/avatars", klasseController.getKlasseAvatarGetAll);

module.exports = router;
